# -*- coding: utf-8 -*-
"""Content for the expanded industry pages (build.py renders it with {{INDUSTRY_INTRO:key}} and
{{INDUSTRY:key}}). Everything here is either how Odoo works (checked against odoo.com and the
Odoo 20 release notes) or how TechNext implements it. Dashboards use clearly labelled sample
figures only. Screenshots are named by their odoo.com path ("pos/interface.webp") and resolved
against apps_content.json; "O20:x" refers to the Odoo 20 launch images below.

Per industry:
  intro   a 40-60 word direct answer for the top of the page
  flow    six process steps: app (Odoo icon) or icon, t (label), h, p, odoo (where in Odoo), was
  ba      before/after rows: (task, today, with Odoo)
  chart   title, kpis [(label, value)], views [{label, unit, bars [(label, v)] or pairs [(label, a, b)],
          legend}], reports (standard Odoo reports worth knowing)
  video   (YouTube id, title) — official Odoo videos only
  shots   [(image, caption)]
  new20   items from the Odoo 20 release notes that matter to this industry
  phases  three rollout phases: h, apps, items
  integrations [(icon, label)]
  faqs    [(question, answer)]
  reading blog slugs for "keep reading"
"""

# Odoo 20 launch screenshots from odoo.com's "Meet Odoo 20" post (Odoo S.A.)
O20 = {
    "crm_leadgen": "https://odoocdn.com/web/image/135772670-4f8b6ba1/Screenshot%202026-09-22%20at%2014.24.51.webp?access_token=8201ba03-827e-49df-9ccc-246af3441280",
    "purchase_inv": "https://odoocdn.com/web/image/135772659-ac9bbe21/Screenshot%202026-09-22%20at%2014.25.36.webp?access_token=7d2577c6-267b-41b1-9023-07363ce559f3",
    "mrp": "https://odoocdn.com/web/image/135772665-6273df57/Screenshot%202026-09-22%20at%2014.26.17.webp?access_token=e64a767e-43a3-4fdf-afec-f64eae6eeb3f",
    "planning_fsm": "https://odoocdn.com/web/image/135772821-c3568031/Screenshot%202026-09-22%20at%2014.27.15.webp?access_token=715c4bf6-84a7-4b06-be14-5543ff8f71e8",
    "acct_assistant": "https://odoocdn.com/web/image/135886821-72f348bb/Screenshot%202026-09-23%20at%2012.47.13.webp?access_token=4ae9ffe1-1b09-40b6-bbd7-26f12cb3eda6",
    "oe_photo": "https://odoocdn.com/web/image/136007952-5c4df806/IMG_6137.webp?access_token=9c59c0d8-3396-4bd8-9970-85111dceccdd",
}

