# -*- coding: utf-8 -*-
"""Nexi Explains: the animated series starring Nexi, listed season by season on /nexi-explains.

One entry per post. `yt` is the YouTube video id once the video is uploaded (scheduled premieres count:
the page counts down to `premiere` and switches the card to "Watch" by itself when that time passes).
Posts without an id show as "Coming soon" (or `airs`, a fixed air date, as the holiday specials have).
To publish a new episode: add its `yt` and `premiere` (UTC, from YouTube Studio), then run `python _src/build.py`.

Thumbnails live in assets/img/nexi-explains/<thumb>.webp (640x360, from the delivered YouTube
thumbnails). A post without a `thumb` gets a drawn card instead: `pose` picks the Nexi render shown on it.

Numbers, titles, lengths (ffprobe of the delivered 16x9 MP4) and air dates follow the Marketing drive,
00. TechNext Folder/20. NEXI Explains: 01. Season 1/00 Posting Plan.md (Season 1 + Quick Tips 01-14),
02. Season 2/00 Season 2 Posting Plan.md, 03. Holiday Specials.
"""

CHANNEL = "https://www.youtube.com/@TechNextAsia"
SUBSCRIBE = CHANNEL + "?sub_confirmation=1"
# Public scheduled premieres (YouTube can set a reminder on these); the other ids stay private until their time.
PUBLIC_PREMIERES = {"KmnP1UptJhs", "xiuyzVw_dYE", "cfM5O03OZkI", "7ouKgR1bj_M", "BxMuXLlDelw", "oD2DQpoBNDg"}


def ep(code, title, hook, length, *, thumb=None, yt=None, premiere=None, airs=None, page=None, pose=None, psych=None, takeaway=None):
    return {"code": code, "title": title, "hook": hook, "len": length, "thumb": thumb, "yt": yt,
            "premiere": premiere, "airs": airs, "page": page, "pose": pose, "psych": psych, "takeaway": takeaway}


