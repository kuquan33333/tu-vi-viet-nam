"""Reproduce factual month table using a local Swiss Ephemeris/Moshier installation.
Not a website dependency; no Swiss Ephemeris source or ephemeris files are shipped.
Tested with swisseph.version 2.10.03 and scipy 1.17.0. See methodology.
"""
import datetime as dt
import math
import bisect
import swisseph as swe
from scipy.optimize import brentq

EPOCH=swe.julday(1970,1,1,0)
TZ=7/24
def lon(t,body): return swe.calc_ut(t,body,swe.FLG_MOSEPH)[0][0]
def phase(t): return (lon(t,swe.MOON)-lon(t,swe.SUN)+180)%360-180
def sector(day): return int(lon(EPOCH+day-TZ,swe.SUN)//30)
def civil(t): return math.floor(t-EPOCH+TZ)
starts=[]
t=swe.julday(1898,10,1,0)
end=swe.julday(2052,4,1,0)
v=phase(t)
while t<end:
    u=t+1
    w=phase(u)
    if v<0<=w and w-v<45:
        starts.append(civil(brentq(phase,t,u,xtol=1e-9)))
    t,v=u,w
anchors=[]
for year in range(1898,2052):
    t=swe.julday(year,12,18,0)
    k=bisect.bisect_right(starts,civil(brentq(lambda j:lon(j,swe.SUN)-270,t,t+8,xtol=1e-9)))-1
    if 0<=k<len(starts)-1: anchors.append((year,k))
months=[]
for (y,a),(_,b) in zip(anchors,anchors[1:]):
    count=b-a
    assert count in (12,13)
    leap=next((i for i in range(a+1,b) if sector(starts[i])==sector(starts[i+1])),None) if count==13 else None
    assert count==12 or leap is not None
    month,lunar_y=11,y
    for i in range(a,b):
        if i>a and i!=leap:
            month=month%12+1
            if month==1:lunar_y+=1
        length=starts[i+1]-starts[i]
        assert length in (29,30)
        months.append((lunar_y,month,i==leap,starts[i],length))
codes=[]
for y in range(1899,2051):
    ms=[m for m in months if m[0]==y]
    assert len(ms) in (12,13)
    leap=next((m[1] for m in ms if m[2]),0)
    bits=sum((m[4]-29)<<i for i,m in enumerate(ms))
    codes.append(f'{bits+(leap<<13):05x}')
print('FIRST',next(m[3] for m in months if m[0]==1899))
print('CODES',''.join(codes))
