# -*- coding: utf-8 -*-
"""Shared pieces for the Company pages (About, the three office pages, Careers, Blog, the team page): the office postcards
with a skyline per city and a live local time ({{CO_CITIES}} or {{CO_CITIES:sg}} to leave one office out). Office facts
follow sitedata.OFFICES."""

SKY = {
    "sg": '<svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><g fill="currentColor"><circle cx="66" cy="52" r="34" fill="none" stroke="currentColor" stroke-width="3" opacity=".55"/><path d="M66 52 36 120h8l22-50 22 50h8z" opacity=".55"/><g opacity=".7"><path d="M190 120V44h16v76zM218 120V40h16v80zM246 120V36h16v84z"/><rect x="178" y="28" width="98" height="9" rx="4.5"/></g><path opacity=".45" d="M100 120V70h22v50zM128 120V58h18v62zM300 120V62h20v58zM326 120V50h24v70zM356 120V74h22v46z"/><rect y="104" width="400" height="16" opacity=".25"/></g></svg>',
    "ph": '<svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><g fill="currentColor"><path opacity=".3" d="M0 86q60-22 120-8t120-14 160 10v46H0z"/><g opacity=".55"><path d="M70 120V60h22v60zM98 120V44h20v76zM124 120V66h18v54zM250 120V50h22v70zM278 120V64h20v56zM304 120V40h24v80zM334 120V70h20v50z"/></g><path opacity=".8" d="M186 120 189 18l11-14 11 14 3 102z"/><path opacity=".45" d="M150 120V76h28v44zM220 120V58h22v62zM20 120V84h40v36zM362 120V82h30v38z"/></g></svg>',
    "vn": '<svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><g fill="currentColor"><path opacity=".3" d="M0 102q100-14 200 0t200-4v22H0z"/><g opacity=".8"><path d="M250 120V48h28v72zM254 48V26h20v22zM258 26V12h12v14z"/><rect x="263" y="2" width="2" height="12"/></g><path opacity=".6" d="M120 120q-3-62 6-84l10-6q6 40 4 90z"/><ellipse cx="131" cy="58" rx="12" ry="3" opacity=".7"/><path opacity=".45" d="M20 120V86h26v34zM52 120V74h22v46zM170 120V80h26v40zM206 120V90h30v30zM300 120V70h22v50zM330 120V84h26v36zM362 120V76h24v44z"/></g></svg>',
}

CITIES = [
    {"o": "sg", "tag": "Singapore", "h": "Singapore HQ", "off": 8, "tz": "Singapore", "href": "offices/singapore.html", "link": "Visit Singapore HQ",
     "p": "Headquarters: sales, discovery workshops and on-site work with clients in Singapore.", "addr": "261 Waterloo Street #03-36, Singapore 180261"},
    {"o": "ph", "tag": "Philippines", "h": "Taguig City hub", "off": 8, "tz": "Taguig City", "href": "offices/philippines.html", "link": "Visit the Taguig City hub",
     "p": "Our main development and consulting hub: Odoo developers, consultants and architects, with finance, HR, sales and marketing.", "addr": "Level 9, IP Center, Taguig City, Metro Manila"},
    {"o": "vn", "tag": "Vietnam", "h": "Ho Chi Minh City hub", "off": 7, "tz": "Ho Chi Minh City", "href": "offices/vietnam.html", "link": "Visit the Ho Chi Minh City hub",
     "p": "Our AI engineering hub: the engineers behind TechNext’s enterprise AI, on the same projects.", "addr": '<span lang="vi">62 Nguyễn Thị Nhung, Phường Hiệp Bình</span>, Ho Chi Minh City'},
]


def cities_html(skip: str = "") -> str:
    import pathlib
    pages = pathlib.Path(__file__).resolve().parent / "pages"
    out = []
    for c in CITIES:
        if c["o"] == skip:
            continue
        if not (pages / c["href"]).exists():   # an office page not written yet: point at the directory on /company
            c = dict(c, href="company.html#find-us", link="Find us")
        out.append(f'''      <a class="co-city reveal" data-o="{c["o"]}" href="{{{{ROOT}}}}{c["href"]}">
        <span class="co-city-art">{SKY[c["o"]]}<span class="co-otag">{c["tag"]}</span><span class="co-time" data-cp-clock="{c["off"]}">{{{{icon:clock}}}}<span>--:--</span><span class="sr-only"> in {c["tz"]}</span></span></span>
        <span class="co-city-b"><b class="co-city-h">{c["h"]}</b><span class="co-city-p">{c["p"]}</span><span class="co-city-a">{c["addr"]}</span><span class="btn-link">{c["link"]} {{{{icon:arrow}}}}</span></span>
      </a>''')
    return "\n".join(out)