S1 = [
    ("The pilot", [
        ep("EP00", "Meet Nexi", "TechNext’s AI companion saves the day: a night city, a spreadsheet monster and four power-ups.", "2:42",
           thumb="s1-ep00", yt="KmnP1UptJhs", premiere="2026-10-13T10:00:00Z", page="nexi.html"),
    ]),
    ("Meet Odoo", [
        ep("EP01", "Odoo Walkthrough with Nexi", "What is Odoo? A quick tour of the apps.", "2:35",
           thumb="s1-ep01", yt="xiuyzVw_dYE", premiere="2026-10-15T10:00:00Z", page="odoo/apps.html"),
        ep("EP02", "All Odoo Apps", "Every app, one Odoo: all the apps on one database.", "2:23", thumb="s1-ep02", yt="cfM5O03OZkI", premiere="2026-10-17T10:00:00Z", page="odoo/apps.html"),
        ep("EP03", "Before vs After: Order to Invoice", "Same order, typed three times? Before and after Odoo.", "2:17",
           thumb="s1-ep03", yt="7ouKgR1bj_M", premiere="2026-10-20T10:00:00Z", page="solutions/odoo-erp.html"),
        ep("EP04", "Myth-busting: ERP Is Only for Big Companies", "Too small for ERP? Myth busted.", "2:23", thumb="s1-ep04", yt="BxMuXLlDelw", premiere="2026-10-22T10:00:00Z", page="solutions/odoo-erp.html"),
        ep("EP05", "Odoo ERP Implementation", "Spreadsheet chaos? How we implement Odoo ERP.", "2:30", thumb="s1-ep05", yt="oD2DQpoBNDg", premiere="2026-10-24T10:00:00Z", page="solutions/odoo-erp.html"),
    ]),
    ("The core apps", [
        ep("EP06", "Odoo Accounting", "It’s a match! Bank lines meet their invoices.", "2:39", thumb="s1-ep06", yt="U3rIsKAfaOU", premiere="2026-10-27T10:00:00Z", page="odoo/apps/accountant.html"),
        ep("EP07", "Odoo Sales", "Slow quotes? From quote to paid with Odoo Sales.", "2:29", thumb="s1-ep07", yt="kUPLH_vbhEU", premiere="2026-10-29T10:00:00Z", page="odoo/apps/sale.html"),
        ep("EP08", "Odoo Inventory", "One box, five steps: Odoo Inventory.", "2:39", thumb="s1-ep08", yt="Sdiy1G-ImeI", premiere="2026-10-31T10:00:00Z", page="odoo/apps/stock.html"),
        ep("EP09", "Inventory Reordering Rules", "Out of stock again? Let reordering rules buy for you.", "2:23", thumb="s1-ep09", yt="3IC8LtvGtYM", premiere="2026-11-03T10:00:00Z", page="odoo/apps/stock.html"),
        ep("EP10", "CRM Development", "Losing leads? Odoo CRM, explained.", "2:31", thumb="s1-ep10", yt="y4qMBNOSm84", premiere="2026-11-05T10:00:00Z", page="odoo/crm-development.html"),
    ]),
    ("Fit Odoo to you", [
        ep("EP11", "Odoo Customization", "Customize Odoo without breaking upgrades.", "2:20", thumb="s1-ep11", yt="geqqCvyZaik", premiere="2026-11-07T10:00:00Z", page="odoo/erp-system.html"),
        ep("EP12", "Enterprise Solution: Multi-company", "Three companies, one Odoo.", "2:37", thumb="s1-ep12", yt="WYlBrTY6l6Q", premiere="2026-11-10T10:00:00Z", page="solutions/enterprise.html"),
    ]),
    ("AI", [
        ep("EP13", "Odoo + AI Integrations", "AI inside Odoo: it prepares, you approve.", "2:27", thumb="s1-ep13", yt="oenBLZBO3os", premiere="2026-11-12T10:00:00Z", page="odoo/ai-integration.html"),
        ep("EP14", "Workflow Automation", "Still doing it by hand? Let the workflow run itself.", "2:24", thumb="s1-ep14", yt="pk4B5FT0hSk", premiere="2026-11-14T10:00:00Z", page="solutions/ai-automation.html"),
        ep("EP15", "AI Chatbots", "Who answers at 2 AM? A chatbot for the night shift.", "2:26", thumb="s1-ep15", yt="Jb94zAXScYM", premiere="2026-11-17T10:00:00Z", page="solutions/ai-chatbots.html"),
    ]),
    ("Marketing", [
        ep("EP16", "Web Design and Development", "Visitors leaving your website? How we build yours.", "2:25", thumb="s1-ep16", yt="aEpZurR1eYQ", premiere="2026-11-19T10:00:00Z", page="solutions/website.html"),
        ep("EP17", "Social Media Management", "No likes? How we run your social media.", "2:30", thumb="s1-ep17", yt="P_STvzbOVTs", premiere="2026-11-21T10:00:00Z", page="solutions/social-media.html"),
        ep("EP18", "Graphic and Brand Assets", "One brand, five logos? How we build a brand system.", "2:29", thumb="s1-ep18", yt="l7Vh268c4zk", premiere="2026-11-24T10:00:00Z", page="solutions/brand-assets.html"),
    ]),
    ("Technology", [
        ep("EP19", "App Development", "Apps for customers, staff and portals.", "2:24", thumb="s1-ep19", yt="MNO3_xAtTko", premiere="2026-11-26T10:00:00Z", page="solutions/app-development.html"),
        ep("EP20", "IoT Solutions", "Freezer too warm? Sensors that warn you first.", "2:23", thumb="s1-ep20", yt="kOnXBh9utrw", premiere="2026-11-28T10:00:00Z", page="solutions/iot.html"),
        ep("EP21", "Networks", "Who’s on your Wi-Fi? Your office network as a castle.", "2:32", thumb="s1-ep21", yt="GRLGFIsgIcM", premiere="2026-12-01T10:00:00Z", page="solutions/networks.html"),
    ]),
    ("The finale", [
        ep("EP22", "Season 1 Finale", "Everything we learned, in a pop-up book, plus a Season 2 sneak peek.", "2:29", thumb="s1-ep22", yt="sxxI1kE88is", premiere="2026-12-03T10:00:00Z"),
    ]),
]

