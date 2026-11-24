"""QA only: list potentially matching old district coordinates from GeoNames.
No runtime data is written. Even an exact match is an administrative reference
point, not a person's exact birthplace. Ambiguities must be reviewed manually.
"""
import json, sys, re, unicodedata, zipfile, hashlib
from pathlib import Path
from collections import defaultdict

zip_path,admin_path,source_path,out_dir=map(Path,sys.argv[1:5])
out_dir.mkdir(parents=True,exist_ok=True)
def norm(v):
    v=unicodedata.normalize("NFD",v.lower().replace("đ","d"))
    v="".join(c for c in v if unicodedata.category(c)!="Mn")
    v=re.sub(r"[^a-z0-9 ]"," ",v)
    v=re.sub(r"\b(?:tinh|thanh pho|huyen|quan|thi xa|district|province|city|municipality)\b"," ",v)
    return " ".join(v.split())
src=source_path.read_text()
provinces=json.loads(re.search(r'LEGACY_PROVINCES:.*?=(\{.*?\});',src,re.S).group(1))
districts=re.search(r'LEGACY_DISTRICT_ROWS=\x60(.*?)\x60;',src,re.S).group(1).splitlines()
assert len(provinces)==63 and len(districts)==696
admins={}
for line in admin_path.read_text().splitlines():
    cols=line.split("\t")
    if len(cols)>=4 and cols[0].startswith("VN."):
        admins[cols[0].split(".")[1]]={norm(cols[1]),norm(cols[2])}
by_name=defaultdict(list)
with zipfile.ZipFile(zip_path) as archive:
    for line in archive.read("VN.txt").decode().splitlines():
        f=line.split("\t")
        if len(f)!=19 or f[8]!="VN" or f[7]!="ADM2": continue
        lat,lon=float(f[4]),float(f[5])
        if not (8<=lat<=24 and 102<=lon<=117):continue
        item={"geonameId":f[0],"name":f[1],"latitude":lat,"longitude":lon,
              "admin1":f[10],"admin2":f[11],"featureCode":f[7],"modified":f[18],
              "sourceUrl":"https://www.geonames.org/"+f[0]+"/"}
        for name in {norm(v) for v in [f[1],f[2],*f[3].split(",")] if norm(v)}:
            by_name[name].append(item)
rows=[]
for line in districts:
    code,name,province_code=line.split("|")
    p=provinces[province_code]
    possible={v["geonameId"]:v for v in by_name[norm(name)]}
    # Require exact old-province label; the current province alone is not enough
    # to disambiguate identical district names following mergers.
    qualified=[v for v in possible.values() if norm(p["name"]) in admins.get(v["admin1"],set())]
    rows.append({"code":code,"name":name,"oldProvince":p["name"],
                 "currentProvince":p["current"],"status":"candidate" if len(qualified)==1 else "ambiguous" if len(qualified)>1 else "unresolved",
                 "qualified":qualified,"allNameMatches":list(possible.values())})
summary={"source":"GeoNames Vietnam ADM2 dump, CC BY 4.0",
         "source_url":"https://download.geonames.org/export/dump/VN.zip",
         "dump_sha256":hashlib.sha256(zip_path.read_bytes()).hexdigest(),
         "admin_sha256":hashlib.sha256(admin_path.read_bytes()).hexdigest(),
         "total":len(rows),
         **{status:sum(r["status"]==status for r in rows) for status in ["candidate","ambiguous","unresolved"]},
         "note":"Candidate coordinates not automatically adopted. Old district centre/reference point is not exact birthplace."}
(out_dir/"geonames-district-candidates.json").write_text(json.dumps(rows,ensure_ascii=False,indent=2)+"\n")
(out_dir/"geonames-summary.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2)+"\n")
print("GEONAMES_QA "+json.dumps(summary,ensure_ascii=False))