IND = {
    # ------------------------------------------------------------------ RETAIL
    "retail": {
        "name": "Retail", "noun": "retailers",
        "intro": "Odoo for retail connects the till, stock, purchasing, the online store and accounting in one database. Every sale at any store moves stock, reorders are raised from minimum levels, and each day's takings post to the books without a spreadsheet in between.",
        "flow_title": "From supplier to till to the books, in one system.",
        "flow_lead": "Six steps every retailer runs, and where each one lives in Odoo. Pick a step to see what changes.",
        "flow": [
            {"app": "purchase", "t": "Buy", "h": "Suppliers ordered from stock rules", "p": "Minimum-stock rules at each store raise purchase orders with the vendor's price and lead time, so buyers approve orders instead of walking the shelves.", "odoo": "Purchase · reordering rules, vendor pricelists", "was": "A weekly stock walk and a reorder spreadsheet"},
            {"app": "stock", "t": "Receive", "h": "Goods scanned in, stock live", "p": "Receipts are scanned with a barcode device. Stock at that store updates at once, and the vendor bill is matched to what actually arrived.", "odoo": "Inventory + Barcode · receipts, three-way match", "was": "Delivery notes filed, stock updated later"},
            {"app": "stock", "t": "Move", "h": "Transfers between stores", "p": "A store short of an item requests it from another. The transfer shows in both stores until it is received, so nothing goes missing in between.", "odoo": "Inventory · transfers between warehouses", "was": "Messages between store managers"},
            {"app": "point_of_sale", "t": "Sell", "h": "Sell at the till, even offline", "p": "The Point of Sale keeps selling when the internet drops and syncs later. Barcodes, promotions, loyalty and gift cards run at the till, and every sale moves stock.", "odoo": "Point of Sale · offline selling, loyalty", "was": "A standalone till system"},
            {"app": "website_sale", "t": "Online", "h": "The same stock online", "p": "The online store sells the same products with live stock, and store-pickup orders reserve items at the chosen store.", "odoo": "eCommerce · shared catalogue and stock", "was": "A separate web shop with its own stock count"},
            {"app": "accountant", "t": "Close", "h": "Takings posted, settlements matched", "p": "Closing a POS session posts sales, taxes and payment methods to Accounting. Card settlements are matched from the bank feed.", "odoo": "Accounting · POS journals, bank reconciliation", "was": "Z-reports typed in every evening"},
        ],
        "ba": [
            ("Daily takings", "Z-report typed into accounting each evening", "POS session closes to a journal entry"),
            ("Stock on hand", "Counted per store, merged in a spreadsheet", "Live per store and online"),
            ("Reordering", "Buyer walks the shelves and emails suppliers", "Reordering rules raise purchase orders"),
            ("Store transfers", "Arranged by message, counts drift", "Transfer documents both stores can see"),
            ("Promotions", "Set up separately on each till", "One loyalty and promotion setup for every store"),
            ("Card settlements", "Ticked off against bank statements", "Matched from the bank feed"),
        ],
        "chart": {
            "title": "Sales by store", "kpis": [("Takings today", "S$ 18.4k"), ("Items below minimum", "12"), ("Transfers in transit", "4")],
            "shared": True,
            "views": [
                {"label": "This week", "unit": "S$k", "bars": [("Store A", 42.6), ("Store B", 35.2), ("Store C", 27.9), ("Online", 18.4)]},
                {"label": "Last week", "unit": "S$k", "bars": [("Store A", 39.1), ("Store B", 36.8), ("Store C", 25.4), ("Online", 15.2)]},
            ],
            "reports": ["POS sales by store, product and hour", "Margin by product and category", "Stock valuation per location", "Best and slowest sellers"],
        },
        "video": ("5Bl60GkEa50", "Manage your shop with Odoo Point of Sale"),
        "shots": [("pos/interface.webp", "Point of Sale: the till"), ("pos/cross_channel_selling_1.webp", "Selling across channels"),
                  ("inventory/optimize_warehouse.webp", "Inventory by location"), ("O20:purchase_inv", "Odoo 20: purchasing and inventory")],
        "new20": ["Snooze products to make them temporarily unavailable on the POS or the self-ordering menu",
                  "Take several currencies at checkout in the same point of sale",
                  "Suggested minimum and maximum stock levels for reordering rules, from demand history",
                  "A stock aging report, and loyalty points that can expire"],
        "phases": [
            {"h": "One store live", "apps": ["point_of_sale", "stock", "accountant"], "items": ["Products, barcodes and prices loaded", "POS, payment terminals and receipts set up", "Sessions closing to Accounting"]},
            {"h": "Purchasing and more stores", "apps": ["purchase", "stock", "point_of_sale"], "items": ["Reordering rules and vendor pricelists", "Transfers and cycle counts between stores", "Next stores rolled out on the same setup"]},
            {"h": "Online and loyalty", "apps": ["website_sale", "mass_mailing", "spreadsheet_dashboard"], "items": ["Online store on the same stock, with store pickup", "Loyalty, gift cards and promotions everywhere", "Dashboards by store, category and hour"]},
        ],
        "integrations": [("cart", "Card terminals supported by Odoo POS"), ("bank", "Bank feeds for card settlements"), ("receipt", "Receipt printers and barcode scanners"),
                         ("globe", "eCommerce on the same stock"), ("heart", "Loyalty, gift cards and eWallets"), ("layers", "Multi-store and multi-company")],
        "faqs": [
            ("Does Odoo Point of Sale work offline?", "Yes. Odoo Point of Sale keeps selling through internet outages and syncs orders when the connection returns. Card payments depend on your terminal's own connection."),
            ("Can Odoo manage stock across several stores?", "Yes. Each store is its own warehouse or location with live stock, transfers between stores and reordering rules per store."),
            ("Can we run loyalty and promotions in Odoo?", "Yes. Loyalty programs, gift cards, eWallets, coupons and promotions are set up once and apply at every till, and online if you use Odoo eCommerce."),
            ("Do daily takings post to accounting automatically?", "Yes. Closing a POS session posts sales, taxes and payment methods to Accounting, and card settlements reconcile from the bank feed."),
            ("Where does TechNext start with a retailer?", "With one store: products, POS, stock and accounting go live first, then the same setup rolls out store by store."),
        ],
        "reading": ["blog/signs-you-have-outgrown-spreadsheets.html", "blog/how-an-odoo-implementation-works.html"],
    },

    # ------------------------------------------------------------------ F&B
    "fnb": {
        "name": "F&amp;B", "noun": "restaurants and cafés",
        "intro": "Odoo for F&amp;B runs the front and back of a restaurant on one system: Point of Sale for tables, takeaway and self-ordering, a kitchen display, recipes that deduct ingredients, purchasing for the central kitchen, and each outlet's takings posted to Accounting.",
        "flow_title": "From the supplier to the table to the books.",
        "flow_lead": "How an order and its ingredients move through a restaurant group in Odoo. Pick a step to see what changes.",
        "flow": [
            {"app": "purchase", "t": "Buy", "h": "Ingredients ordered from par levels", "p": "Reordering rules at each outlet and the central kitchen raise purchase orders from par levels, with each supplier's prices and delivery days.", "odoo": "Purchase · reordering rules, supplier pricelists", "was": "Daily orders phoned or messaged to suppliers"},
            {"app": "mrp", "t": "Prep", "h": "Central kitchen batches", "p": "Sauces, doughs and prepared items run as manufacturing orders from recipes (bills of materials), so ingredient use and cost are recorded.", "odoo": "Manufacturing · recipes and batch production", "was": "Prep sheets on paper, costs guessed"},
            {"app": "stock", "t": "Deliver", "h": "Outlets replenished", "p": "Transfers move prepared items and dry goods from the central kitchen to each outlet. Outlet stock updates when the delivery is received.", "odoo": "Inventory · transfers between outlets", "was": "Delivery lists and phone calls"},
            {"app": "pos_restaurant", "t": "Serve", "h": "Tables, takeaway and self-ordering", "p": "The restaurant POS handles floor plans, split bills and tips. Guests can order from a kiosk or a QR code at the table, and orders go straight to the kitchen.", "odoo": "Point of Sale · floor plans, self-ordering", "was": "Handwritten tickets and a separate ordering app"},
            {"app": "pos_restaurant", "t": "Cook", "h": "Kitchen display and printers", "p": "Orders appear on the kitchen display or print at the right station, with the guest's notes. Selling a dish deducts its ingredients through its recipe.", "odoo": "Point of Sale · kitchen display, preparation printers", "was": "Shouted orders and lost tickets"},
            {"app": "accountant", "t": "Close", "h": "Takings and food cost per outlet", "p": "Closing each POS session posts sales, taxes and payments per outlet, and food cost shows from recipe usage against sales.", "odoo": "Accounting · outlet journals, cost of sales", "was": "Z-reports and supplier invoices keyed in by hand"},
        ],
        "ba": [
            ("Orders to the kitchen", "Paper tickets or a separate app", "Sent from the POS to the kitchen display"),
            ("Delivery platforms", "A tablet per platform, orders re-keyed", "GrabFood orders arrive in the POS"),
            ("Ingredient stock", "Counted weekly, usage guessed", "Deducted through recipes as dishes sell"),
            ("Supplier orders", "Messaged daily from memory", "Raised from par levels per outlet"),
            ("Food cost", "Worked out at month-end, if at all", "Visible per dish and per outlet"),
            ("Outlet takings", "Z-reports typed into accounting", "POS sessions post to the books"),
        ],
        "chart": {
            "title": "Covers by hour", "kpis": [("Covers today", "312"), ("Average bill", "S$ 38.50"), ("Food cost", "29.4%")],
            "shared": True,
            "views": [
                {"label": "Weekday", "unit": "covers", "bars": [("11am", 18), ("12pm", 64), ("1pm", 58), ("2pm", 22), ("6pm", 30), ("7pm", 71), ("8pm", 66), ("9pm", 34)]},
                {"label": "Weekend", "unit": "covers", "bars": [("11am", 26), ("12pm", 82), ("1pm", 79), ("2pm", 41), ("6pm", 44), ("7pm", 90), ("8pm", 88), ("9pm", 52)]},
            ],
            "reports": ["Sales by outlet, dish and hour", "Food cost per dish from recipes", "Top and slowest dishes", "Payment methods and tips per session"],
        },
        "video": ("tWW6jfrEIlY", "Odoo POS: Restaurant management made easy"),
        "shots": [("pos/pos-register.webp", "Restaurant POS register"), ("pos/self-order-kiosk.webp", "Self-ordering kiosk"),
                  ("pos/pos-booking-details.webp", "Table bookings"), ("manufacturing/operations.webp", "Batch production for a central kitchen")],
        "new20": ["Snooze a dish to take it off the POS or self-ordering menu for a while",
                  "Print an order-specific QR code so guests can order, then pay after the meal",
                  "Self-ordering notes show on the kitchen display, and optional products appear on mobile and kiosk",
                  "Print one preparation ticket per product with Split per product"],
        "phases": [
            {"h": "One outlet live", "apps": ["pos_restaurant", "stock", "accountant"], "items": ["Menu, floor plan, printers and kitchen display", "Payment terminals and sessions closing to Accounting", "Staff trained on orders, splits and refunds"]},
            {"h": "Recipes and purchasing", "apps": ["mrp", "purchase", "stock"], "items": ["Recipes (bills of materials) for dishes and prep items", "Par levels and supplier pricelists per outlet", "Central kitchen batches and transfers"]},
            {"h": "More outlets and channels", "apps": ["pos_restaurant", "website", "spreadsheet_dashboard"], "items": ["Self-ordering by kiosk or QR code", "Delivery platform orders into the POS where supported", "Outlet roll-out with a consolidated P&amp;L"]},
        ],
        "integrations": [("utensils", "GrabFood orders and menu sync (SG, PH, VN)"), ("receipt", "Kitchen printers and displays"), ("cart", "Card terminals supported by Odoo POS"),
                         ("bank", "Bank feeds for settlements"), ("whatsapp", "Self-order receipts by WhatsApp or SMS"), ("calendar", "Online table bookings")],
        "faqs": [
            ("Can Odoo Point of Sale keep working without internet in a restaurant?", "Yes. Odoo Point of Sale keeps taking orders through short internet outages and syncs them when the connection returns. Card payments depend on your terminal's own connection."),
            ("Does Odoo handle recipes and food cost?", "Yes. Dishes and prep items can have recipes (bills of materials). As they sell or are produced, ingredients are deducted from stock and cost is recorded, so food cost per dish is visible."),
            ("Can Odoo take GrabFood orders?", "Odoo's release notes list a GrabFood integration for orders and menu sync in Singapore, the Philippines, Vietnam and other Southeast Asian countries. TechNext confirms it for your outlets during discovery."),
            ("Can guests order from their table?", "Yes. Odoo self-ordering lets guests order from a kiosk or by scanning a QR code, and Odoo 20 adds order-specific QR codes so they can pay after the meal."),
            ("How does TechNext roll Odoo out to several outlets?", "One outlet goes live first. The same setup then rolls out outlet by outlet, with a consolidated view of takings and food cost."),
        ],
        "reading": ["blog/odoo-20-whats-new.html", "blog/how-an-odoo-implementation-works.html"],
    },

    # ------------------------------------------------------------------ MANUFACTURING
    "manufacturing": {
        "name": "Manufacturing", "noun": "manufacturers",
        "intro": "Odoo for manufacturing connects bills of materials, work orders, the shop floor, quality checks, maintenance and purchasing to Inventory and Accounting, so every finished unit carries its real cost and every component can be traced back to its supplier.",
        "flow_title": "From sales order to finished goods, costed.",
        "flow_lead": "How an order becomes a product in Odoo, and what each step replaces. Pick a step to see the detail.",
        "flow": [
            {"app": "sale", "t": "Order", "h": "Sales order in", "p": "A confirmed sales order reserves stock or triggers production, depending on the route you choose for the product: make to order or make to stock.", "odoo": "Sales · make-to-order and make-to-stock routes", "was": "Orders printed and walked to production"},
            {"app": "mrp", "t": "Plan", "h": "Production planned on capacity", "p": "Manufacturing orders are scheduled against work center capacity, and the Master Production Schedule plans ahead from forecasts.", "odoo": "Manufacturing · work centers, MPS", "was": "A whiteboard and a spreadsheet"},
            {"app": "purchase", "t": "Source", "h": "Components bought on time", "p": "Missing components raise purchase orders from reordering rules or straight from the manufacturing order, using each vendor's lead time.", "odoo": "Purchase · reordering rules, vendor lead times", "was": "Shortages found on the day"},
            {"app": "mrp", "t": "Make", "h": "The shop floor, on a tablet", "p": "Operators follow work orders on a tablet, record quantities with barcodes and log their time. With continuous production in Odoo 20, the next operation can start as soon as some units are ready.", "odoo": "Shop Floor · work orders, barcodes", "was": "Paper travellers and end-of-shift tallies"},
            {"app": "quality_control", "t": "Check", "h": "Quality checks in the flow", "p": "Quality control points trigger checks at receipt, during operations or before delivery. Failed checks raise quality alerts for follow-up.", "odoo": "Quality · control points, alerts, worksheets", "was": "Checks on clipboards, filed later"},
            {"app": "accountant", "t": "Cost", "h": "The real cost of each order", "p": "Component, work center and extra costs roll up to each manufacturing order, and stock valuation posts to Accounting automatically.", "odoo": "Accounting · stock valuation, order costing", "was": "Standard costs updated once a year"},
        ],
        "ba": [
            ("Production plan", "Whiteboard updated by the planner", "Work orders scheduled on work center capacity"),
            ("Material shortages", "Found when the line stops", "Visible before the order starts, purchases raised"),
            ("Shop floor records", "Paper travellers typed in later", "Quantities and time recorded at the work center"),
            ("Traceability", "Searching through batch sheets", "Lots and serials traced from supplier to customer"),
            ("Quality checks", "Clipboards filed in a drawer", "Control points on receipts, operations and deliveries"),
            ("Product cost", "Estimated once a year", "Actual cost per manufacturing order"),
        ],
        "chart": {
            "title": "Output by work center", "kpis": [("Orders in progress", "18"), ("On-time completion", "94%"), ("Scrap this week", "1.8%")],
            "shared": True,
            "views": [
                {"label": "Planned", "unit": "units", "bars": [("Cutting", 420), ("Welding", 310), ("Assembly", 360), ("Painting", 260), ("Packing", 280)]},
                {"label": "Done", "unit": "units", "bars": [("Cutting", 398), ("Welding", 296), ("Assembly", 341), ("Painting", 233), ("Packing", 279)]},
            ],
            "reports": ["Production analysis by work center and product", "Overall equipment effectiveness (OEE) per work center", "Cost analysis per manufacturing order", "Quality alerts and check results"],
        },
        "video": ("UVCXPNwFMyY", "Odoo Manufacturing App Tour"),
        "shots": [("O20:mrp", "Odoo 20: manufacturing"), ("manufacturing/operations.webp", "Simulated operations"),
                  ("manufacturing/schedule.webp", "Production scheduling"), ("quality/quality_teams.webp", "Quality teams")],
        "new20": ["Continuous production: record quantities on work orders so the next operation starts as soon as some units are ready",
                  "Split an ongoing manufacturing order and produce the remaining amount later",
                  "Compare bills of materials to see what changed, in PLM",
                  "Scan a work center's barcode to select it on the shop floor, and see each vendor's quality rate"],
        "phases": [
            {"h": "Materials and production", "apps": ["mrp", "stock", "purchase"], "items": ["Bills of materials, operations and work centers", "Reordering rules and vendor lead times", "Opening stock counted in, with lots or serials"]},
            {"h": "Shop floor and quality", "apps": ["mrp", "quality_control", "maintenance"], "items": ["Shop Floor tablets at each work center", "Quality control points and worksheets", "Preventive maintenance for key equipment"]},
            {"h": "Costing and planning", "apps": ["accountant", "spreadsheet_dashboard", "mrp_plm"], "items": ["Actual costing and stock valuation in Accounting", "Master Production Schedule from forecasts", "Engineering changes managed in PLM"]},
        ],
        "integrations": [("gear", "Barcode scanners and shop floor tablets"), ("cpu", "IoT devices: scales, measuring tools, printers"), ("truck", "Subcontractors through subcontracting routes"),
                         ("file", "Drawings and specifications in PLM and Documents"), ("bank", "Bank feeds"), ("layers", "Multi-company for group entities")],
        "faqs": [
            ("Does Odoo handle multi-level bills of materials?", "Yes. Odoo supports multi-level bills of materials, kits, by-products and operations on work centers, and Odoo 20 adds BoM comparison in PLM."),
            ("Can operators use Odoo on the shop floor?", "Yes. The Shop Floor app runs on a tablet at each work center, where operators see instructions, record quantities with barcodes and log their time."),
            ("How does Odoo calculate product cost?", "Component costs, work center time and extra costs registered on the bill of materials roll up to each manufacturing order, and the stock valuation posts to Accounting."),
            ("Can Odoo trace lots and serial numbers?", "Yes. Lots and serial numbers are tracked from receipt through production to delivery, and the traceability report shows where each one went."),
            ("Where does TechNext start with a manufacturer?", "With one product family: its bill of materials, operations and components. Once it runs end to end, the rest of the catalogue follows."),
        ],
        "reading": ["blog/odoo-20-whats-new.html", "blog/standard-first-odoo-customisation.html"],
    },

    # ------------------------------------------------------------------ CONSTRUCTION
    "construction": {
        "name": "Construction", "noun": "contractors",
        "intro": "Odoo for construction runs each job as a project with its own budget, purchases, timesheets and progress billing, so you see cost to date against budget and invoice milestones without rebuilding spreadsheets. Site teams work from their phones, and in Odoo 20 even offline.",
        "flow_title": "From tender to final claim, job by job.",
        "flow_lead": "How a contract runs through Odoo, from winning it to billing it. Pick a step to see what changes.",
        "flow": [
            {"app": "crm", "t": "Win", "h": "Tender to contract", "p": "Opportunities track tenders. The accepted quotation becomes the contract value, with milestones for progress billing.", "odoo": "CRM + Sales · quotations with milestones", "was": "Tender files in folders, values in email"},
            {"app": "project", "t": "Set up", "h": "Each job becomes a project", "p": "Every job gets a project with stages, tasks and an analytic budget, so every cost and hour lands against the right job.", "odoo": "Project · analytic budget per job", "was": "A job spreadsheet per project"},
            {"app": "purchase", "t": "Buy", "h": "Materials and subcontractors", "p": "Purchase orders for materials, plant hire and subcontractors are coded to the job, and bills are matched to what was delivered.", "odoo": "Purchase · analytic distribution per job", "was": "Supplier invoices allocated at month-end"},
            {"app": "planning", "t": "Site", "h": "Crews and site work", "p": "Crews are scheduled in Planning. In Odoo 20, field work lives in Planning with a live map, and site teams can keep working offline.", "odoo": "Planning · field service, offline mode", "was": "Group chats and paper timesheets"},
            {"app": "hr_timesheet", "t": "Track", "h": "Hours and progress", "p": "Site timesheets record labour against tasks, and progress notes and photos are logged on the task for the office to see.", "odoo": "Timesheets · hours against tasks", "was": "Timesheets collected weekly on paper"},
            {"app": "accountant", "t": "Bill", "h": "Progress claims and job P&amp;L", "p": "Milestones are invoiced as they are reached, and the project overview shows budget, cost to date and margin for each job.", "odoo": "Sales + Accounting · milestone invoicing, job P&amp;L", "was": "Progress claims built in Excel"},
        ],
        "ba": [
            ("Job cost", "Pieced together at month-end", "Live per job: materials, labour, subcontractors"),
            ("Progress claims", "Built in a spreadsheet each month", "Milestones invoiced from the contract"),
            ("Site timesheets", "Paper sheets collected weekly", "Logged on phones against tasks"),
            ("Purchase orders", "Emailed with no job reference", "Coded to the job, bills matched to delivery"),
            ("Drawings and contracts", "Spread across shared drives", "Attached to the project, signed in Sign"),
            ("Crew schedule", "A group chat and a whiteboard", "Planned in Planning, visible on a map"),
        ],
        "chart": {
            "title": "Budget and cost to date by job", "kpis": [("Active jobs", "9"), ("Unbilled milestones", "S$ 412k"), ("Hours logged this week", "1,284")],
            "views": [
                {"label": "Budget vs cost", "unit": "S$k", "legend": ["Budget", "Cost to date"],
                 "pairs": [("Tower A", 1200, 860), ("Retail fit-out", 340, 310), ("Warehouse", 780, 520), ("Condo renovation", 220, 204), ("School block", 960, 610)]},
                {"label": "Margin", "unit": "%", "bars": [("Tower A", 18), ("Retail fit-out", 9), ("Warehouse", 21), ("Condo renovation", 7), ("School block", 16)]},
            ],
            "reports": ["Project overview: budget, cost to date and margin", "Timesheets by job, task and employee", "Purchases and subcontractor bills by job", "Milestones invoiced and still to bill"],
        },
        "video": ("T45Jo3s_Pt4", "Odoo Project - For efficient project management"),
        "shots": [("project/project-overview-budgets.webp", "Project overview with budget and cost"), ("project/project-dashboard.webp", "Projects dashboard"),
                  ("O20:planning_fsm", "Odoo 20: field service in Planning"), ("timesheet/timesheet-overview.webp", "Timesheets overview")],
        "new20": ["Field Service merged into Planning, with a live map of technicians and a map view of shift locations",
                  "Offline mode: create and edit records on site without a connection",
                  "Project roles, and customer access to a project in the portal without adding them as followers",
                  "Automated signature requests, and billing targets versus billable time in the Timesheets dashboard"],
        "phases": [
            {"h": "Jobs and job costing", "apps": ["project", "purchase", "accountant"], "items": ["A project template for your jobs, with stages and budget", "Purchases and bills coded to each job", "Job P&amp;L in the project overview"]},
            {"h": "Site and billing", "apps": ["planning", "hr_timesheet", "sale"], "items": ["Crew planning and site timesheets on phones", "Milestone and progress invoicing from the contract", "Photos and site notes on tasks"]},
            {"h": "Documents and portfolio", "apps": ["documents", "sign", "spreadsheet_dashboard"], "items": ["Drawings, variations and contracts in Documents", "Subcontracts and variations signed in Sign", "A portfolio dashboard across all jobs"]},
        ],
        "integrations": [("bank", "Bank feeds"), ("file", "Documents and e-signatures"), ("pin", "Map view of crews and sites"),
                         ("camera", "Site photos on tasks"), ("clock", "Mobile timesheets"), ("layers", "Multi-company for group entities")],
        "faqs": [
            ("Can Odoo do job costing for construction?", "Yes. Each job runs as a project with an analytic account, so purchases, subcontractor bills and timesheets land against it, and the project overview shows cost to date against budget."),
            ("Does Odoo support progress billing?", "Yes. Sales orders can be invoiced by milestone, so progress claims follow the contract, and variations can be added as new lines or quotations."),
            ("Can site teams use Odoo without a signal?", "Odoo 20 adds an offline mode for creating and editing records, and field work now lives in the Planning app with a live map of technicians."),
            ("Can we keep drawings and contracts in Odoo?", "Yes. Documents stores files against the project, and Sign collects signatures on subcontracts, variations and handover forms."),
            ("Where does TechNext start with a contractor?", "With one live project: its budget, purchases, timesheets and first progress claim, run end to end before the next jobs move over."),
        ],
        "reading": ["blog/how-an-odoo-implementation-works.html", "blog/standard-first-odoo-customisation.html"],
    },

    # ------------------------------------------------------------------ MEDICAL
    "medical": {
        "name": "Medical", "noun": "clinics",
        "intro": "Odoo for clinics runs the business side of healthcare: online appointments, staff rosters, medicine and consumable stock with lot and expiry tracking, purchasing, the retail counter and accounting per branch. Clinical records stay in your medical record system; Odoo handles everything around them.",
        "flow_title": "From booking to billing, branch by branch.",
        "flow_lead": "The business flow of a clinic group in Odoo. Pick a step to see what changes.",
        "flow": [
            {"app": "appointment", "t": "Book", "h": "Online booking", "p": "Patients book online by doctor, service or branch. Reminders go out automatically and staff calendars stay in sync.", "odoo": "Appointments · booking pages, reminders", "was": "Phone bookings in a paper diary"},
            {"app": "planning", "t": "Roster", "h": "Staff rosters", "p": "Doctors, nurses and front-desk staff are rostered per branch, so bookable slots match who is actually on duty.", "odoo": "Planning · shifts per branch", "was": "Rosters in a spreadsheet"},
            {"app": "stock", "t": "Stock", "h": "Medicines and consumables", "p": "Stock is tracked per branch with lot numbers and expiry dates, and first-expiry-first-out picking keeps older stock moving.", "odoo": "Inventory · lots, expiry dates, FEFO", "was": "Expiry dates checked by hand"},
            {"app": "purchase", "t": "Buy", "h": "Supplier orders", "p": "Reordering rules raise purchase orders to approved suppliers, and receipts record the lot and expiry date at the door.", "odoo": "Purchase · reordering rules, approved vendors", "was": "Orders placed from memory"},
            {"app": "point_of_sale", "t": "Counter", "h": "The retail counter", "p": "The counter sells products through Point of Sale, deducting the right lots from stock.", "odoo": "Point of Sale · counter sales with lots", "was": "A separate till"},
            {"app": "accountant", "t": "Bill", "h": "Billing and branch accounts", "p": "Invoices go to patients, companies or insurers as customers. Payments reconcile from the bank feed and each branch has its own P&amp;L.", "odoo": "Invoicing + Accounting · analytic per branch", "was": "Billing re-keyed into accounting"},
        ],
        "ba": [
            ("Appointments", "Phone calls and a diary", "Online booking with reminders"),
            ("Rosters", "A spreadsheet per branch", "Planning linked to bookable slots"),
            ("Medicine expiry", "Checked by hand on the shelves", "Lots and expiry dates tracked, FEFO picking"),
            ("Stock across branches", "Unknown until someone counts", "Live per branch, with transfers"),
            ("Corporate billing", "Invoices built in Word", "Invoices from Odoo with payment links"),
            ("Branch results", "Consolidated at year-end", "P&amp;L per branch in Accounting"),
        ],
        "chart": {
            "title": "Appointments by day", "kpis": [("Booked online", "68%"), ("Lots expiring in 60 days", "23"), ("Unpaid invoices", "S$ 14.2k")],
            "shared": True,
            "views": [
                {"label": "This week", "unit": "visits", "bars": [("Mon", 142), ("Tue", 128), ("Wed", 136), ("Thu", 120), ("Fri", 151), ("Sat", 98)]},
                {"label": "Last week", "unit": "visits", "bars": [("Mon", 131), ("Tue", 125), ("Wed", 129), ("Thu", 118), ("Fri", 139), ("Sat", 92)]},
            ],
            "reports": ["Bookings by doctor, service and branch", "Stock expiring by date and branch", "Revenue by service and branch", "Aged receivables for corporate clients"],
        },
        "video": ("z3oLCl1eFhA", "Odoo Planning: dream big, plan even bigger!"),
        "shots": [("appointments/appointment-ressources.webp", "Online booking by resource"), ("appointments/appointment-calendar.webp", "Appointment calendar"),
                  ("appointments/appointment-reporting.webp", "Booking analysis"), ("inventory/optimize_warehouse.webp", "Stock by location")],
        "new20": ["Request feedback from patients after their appointments",
                  "Choosing a doctor or resource now happens on the same page as picking the date",
                  "Bill line prediction pre-fills supplier bills from their history",
                  "Customer invoice reminders, sent manually or automatically"],
        "phases": [
            {"h": "Bookings and billing", "apps": ["appointment", "account", "accountant"], "items": ["Online booking pages per service and branch", "Invoice templates and payment links", "Bank feeds and reconciliation"]},
            {"h": "Stock and purchasing", "apps": ["stock", "purchase", "point_of_sale"], "items": ["Medicines and consumables with lots and expiry", "Reordering rules and approved suppliers", "Counter sales through Point of Sale"]},
            {"h": "Staff and branches", "apps": ["planning", "sign", "spreadsheet_dashboard"], "items": ["Rosters linked to bookable slots", "Consent and onboarding forms in Sign", "Branch dashboards and consolidated reporting"]},
        ],
        "integrations": [("calendar", "Google and Outlook calendar sync"), ("mail", "Email and SMS reminders"), ("bank", "Bank feeds"),
                         ("plug", "Your medical record system, by API where available"), ("shield", "Role-based access rights"), ("file", "Documents and e-signatures")],
        "faqs": [
            ("Is Odoo a medical records (EMR) system?", "No. Odoo runs the business side of a clinic: appointments, rosters, stock, purchasing, billing and accounting. Clinical records stay in your EMR, and TechNext can connect the two where your EMR offers an API."),
            ("Can Odoo track medicine expiry dates?", "Yes. Inventory tracks lot numbers and expiry dates, can alert before expiry, and picks first-expiry-first-out at each branch."),
            ("Can patients book appointments online?", "Yes. Odoo Appointments publishes booking pages by doctor, service or branch, sends reminders and syncs with staff calendars."),
            ("How is access to data controlled in Odoo?", "Access rights limit each role to the records it needs, and TechNext sets them up with you. Clinical notes belong in your EMR, not in Odoo."),
            ("Can Odoo handle several clinic branches?", "Yes. Each branch can have its own stock locations, rosters and P&amp;L in one database, or its own company for separate legal entities."),
        ],
        "reading": ["blog/what-is-erp.html", "blog/signs-you-have-outgrown-spreadsheets.html"],
    },

    # ------------------------------------------------------------------ TRAVEL
    "travel": {
        "name": "Travel", "noun": "travel businesses",
        "intro": "Odoo for travel businesses keeps enquiries, itineraries, supplier costs, deposits and margin in one place. Each booking is a quotation built from supplier services, confirmed with a deposit, paid to suppliers from purchase orders and closed with its real margin, in any currency.",
        "flow_title": "From enquiry to margin, trip by trip.",
        "flow_lead": "How a booking moves through a travel business in Odoo. Pick a step to see what changes.",
        "flow": [
            {"app": "crm", "t": "Enquire", "h": "Enquiry in", "p": "Enquiries from the website, email or WhatsApp land in CRM with travel dates and group size, so nothing lives only in an inbox.", "odoo": "CRM · pipeline with activities", "was": "Enquiries scattered across inboxes"},
            {"app": "sale", "t": "Quote", "h": "The itinerary as a quotation", "p": "Flights, hotels, transfers and tours are products with supplier costs. The quotation shows the client the trip, while your margin stays visible internally.", "odoo": "Sales · quotation templates, optional extras", "was": "Itineraries in Word, costs in Excel"},
            {"app": "account", "t": "Deposit", "h": "Deposit by payment link", "p": "The client signs the quotation online and pays a deposit through a payment link. The balance is invoiced before departure.", "odoo": "Sales + Invoicing · online signature, down payments", "was": "Bank transfers chased by email"},
            {"app": "purchase", "t": "Book", "h": "Suppliers booked", "p": "Supplier services can create purchase orders to hotels, airlines and ground handlers when the trip is confirmed, so every commitment is recorded.", "odoo": "Purchase · services bought per booking", "was": "Supplier bookings tracked in a spreadsheet"},
            {"app": "accountant", "t": "Pay", "h": "Supplier bills in any currency", "p": "Supplier bills are matched to purchase orders and paid in their own currency, and exchange differences post automatically.", "odoo": "Accounting · multi-currency, exchange differences", "was": "FX differences worked out by hand"},
            {"app": "spreadsheet_dashboard", "t": "Review", "h": "Margin per trip", "p": "Each trip shows revenue, supplier cost and margin, and reports compare margin by product line, destination and salesperson.", "odoo": "Dashboards · margin analysis", "was": "Margins known long after the trip"},
        ],
        "ba": [
            ("Enquiries", "Spread across inboxes and chats", "One CRM pipeline with dates and group size"),
            ("Itineraries", "Word documents rebuilt per client", "Quotation templates with optional extras"),
            ("Deposits", "Transfers chased by email", "Online signature and payment link on the quote"),
            ("Supplier bookings", "A spreadsheet of confirmations", "Purchase orders linked to the trip"),
            ("Currencies", "Rates looked up by hand", "Multi-currency bills, automatic exchange differences"),
            ("Margin", "Worked out after the trip", "Visible per trip before and after travel"),
        ],
        "chart": {
            "title": "Revenue and margin by product line", "kpis": [("Open enquiries", "46"), ("Deposits due this week", "S$ 38.6k"), ("Average margin", "13.8%")],
            "views": [
                {"label": "Revenue", "unit": "S$k", "bars": [("Packages", 420), ("Tailor-made", 280), ("Corporate", 360), ("Groups", 510), ("Events", 190)]},
                {"label": "Margin", "unit": "S$k", "bars": [("Packages", 63), ("Tailor-made", 39), ("Corporate", 29), ("Groups", 71), ("Events", 34)]},
            ],
            "reports": ["Margin by trip, product line and destination", "Pipeline by stage and travel month", "Deposits and balances due", "Supplier spend and open bills by currency"],
        },
        "video": ("N4zw-2t6spk", "Create beautiful quotations with Odoo"),
        "shots": [("sales/quote_template.webp", "Quotation templates for itineraries"), ("sales/customer_portal_02.webp", "Customer portal: sign and pay"),
                  ("crm/reporting.webp", "Pipeline reporting"), ("invoicing/invoicing-hero-image.webp", "Invoicing")],
        "new20": ["Event combos: one ticket that combines registration with food and beverages, each with its own VAT rate",
                  "AI agents can create records from an uploaded PDF, such as a supplier confirmation",
                  "Pay supplier bills individually or in batches with one signature",
                  "Customer invoice reminders, and bill line prediction for supplier bills"],
        "phases": [
            {"h": "Enquiry to invoice", "apps": ["crm", "sale", "account"], "items": ["A CRM pipeline for enquiries, with travel dates", "Quotation templates, deposits and payment links", "Invoices in the client's currency"]},
            {"h": "Suppliers and margin", "apps": ["purchase", "accountant", "spreadsheet_dashboard"], "items": ["Supplier services as products with costs", "Purchase orders and bills per trip", "Margin reporting by product and destination"]},
            {"h": "Online and groups", "apps": ["website", "event", "sign"], "items": ["Tour pages and enquiry forms on the website", "Fixed departures and group events with tickets", "Booking forms and waivers signed online"]},
        ],
        "integrations": [("whatsapp", "WhatsApp conversations in Odoo"), ("globe", "Website enquiry forms"), ("bank", "Bank feeds in several currencies"),
                         ("receipt", "Online payment providers"), ("mail", "Email templates for confirmations"), ("file", "E-signatures for booking forms")],
        "faqs": [
            ("Can Odoo handle multi-currency travel bookings?", "Yes. Quotations, invoices and supplier bills can each be in their own currency, and Odoo posts exchange differences automatically when payments are reconciled."),
            ("Can clients sign and pay a deposit online?", "Yes. Odoo quotations can be signed online and paid through a payment link, and a down payment can be invoiced first with the balance later."),
            ("Can Odoo show the margin on each trip?", "Yes. With supplier costs recorded against the booking, each trip shows revenue, cost and margin, and reports compare margin by product line or salesperson."),
            ("Does Odoo replace a GDS or booking engine?", "No. Odoo manages enquiries, quotations, suppliers, payments and accounting. Airline and hotel inventory still comes from your booking tools, and TechNext can connect them where an API exists."),
            ("Where does TechNext start with a travel business?", "With one recent booking, end to end: enquiry, quotation, deposit, supplier bookings, payments and margin."),
        ],
        "reading": ["blog/how-an-odoo-implementation-works.html", "blog/what-is-erp.html"],
    },

    # ------------------------------------------------------------------ ECOMMERCE
    "ecommerce": {
        "name": "Ecommerce", "noun": "online sellers",
        "intro": "Odoo for ecommerce runs the online store, marketplaces, stock, fulfilment, customer service and accounting on one database. An order placed anywhere reserves stock, ships from the right warehouse and reconciles to its payment without re-keying.",
        "flow_title": "From checkout to payout, on one stock.",
        "flow_lead": "How an online order moves through Odoo, whichever channel it came from. Pick a step to see what changes.",
        "flow": [
            {"app": "website_sale", "t": "Order", "h": "Orders from every channel", "p": "The Odoo store takes orders with live stock, pricelists and promotions, and marketplace orders from Lazada and TikTok arrive in the same place.", "odoo": "eCommerce · marketplace connectors", "was": "Orders exported from each channel"},
            {"app": "account", "t": "Pay", "h": "Payment captured", "p": "Online payments are captured by the payment provider and recorded against the order, and payouts are reconciled in Accounting.", "odoo": "Payment providers · Accounting", "was": "Payouts matched by hand"},
            {"app": "stock", "t": "Ship", "h": "Pick, pack and ship", "p": "The order reserves stock, pickers work from barcode picking lists, and shipping labels come from the carrier integration.", "odoo": "Inventory + Barcode · carrier labels", "was": "Printing orders and copying addresses"},
            {"app": "purchase", "t": "Restock", "h": "Restock from demand", "p": "Reordering rules suggest minimum and maximum levels from sales history in Odoo 20, and raise purchase orders before items run out.", "odoo": "Purchase · suggested stock levels", "was": "Stock-outs found by customers"},
            {"app": "helpdesk", "t": "Support", "h": "Returns and support", "p": "Customer emails become helpdesk tickets. Returns are processed from the delivery with Odoo 20's simpler flow, and refunds post to Accounting.", "odoo": "Helpdesk + Inventory · returns", "was": "Returns tracked in an inbox"},
            {"app": "spreadsheet_dashboard", "t": "Report", "h": "Sales by channel", "p": "Sales and cost of goods roll up by channel and product, so you can see which channel actually makes money.", "odoo": "Dashboards · sales and margin by channel", "was": "A monthly spreadsheet built from exports"},
        ],
        "ba": [
            ("Marketplace orders", "Downloaded and re-keyed", "Fetched from Lazada and TikTok into Odoo"),
            ("Stock across channels", "Updated by hand, items oversold", "One stock level synchronised to channels"),
            ("Shipping labels", "Copied into carrier websites", "Printed from the delivery order"),
            ("Reordering", "Noticed when an item sells out", "Suggested min and max levels from demand"),
            ("Returns", "Emails and a spreadsheet", "A return on the delivery, refund in Accounting"),
            ("Payouts", "Matched manually", "Reconciled against orders"),
        ],
        "chart": {
            "title": "Orders by channel", "kpis": [("Orders today", "184"), ("Ready to ship", "62"), ("Items below minimum", "9")],
            "views": [
                {"label": "Orders", "unit": "orders", "bars": [("Website", 1240), ("Lazada", 860), ("TikTok", 520), ("Store pickup", 180)]},
                {"label": "Returns", "unit": "returns", "bars": [("Website", 38), ("Lazada", 41), ("TikTok", 22), ("Store pickup", 3)]},
            ],
            "reports": ["Sales by channel, product and country", "Margin by product after cost of goods", "Orders waiting to ship, by carrier", "Returns by product and reason"],
        },
        "video": ("_rs-laXy0a0", "Odoo eCommerce makes online selling simple"),
        "shots": [("ecommerce/products-grid.webp", "Product grid"), ("ecommerce/adaptive-product.webp", "Product page"),
                  ("ecommerce/reporting.webp", "Store reporting"), ("O20:purchase_inv", "Odoo 20: purchasing and inventory")],
        "new20": ["Suggested minimum and maximum stock levels for reordering rules, from demand history",
                  "A simpler returns process, with the return wizard removed",
                  "Loyalty progress bars in the cart, and a minimum order quantity per product",
                  "The AI Website Assistant, with structured data on by default and AI-assisted SEO"],
        "phases": [
            {"h": "Store, stock and payments", "apps": ["website_sale", "stock", "accountant"], "items": ["Catalogue, variants and pricelists", "Payment providers and reconciliation", "Pick, pack and ship with carrier labels"]},
            {"h": "Marketplaces", "apps": ["sale", "stock", "purchase"], "items": ["Lazada and TikTok marketplace connectors", "One stock level across every channel", "Reordering from demand history"]},
            {"h": "Service and growth", "apps": ["helpdesk", "mass_mailing", "spreadsheet_dashboard"], "items": ["Helpdesk for support and returns", "Email campaigns and abandoned-cart follow-up", "Margin by channel and product"]},
        ],
        "integrations": [("cart", "Lazada and TikTok marketplace connectors"), ("truck", "Carrier integrations for labels and tracking"), ("bank", "Payment providers and bank feeds"),
                         ("mail", "Email marketing"), ("chat", "Live chat on the store"), ("globe", "Several websites and languages")],
        "faqs": [
            ("Can Odoo connect to Lazada and TikTok?", "Yes. Odoo's release notes list marketplace integrations with Lazada and TikTok that fetch orders and delivery slips and synchronise inventory."),
            ("Can Odoo stop overselling across channels?", "Yes. Orders from the website and connected marketplaces draw on the same stock, and inventory is synchronised back to the marketplaces."),
            ("Does Odoo print shipping labels?", "Yes. Through Odoo's carrier integrations, labels and tracking numbers are generated from the delivery order."),
            ("Can we move our existing online store to Odoo?", "Yes. Products, customers and order history can be migrated, and TechNext plans redirects so the store keeps its search rankings."),
            ("Where does TechNext start with an ecommerce business?", "With where orders come from today: each channel, how stock is shared between them and how payouts reach the bank."),
        ],
        "reading": ["blog/odoo-20-whats-new.html", "blog/odoo-online-vs-odoo-sh-vs-on-premise.html"],
    },

    # ------------------------------------------------------------------ HEALTH & WELLNESS
    "health-wellness": {
        "name": "Health &amp; Wellness", "noun": "studios, spas and gyms",
        "intro": "Odoo for health and wellness businesses runs bookings, memberships and retail on one system. Clients book classes or treatments online, memberships renew and bill automatically, the front desk sells products and packages at the Point of Sale, and every payment lands in Accounting.",
        "flow_title": "From first booking to renewal.",
        "flow_lead": "How a client moves through a studio, spa or gym in Odoo. Pick a step to see what changes.",
        "flow": [
            {"app": "appointment", "t": "Book", "h": "Online booking", "p": "Clients book classes, treatments or rooms online by staff member or resource, with capacity limits and reminders.", "odoo": "Appointments · resources, capacity, reminders", "was": "Bookings by message"},
            {"app": "sale_subscription", "t": "Join", "h": "Memberships that renew", "p": "Memberships and class packs run as subscriptions that renew and bill automatically, with upgrades handled on the contract.", "odoo": "Subscriptions · recurring billing", "was": "Renewals chased one by one"},
            {"icon": "usercheck", "t": "Check in", "h": "Front desk check-in", "p": "Members check in at the front desk. In Odoo 20, check-ins can be limited to members, or to specific membership tiers.", "odoo": "Frontdesk · member entry", "was": "Names ticked off on a list"},
            {"app": "point_of_sale", "t": "Sell", "h": "Retail and packages", "p": "The front desk sells products, gift cards and packages at the Point of Sale, and loyalty points and eWallets work across visits.", "odoo": "Point of Sale · loyalty, gift cards, eWallets", "was": "A separate till for retail"},
            {"app": "planning", "t": "Staff", "h": "Therapists and instructors", "p": "Staff schedules decide which slots are bookable, so the online calendar matches who is working.", "odoo": "Planning · shifts linked to availability", "was": "Rosters in a spreadsheet"},
            {"app": "accountant", "t": "Close", "h": "Recurring revenue, visible", "p": "Membership revenue, retail sales and payouts post to Accounting, and subscription reports show recurring revenue and churn.", "odoo": "Accounting + Subscriptions · MRR, churn", "was": "Month-end in spreadsheets"},
        ],
        "ba": [
            ("Bookings", "Messages, calls and a paper diary", "Online booking with capacity and reminders"),
            ("Memberships", "Renewals chased one by one", "Subscriptions that bill and renew automatically"),
            ("Check-in", "Names ticked off on a list", "Front desk check-in, members-only if needed"),
            ("Retail", "A separate till and stock book", "Point of Sale with stock and loyalty"),
            ("Staff schedules", "Spreadsheets", "Planning linked to bookable slots"),
            ("Recurring revenue", "Unknown until month-end", "Recurring revenue and churn in reports"),
        ],
        "chart": {
            "title": "Bookings by day", "kpis": [("Active members", "1,240"), ("Renewals this month", "186"), ("Retail sales today", "S$ 2.3k")],
            "views": [
                {"label": "Classes", "unit": "bookings", "bars": [("Mon", 86), ("Tue", 92), ("Wed", 88), ("Thu", 95), ("Fri", 78), ("Sat", 124), ("Sun", 102)]},
                {"label": "Treatments", "unit": "bookings", "bars": [("Mon", 24), ("Tue", 28), ("Wed", 31), ("Thu", 29), ("Fri", 36), ("Sat", 48), ("Sun", 41)]},
            ],
            "reports": ["Bookings by service, staff member and day", "Recurring revenue, renewals and churn", "Retail sales and stock", "Staff utilisation from shifts and bookings"],
        },
        "video": ("I4Cjqi97JS0", "Odoo Subscriptions Product Tour"),
        "shots": [("appointments/appointment-hero-image.webp", "Online booking"), ("subscription/hero-image.webp", "Subscriptions"),
                  ("pos/interface.webp", "Point of Sale at the front desk"), ("planning/planning-shifts-overview.webp", "Staff shifts")],
        "new20": ["Frontdesk member entry: limit check-ins to members, or to specific membership tiers",
                  "Request feedback from clients after their appointments",
                  "A default party size and a maximum capacity override for group bookings",
                  "Expiry dates for loyalty points"],
        "phases": [
            {"h": "Bookings and memberships", "apps": ["appointment", "sale_subscription", "account"], "items": ["Booking pages for classes and treatments", "Memberships and packs as subscriptions", "Payment links and automatic renewals"]},
            {"h": "Front desk and retail", "apps": ["point_of_sale", "stock", "accountant"], "items": ["Point of Sale for retail, gift cards and packages", "Stock for retail products", "Daily takings posted to Accounting"]},
            {"h": "Staff and marketing", "apps": ["planning", "mass_mailing", "spreadsheet_dashboard"], "items": ["Staff rosters linked to bookable slots", "Email and SMS campaigns to members", "Recurring revenue and churn dashboards"]},
        ],
        "integrations": [("calendar", "Google and Outlook calendar sync"), ("mail", "Email and SMS reminders"), ("bank", "Online payments and bank feeds"),
                         ("heart", "Loyalty, gift cards and eWallets"), ("whatsapp", "WhatsApp conversations"), ("usercheck", "Front desk check-in")],
        "faqs": [
            ("Can Odoo manage gym or studio memberships?", "Yes. Memberships and class packs run as subscriptions that bill and renew automatically, and Odoo 20's Frontdesk app can limit check-ins to members or to specific tiers."),
            ("Can clients book classes and treatments online?", "Yes. Odoo Appointments publishes booking pages by service, staff member or room, with capacity limits and reminders."),
            ("Can the front desk sell products and packages?", "Yes. Point of Sale sells retail products, gift cards and packages, with loyalty points and eWallets that work across visits."),
            ("Can Odoo show recurring revenue?", "Yes. Subscriptions reports show recurring revenue, renewals and churn, and every payment posts to Accounting."),
            ("Where does TechNext start with a wellness business?", "With one week of bookings: the services, the staff, the memberships and how payments come in."),
        ],
        "reading": ["blog/odoo-20-whats-new.html", "blog/signs-you-have-outgrown-spreadsheets.html"],
    },
}
