# python home_stills.py <out_dir> [name=page ...]: recapture homepage world stills from each page's hero (card hidden)
import os, sys, time, base64, io, pathlib
sys.path.insert(0, str(pathlib.Path.home() / "ClaudeWork/qa/nexi"))
import cdp
from PIL import Image
BASE = os.environ.get("BASE", "http://127.0.0.1:4010")
MAP = {"company": "company", "discovery": "odoo/discovery", "training": "odoo/training", "integration": "odoo/integration",
       "support": "odoo/support", "sales": "odoo/apps/sales", "inventory": "odoo/apps/inventory", "accounting": "odoo/apps/accounting",
       "sol-erp": "solutions/odoo-erp", "sol-ai": "solutions/ai", "sol-mkt": "solutions/marketing", "sol-tech": "solutions/technology",
       "blog": "blog", "apps": "odoo/apps"}
for _i in ("medical","travel","retail","ecommerce","construction","fnb","manufacturing","health-wellness"): MAP["ind-"+_i] = "industries/"+_i
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
only = sys.argv[2:] or list(MAP)
HIDE = """(()=>{const p=document.querySelector('.ixw-peek'); if(p) p.click();
const st=document.createElement('style'); st.textContent='.ixw-peek,.ixw-caption,.ixw-cap,.ixw-tour,.ixw-hint,[class*=cookie],.ixw-credits-wrap{visibility:hidden!important}';
document.head.appendChild(st);
document.querySelectorAll('body *').forEach(e=>{const s=getComputedStyle(e); if(s.position==='fixed'||s.position==='sticky') e.style.visibility='hidden'}); if(location.pathname.includes('/industries/')) {const t=document.createElement('style'); t.textContent='.ixw-hero .ixw-nexi,.ixw-hero [data-ixw-nexi],.ixw-hero img[src*="nexi"]{display:none!important}'; document.head.appendChild(t);}
const h=document.querySelector('.ixw-hero'); const r=h.getBoundingClientRect(); return [r.top+scrollY, r.height]})()"""
for name in only:
    page = MAP[name]
    proc, c = cdp.session("%s/%s?nointro=1" % (BASE, page), 1440, 1000)
    try:
        time.sleep(1.5)
        top, h = c.ev(HIDE)
        time.sleep(2.5)
        ratio = 2.25 if name == "apps" else (16/9 if name.startswith("ind-") else 1.896)
        ch = round(1440 / ratio)
        y = max(0, top + h - ch - 8)
        shot = c.call("Page.captureScreenshot", format="png", clip={"x": 0, "y": y, "width": 1440, "height": ch, "scale": 1})
        im = Image.open(io.BytesIO(base64.b64decode(shot["data"]))).convert("RGB")
        w = 1200 if name == "apps" else (960 if name.startswith("ind-") else 800)
        im = im.resize((w, round(w / ratio)), Image.LANCZOS)
        im.save(out / (name + ".webp"), "WEBP", quality=82, method=6)
        print(name, im.size, round(h))
    finally:
        proc.terminate()