S1_TIPS = [
    ep("Tip 01", "Save your search to Favorites", "Same filter every day? Save it once.", "1:45", thumb="qt01", yt="1GJVoA-N2lQ", premiere="2026-12-04T10:00:00Z"),
    ep("Tip 02", "Jump anywhere with Ctrl+K", "Still clicking through menus? Press Ctrl+K.", "1:50", thumb="qt02", yt="rIx6ClTB384", premiere="2026-12-05T10:00:00Z"),
    ep("Tip 03", "Edit many records at once", "Change twenty records in one go.", "1:55", thumb="qt03", yt="3-ma391DI-U", premiere="2026-12-06T10:00:00Z"),
    ep("Tip 04", "Schedule an activity", "Forgot to follow up? Let Odoo remind you.", "1:55", thumb="qt04", yt="v6agD7p8Y6E", premiere="2026-12-07T10:00:00Z"),
    ep("Tip 05", "Log a note or send a message", "The customer saw it?! Log note vs send message.", "1:37", thumb="qt05", yt="gTHSl62O4Ks", premiere="2026-12-08T10:00:00Z"),
    ep("Tip 06", "Group any list in one click", "Messy lists? Group By in one click.", "1:37", thumb="qt06", yt="9VvewQ5ZYh0", premiere="2026-12-09T10:00:00Z"),
    ep("Tip 07", "Export any list to Excel", "Need it in Excel? Export any list.", "1:47", thumb="qt07", yt="BE0Nf-jNpdA", premiere="2026-12-10T10:00:00Z"),
    ep("Tip 08", "Import a spreadsheet", "Typing it all in? Import the spreadsheet instead.", "1:46", thumb="qt08", yt="UasDVVzOMUQ", premiere="2026-12-11T10:00:00Z"),
    ep("Tip 09", "Archive instead of delete", "Don’t delete it! Archive it.", "1:45", thumb="qt09", yt="Y1kZGX6n6SM", premiere="2026-12-12T10:00:00Z"),
    ep("Tip 10", "Show hidden columns", "Missing a column? It’s only hidden.", "1:49", thumb="qt10", yt="bn5qt11XOxU", premiere="2026-12-13T10:00:00Z"),
    ep("Tip 11", "Create a customer on the fly", "New customer? Add them without leaving the quote.", "1:55", thumb="qt11", yt="6bapSc7JcHY", premiere="2026-12-14T10:00:00Z"),
    ep("Tip 12", "Drag files into the chatter", "Drag, drop, done: attach files to any record.", "1:50", thumb="qt12", yt="atSl2ZCBBiI", premiere="2026-12-15T10:00:00Z"),
    ep("Tip 13", "Switch views in one click", "Same data, four views.", "1:59", thumb="qt13", yt="1g-wXDOqQZc", premiere="2026-12-16T10:00:00Z"),
    ep("Tip 14", "Hold Alt for shortcuts", "Secret shortcuts: hold Alt.", "1:58", thumb="qt14", yt="caaC8ZtyAkU", premiere="2026-12-17T10:00:00Z"),
]

