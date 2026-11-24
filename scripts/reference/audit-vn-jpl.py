"""QA only: adjudicate near-midnight events using JPL DE440s and Skyfield.
Times use UT1 for pre-UTC history, with a fixed +07:00 civil-day convention.
No birth data, no runtime dependency, no automatic modification of calendar.
"""
import datetime as dt
import hashlib
import json
from pathlib import Path
import sys
import skyfield
from skyfield.api import load, load_file
from skyfield import almanac

path=Path(sys.argv[1])
out=Path(sys.argv[2])
out.parent.mkdir(parents=True,exist_ok=True)
ts=load.timescale(builtin=True)
eph=load_file(str(path))
events=[
    ("1938-autumn-equinox",1938,9,23,almanac.seasons(eph),2),
    ("1944-new-moon",1944,6,20,almanac.moon_phases(eph),0),
    ("1967-new-moon",1967,7,7,almanac.moon_phases(eph),0),
]
origin=dt.datetime(2000,1,1,12)
results=[]
for label,y,m,d,fn,want in events:
    t0=ts.ut1(y,m,d,0)
    t1=ts.ut1(y,m,d+2,0)
    times,types=almanac.find_discrete(t0,t1,fn)
    selected=[t for t,k in zip(times,types) if int(k)==want]
    assert len(selected)==1,(label,len(selected))
    t=selected[0]
    ut1=origin+dt.timedelta(days=float(t.ut1)-2451545.0)
    local=ut1+dt.timedelta(hours=7)
    midnight=local.replace(hour=0,minute=0,second=0,microsecond=0)
    seconds=(local-midnight).total_seconds()
    signed=seconds if seconds<43200 else seconds-86400
    results.append({
      "event":label,"ut1":ut1.isoformat(timespec="milliseconds"),
      "civil_plus_7":local.isoformat(timespec="milliseconds"),
      "seconds_relative_to_nearest_midnight":round(signed,3),
      "delta_t_seconds":float(t.delta_t),
      "interpretation":"pre-midnight" if signed<0 else "post-midnight",
      "note":"UT1 historical estimate; not modern UTC timestamp"
    })
report={"ephemeris":"JPL DE440s","ephemeris_sha256":hashlib.sha256(path.read_bytes()).hexdigest(),
        "skyfield_version":skyfield.__version__,"results":results}
out.write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n")
print("JPL_BOUNDARY_QA "+json.dumps(report,ensure_ascii=False))
eph.close()