S2 = [
    ("Season opener", [
        ep("S2 EP00", "Season 2 Introduction", "Training, adapting and improving: the map of the season.", "2:54", thumb="s2-ep00", pose="hello",
           psych="Status quo bias", takeaway="Installing Odoo is easy. Changing habits is the hard part."),
    ]),
    ("Arc 1 · The Fear", [
        ep("S2 EP01", "Will Odoo Take My Job?", "Maria from Accounts asked first.", "0:57", thumb="s2-ep01", pose="think",
           psych="Loss aversion", takeaway="Odoo takes tasks, not people."),
        ep("S2 EP02", "Too Old for Odoo?", "Ben, 58, says so. Then we looked at his phone.", "0:59", thumb="s2-ep02", pose="love",
           psych="Fixed mindset", takeaway="Small lessons, on his own tasks.", page="odoo/training.html"),
        ep("S2 EP03", "Scared to Click the Wrong Button?", "Pilots don’t learn on a real plane either.", "1:01", thumb="s2-ep03", pose="wow",
           psych="Psychological safety", takeaway="A test database is a safe place to practise.", page="odoo/training.html"),
        ep("S2 EP04", "Is Odoo Watching Me?", "Every change has your name on it. Here’s what the log is really for.", "0:58", thumb="s2-ep04", pose="point-left",
           psych="Fear of being watched", takeaway="Use the log to fix mistakes, never to blame people."),
    ]),
    ("Arc 2 · The Boss’s Beliefs", [
        ep("S2 EP05", "Will Odoo Fix Our Mess?", "A race car on the wrong road only gets you lost faster.", "2:20", thumb="s2-ep05", pose="jump",
           psych="Silver-bullet thinking", takeaway="Fix the process first, then automate it.", page="odoo/discovery.html"),
        ep("S2 EP06", "Odoo Is Free, Right?", "Jun found it online. Then we met Biscuit, the free puppy.", "2:17", thumb="s2-ep06", pose="love",
           psych="Planning fallacy", takeaway="Free to start. Budget to succeed.", page="quotation.html"),
        ep("S2 EP07", "Can Odoo Work Exactly Like Our Old Way?", "Maria’s 14 tabs, and the blue button that does nothing.", "2:28", thumb="s2-ep07", pose="think",
           psych="Sunk cost", takeaway="Standard first. Customize what earns money.", page="odoo/erp-system.html"),
        ep("S2 EP08", "IT Will Handle It!", "There is no IT department. Here’s who really owns your Odoo project.", "2:18", thumb="s2-ep08", pose="wow",
           psych="Diffusion of responsibility", takeaway="One owner, plus the people who do the work."),
    ]),
    ("Arc 3 · Winning and Serving Customers", [
        ep("S2 EP09", "Nobody Opens Your Emails", "2,000 contacts, 11 opens. Why your name beats a megaphone.", "2:16", thumb="s2-ep09", pose="point-left",
           psych="The cocktail party effect", takeaway="Write to one person, not to everyone.", page="odoo/apps/mass_mailing.html"),
        ep("S2 EP10", "Customers Ask “How Much?” in Chat", "49 of 50 chats say “how much?”.", "2:13", thumb="s2-ep10", pose="celebrate",
           psych="Friction", takeaway="Remove the extra steps, and buyers buy.", page="odoo/apps/website_sale.html"),
        ep("S2 EP11", "Long Queue at the Counter", "The Saturday queue goes out the door. Ben trades his calculator for a tablet.", "2:20", thumb="s2-ep11", pose="clap",
           psych="The psychology of waiting", takeaway="Every sale updates stock and accounting.", page="odoo/apps/point_of_sale.html"),
        ep("S2 EP12", "Print, Sign, Scan, Email?", "The customer said yes. A week later: “let’s talk next month”.", "2:18", thumb="s2-ep12", pose="jump",
           psych="Momentum", takeaway="Make the yes easy, right now.", page="odoo/apps/sign.html"),
        ep("S2 EP13", "Customer Asked 3 Times", "Mrs. Tan asked three times. Then she ordered ten more chairs.", "2:20", thumb="s2-ep13", pose="hello",
           psych="The peak-end rule", takeaway="Fix the worst moment. End with a smile.", page="odoo/apps/helpdesk.html"),
    ]),
]

S2_TIPS = [
    ep("Tip 15", "Duplicate a record", "The same quote again? Duplicate it.", "0:57", thumb="qt15"),
    ep("Tip 16", "Follow the breadcrumbs", "Three screens deep? The breadcrumbs take you back.", "0:55", thumb="qt16"),
    ep("Tip 17", "Build a custom filter", "Filter on any field, not just the presets.", "0:55", thumb="qt17"),
    ep("Tip 18", "Search one field", "Type, then pick the field to search in.", "0:54", thumb="qt18"),
    ep("Tip 19", "Follow a record", "Follow it, and its updates come to you.", "0:55", thumb="qt19"),
    ep("Tip 20", "Drag cards between stages", "Move a deal or a task by dragging its card.", "0:54", thumb="qt20"),
    ep("Tip 21", "Send a quotation by email", "Send the quote, PDF attached, from the record.", "0:59", thumb="qt21"),
    ep("Tip 22", "Jump with smart buttons", "Everything linked to a record, one click away.", "0:55", thumb="qt22"),
    ep("Tip 23", "Reschedule in the calendar", "Drag the meeting to its new time.", "0:54", thumb="qt23"),
    ep("Tip 24", "Odoo saves for you", "Leave the record and your changes are saved.", "0:55", thumb="qt24"),
    ep("Tip 25", "Combine filters with AND and OR", "Mix filters the way you mean them.", "1:41", thumb="qt25"),
    ep("Tip 26", "Step through periods", "Last month? One click on the date arrows.", "1:38", thumb="qt26"),
    ep("Tip 27", "Pivot like a pro", "Turn any list into a pivot table.", "1:37", thumb="qt27"),
    ep("Tip 28", "Change the chart type", "Bar, line or pie in one click.", "1:40", thumb="qt28"),
    ep("Tip 29", "Sort and resize columns", "Click to sort, drag to resize.", "1:36", thumb="qt29"),
    ep("Tip 30", "Select all records", "Every record, not just the first page.", "1:34", thumb="qt30"),
    ep("Tip 31", "Add a to-do from anywhere", "One shortcut adds a to-do from any screen.", "1:40", thumb="qt31"),
    ep("Tip 32", "React to a message", "Answer a chatter message with an emoji.", "1:40", thumb="qt32"),
    ep("Tip 33", "Quick-add a card", "Add a card without opening a form.", "1:37", thumb="qt33"),
    ep("Tip 34", "Inbox or email notifications", "Choose where your notifications land.", "1:37", thumb="qt34"),
]

SPECIALS = [
    ep("Halloween", "The Haunted Office", "Five Season 1 lessons come back as office monsters.", "2:44", thumb="hs-halloween", airs="31 Oct"),
    ep("Christmas", "The Christmas Rush", "The busiest week of the year, run on Odoo.", "2:38", thumb="hs-christmas", airs="24 Dec"),
    ep("Year-End", "The Countdown", "Ten Season 1 lessons go up as midnight fireworks.", "2:40", thumb="hs-yearend", airs="31 Dec"),
]

SEASONS = [
    {"id": "season-1", "tab": "Season 1", "name": "Odoo, AI and tech, made simple",
     "blurb": "Twenty-three short episodes: what Odoo is, the apps companies start with, and every TechNext service, each told as a small story with Nexi in a new costume.",
     "status": "Now premiering", "arcs": S1, "tips": S1_TIPS, "tips_name": "Quick Tips 01–14"},
    {"id": "season-2", "tab": "Season 2", "name": "The Human Side of Odoo",
     "blurb": "Installing Odoo is easy. Changing habits is the hard part. Each episode takes one real fear about moving a company onto Odoo, names the psychology behind it and shows the fix, with the Bluebay Trading team.",
     "status": "Coming in 2027", "arcs": S2, "tips": S2_TIPS, "tips_name": "Quick Tips 15–34",
     "more": "More episodes are planned after Arc 3."},
]

# ---------------------------------------------------------------- Characters (the "Characters" category)
# One card each, grouped per season. Lines are the episodes' own hooks and the hero cast notes, nothing new.
# `art`: "img:<path under assets/img/>" for a render, "draw:<name>" for a sidekick drawn live by
# nexi-explains-cast.js from the episode's own drawing, or None (no artwork yet: a lettered card is shown).
def ch(name, role, line, art=None, eps=(), page=None):
    return {"name": name, "role": role, "line": line, "art": art, "eps": list(eps), "page": page}


CHARACTERS = [
    {"id": "cast-season-1", "tab": "Season 1", "name": "Nexi and the Season 1 sidekicks",
     "blurb": "Nexi stars in every episode, in a new costume each time. Season 1 was remade with one animal sidekick per episode; the art below is drawn from the episodes themselves.",
     "cast": [
         ch("Nexi", "The star · TechNext’s AI companion", "One idea per episode, told as a little story.", "img:nexi-explains/nexi-hello.webp", ["EP00–EP22"], "nexi.html"),
         ch("The helper bots", "EP00 · Meet Nexi", "Nexi’s little helper bots, who act out the AI demos in the lab.", "draw:bots", ["EP00"]),
         ch("The spreadsheet monster", "EP00 · Meet Nexi", "The villain of the pilot: spreadsheet chaos with claws.", "draw:monster", ["EP00"]),
         ch("Pango", "A pangolin · EP00 Meet Nexi", "Rolls into a scared ball when the monster stomps, then rides along on the plane’s tail.", "img:nexi-explains/cast/pango.webp", ["EP00"]),
         ch("Dot", "A duckling · EP01 Odoo Walkthrough", "Follows Tour Guide Nexi everywhere with the tour passport, and slips on the last lily pad.", "img:nexi-explains/cast/dot.webp", ["EP01"]),
         ch("Boba", "A city-hall capybara · EP02 All Odoo Apps", "Calm, with an orange balanced on her head, she carries one order from island to island.", "img:nexi-explains/cast/boba.webp", ["EP02"]),
         ch("Chip", "A beaver · EP03 Before vs After", "The oak-chair carpenter who drowns in paperwork, then finally sits in his own chair.", "img:nexi-explains/cast/chip.webp", ["EP03"]),
         ch("Atlas", "A red ant · EP04 Myth-busting", "The myth lab’s tiny assistant with mighty muscles.", "img:nexi-explains/cast/atlas.webp", ["EP04"]),
         ch("Peanut", "An elephant calf · EP05 ERP Implementation", "An eager builder in a mini hard hat who always wants to stack it higher, then hands over the key to the new house.", "img:nexi-explains/cast/peanut.webp", ["EP05"]),
         ch("Mango", "A lovebird · EP06 Odoo Accounting", "The game show’s co-host: she swoons at every match.", "img:nexi-explains/cast/mango.webp", ["EP06"]),
         ch("Sprocket", "The shop corgi · EP07 Odoo Sales", "Lost in the paper chaos, then rides the basket to Lotus Mart.", "img:nexi-explains/cast/sprocket-corgi.webp", ["EP07"]),
         ch("Cosmo", "A golden hamster · EP08 Odoo Inventory", "The cargo deck’s seed-hoarding stock keeper, who stuffs his cheeks and loses count.", "img:nexi-explains/cast/cosmo.webp", ["EP08"]),
         ch("Bao", "A panda · EP09 Reordering Rules", "Loves bamboo, until her rack runs empty.", "img:nexi-explains/cast/bao.webp", ["EP09"]),
         ch("Penny", "A fox porter · EP10 CRM Development", "Counts every coin on the CRM railway and gets the golden coin at the end.", "img:nexi-explains/cast/penny.webp", ["EP10"]),
         ch("Pebble", "A marmot · EP11 Odoo Customization", "Whistles whenever the climb gets risky, and stays quiet at a safe summit.", "img:nexi-explains/cast/pebble.webp", ["EP11"]),
         ch("Skipper", "A seagull · EP12 Multi-company", "The ground crew in a high-vis vest, re-tagging the same bag for three systems.", "img:nexi-explains/cast/skipper.webp", ["EP12"]),
         ch("Olive", "An owl · EP13 Odoo + AI Integrations", "Keeps the manor’s records, with a bow tie that matches Nexi’s.", "img:nexi-explains/cast/olive.webp", ["EP13"]),
         ch("Sprocket", "An otter · EP14 Workflow Automation", "Never lets go of his favourite pebble, until it falls into the machine.", "img:nexi-explains/cast/sprocket-otter.webp", ["EP14"]),
         ch("Rocco", "A raccoon bellhop · EP15 AI Chatbots", "Dying to ring the service bell all night, and finally gets to.", "img:nexi-explains/cast/rocco.webp", ["EP15"]),
         ch("Turbo", "A snail · EP16 Web Design", "Slow himself, so he spots a slow website.", "img:nexi-explains/cast/turbo.webp", ["EP16"]),
         ch("Bramble", "A hedgehog · EP17 Social Media", "Posts five times on a Monday, then naps for a month.", "img:nexi-explains/cast/bramble.webp", ["EP17"]),
         ch("Plume", "A peacock · EP18 Brand Assets", "Her tail ruffles at anything off-brand, and she gets her own runway moment.", "img:nexi-explains/cast/plume.webp", ["EP18"]),
         ch("Kiko", "A meerkat · EP19 App Development", "Stands on guard in the service van, photobombs the job photo and earns Chief Lookout.", "img:nexi-explains/cast/kiko.webp", ["EP19"]),
         ch("Wally", "A walrus · EP20 IoT Solutions", "Chef Nexi’s sous-chef: nobody in the kitchen loves the cold more, and he gets his ice lolly.", "img:nexi-explains/cast/wally.webp", ["EP20"]),
         ch("Ribbit", "A moat frog · EP21 Networks", "Croaks the alarm at the castle gate and is made Sir Ribbit.", "img:nexi-explains/cast/ribbit.webp", ["EP21"]),
         ch("Paige", "A bookworm · EP22 Season 1 Finale", "Lives in the pop-up book, spins a cocoon and comes out a butterfly.", "img:nexi-explains/cast/paige.webp", ["EP22"]),
     ]},
    {"id": "cast-season-2", "tab": "Season 2", "name": "The Bluebay Trading team",
     "blurb": "Season 2 follows the people of Bluebay Trading as they move onto Odoo. Their artwork arrives with the season.",
     "cast": [
         ch("Nexi", "The guide", "Names the psychology behind each fear, then shows the fix.", "img:nexi-explains/nexi-think.webp", ["S2 EP00–EP13"]),
         ch("Maria", "Accounts", "Asked first: will Odoo take my job? Then came her 14 tabs.", None, ["S2 EP01", "S2 EP07"]),
         ch("Ben", "Warehouse lead, 58", "He was sure he was too old for Odoo, until we looked at his phone. Later he trades his calculator for a tablet.", None, ["S2 EP02", "S2 EP11"]),
         ch("Jun", "Sales", "Found “free Odoo” online. Odoo is free, right? Then we met Biscuit.", None, ["S2 EP06"]),
         ch("Mr. Lim", "The Boss", "Arc 2 is his: what the boss believes before buying Odoo.", None, ["S2 EP04", "S2 EP05", "S2 EP06", "S2 EP07", "S2 EP08"]),
         ch("Biscuit", "The free puppy", "Free to start. Budget to succeed.", None, ["S2 EP06"]),
         ch("Mrs. Tan", "A customer", "Asked three times. Then she ordered ten more chairs.", None, ["S2 EP13"]),
     ]},
]

# Nexi's industry costumes (assets/img/industries/<key>/): one pose per card (and a second one on hover).
COSTUMES = ["medical", "travel", "retail", "ecommerce", "construction", "fnb", "manufacturing", "health-wellness"]
COSTUME_POSES = {"medical": ("hello", "love"), "travel": ("point-right", "celebrate"), "retail": ("present", "wow"),
                 "ecommerce": ("celebrate", "hello"), "construction": ("think", "clap"), "fnb": ("love", "present"),
                 "manufacturing": ("clap", "point-left"), "health-wellness": ("wow", "think")}

# Nexi's Season 1 wardrobe: the role and costume she wears in each episode (the films' intro badges and wear() calls,
# nexi-tutorial/web/films/*.js), rendered from her 3D model in that costume (assets/img/nexi-explains/wardrobe/).
def wd(key, name, costume, line, eps):
    return {"key": key, "name": name, "costume": costume, "line": line, "eps": list(eps)}


WARDROBE = [
    wd("tour-guide", "Tour Guide Nexi", "Blue cap", "A sunny park tour: one order, stop by stop through Odoo.", ["EP01"]),
    wd("mayor", "Mayor Nexi", "Top hat", "Odoo City: every app on one shared grid.", ["EP02"]),
    wd("hard-hat", "Hard-hat Nexi", "Hard hat", "Builds it in order: blueprint, foundation, rooms, housewarming.", ["EP03", "EP05"]),
    wd("myth-lab", "Myth-buster Nexi", "Lab goggles", "The myth, three tests, the verdict.", ["EP04"]),
    wd("matchmaker", "Matchmaker Nexi", "Heart boppers", "It’s a match! Bank lines meet their invoices.", ["EP06"]),
    wd("shopkeeper", "Shopkeeper Nexi", "Cycling helmet", "Nexi’s Bike Shop: one order from quote to invoice.", ["EP07"]),
    wd("commander", "Commander Nexi", "Space helmet", "The cargo deck: one transfer from receipt to put-away.", ["EP08"]),
    wd("keeper", "Keeper Nexi", "Zookeeper cap", "A sunny bamboo garden that never runs out.", ["EP09"]),
    wd("conductor", "Conductor Nexi", "Conductor cap", "The CRM railway. Next stop: Won.", ["EP10"]),
    wd("guide", "Guide Nexi", "Knit beanie", "The customization trail, up to the summit.", ["EP11"]),
    wd("captain", "Captain Nexi", "Pilot cap", "Captain Nexi’s airline: three companies, one Odoo.", ["EP12", "EP00"]),
    wd("butler", "Nexi the butler", "Bow tie", "The butler prepares, you approve.", ["EP13"]),
    wd("inventor", "Inventor Nexi", "Goggles", "An agent machine that runs the steps. You keep the decision.", ["EP14"]),
    wd("concierge", "Concierge Nexi", "Bellhop cap", "The night shift, open all hours.", ["EP15"]),
    wd("inspector", "Inspector Nexi", "Glasses", "A slow website, inspected and renovated. Case closed.", ["EP16"]),
    wd("gardener", "Nexi the gardener", "Straw hat", "Social channels are a garden: planned, planted, watered on schedule.", ["EP17"]),
    wd("stylist", "Stylist Nexi", "Beret", "A brand is a wardrobe.", ["EP18"]),
    wd("technician", "Technician Nexi", "Cap", "A site visit, run from one app.", ["EP19"]),
    wd("chef", "Chef Nexi", "Chef’s hat", "The cold store, fresh and watched.", ["EP20"]),
    wd("gatekeeper", "Gatekeeper Nexi", "Knight’s helmet", "Your office network as a castle.", ["EP21"]),
    wd("host", "Host Nexi", "Bow tie", "Party time: the Season 1 finale recap.", ["EP22", "EP00"]),
]

# Comics: none published yet; the Comics category shows a "coming soon" panel until entries are added here.
COMICS = []
