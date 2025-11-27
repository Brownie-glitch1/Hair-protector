🧠 Afro Hair Product Scanner – Full Build Instructions for Emergent

You are building a full monorepo for the Afro Hair Product Scanner Platform, which contains 3 major parts:

1. Mobile App – User-facing hair profile + product scanning app


2. Backend API – Ingredient analysis, scoring engine, users, products


3. Ingredient Intelligence Engine – Rule-based hair compatibility system




---

🏗️ 1. Create the following monorepo structure using PNPM workspaces:

hair-scanner-platform/
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── README.md
├── LICENSE
│
├── .github/
│   └── workflows/
│       ├── backend.yml
│       ├── mobile.yml
│       └── engine.yml
│
├── docs/
│   ├── api/
│   │   ├── openapi.yaml
│   │   ├── auth.md
│   │   ├── scan.md
│   │   └── products.md
│   │
│   ├── hair-science/
│   │   ├── porosity.md
│   │   ├── buildup.md
│   │   └── scalp.md
│   │
│   └── architecture/
│       ├── backend.md
│       ├── scoring-engine.md
│       └── monorepo.md
│
├── scripts/
│   ├── deploy-backend.sh
│   ├── deploy-mobile.sh
│   └── deploy-engine.sh
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── index.ts
│   │   ├── server.ts
│   │
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── db.ts
│   │
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── rateLimit.ts
│   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── hair-profiles/
│   │   │   ├── ingredients/
│   │   │   ├── products/
│   │   │   └── scans/
│   │
│   │   ├── services/
│   │   │   ├── ocr.service.ts
│   │   │   ├── barcode.service.ts
│   │   │   └── scoring.service.ts
│   │
│   │   └── utils/
│   │
│   └── tests/
│       └── scans.test.ts
│
├── apps/
│   └── mobile-app/                # USER APP
│       ├── package.json
│       ├── app.json
│       ├── public/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── onboarding/
│       │   ├── scan/
│       │   ├── results/
│       │   └── profile/
│       └── src/
│           ├── components/
│           ├── hooks/
│           ├── store/
│           └── utils/
│
├── packages/
│   ├── ingredient-engine/
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── engine.ts
│   │   │   ├── rules/
│   │   │   │   ├── lowPorosity.ts
│   │   │   │   ├── highPorosity.ts
│   │   │   │   ├── scalp.ts
│   │   │   │   └── protein.ts
│   │   │   └── scoring/
│   │   │       ├── moisture.ts
│   │   │       ├── buildup.ts
│   │   │       └── scalp.ts
│   │
│   ├── shared/
│   │   ├── package.json
│   │   ├── types/
│   │   └── utils/
│   │
│   └── ingredient-db/
│       ├── package.json
│       ├── oils.json
│       ├── butters.json
│       ├── proteins.json
│       ├── alcohols.json
│       └── silicones.json
│
└── tests/
    ├── e2e/
    └── engine/


---

📌 2. Backend Implementation Requirements

Use:

Node.js

TypeScript

Fastify or Express

Prisma ORM

PostgreSQL

Redis

JWT Authentication


Required Backend Modules:

/auth
/users
/hair-profiles
/ingredients
/products
/scans

Required Features:

User authentication

Hair profile storage

Product storage

Ingredient parsing

OCR processing

Barcode lookup

Hair compatibility scoring



---

🔁 3. Core Scan Flow API

POST /scan/barcode

Must:

1. Look up product by barcode


2. Pull ingredients


3. Fetch user hair profile


4. Run scoring engine


5. Return verdict + full explanation



POST /scan/ingredients

Must:

1. Clean raw text


2. Parse ingredients


3. Match to ingredient DB


4. Score against hair profile


5. Return results




---

🧠 4. Ingredient Scoring Engine Requirements

Create a rule‑based engine that evaluates:

Hair Factors:

Porosity

Curl pattern

Scalp type

Density


Product Factors:

Water‑based detection

Heavy oil detection

Protein detection

Alcohol detection

Silicone detection


Core Rules:

Low porosity → heavy oils/butters increase buildup risk

High porosity → proteins + oils increase compatibility

Oily scalp → petrolatum/mineral oil increase clog risk

Sensitive scalp → fragrance/denatured alcohol increase irritation risk


Required Output:

verdict: GREAT | CAUTION | AVOID
moisture_score: 0–100
buildup_risk: 0–100
scalp_score: 0–100
water_based: boolean
heavy_oils: boolean
protein_heavy: boolean
explanation: string[]


---

📱 5. Mobile App (User App)

Pages:

/onboarding
/scan
/results
/profile

Features:

Hair profile setup

Barcode scanning

Ingredient image upload (OCR)

Ingredient paste

Results dashboard

Profile editing



---

📦 6. Ingredient Database Package

Must include categorized JSON data for:

Oils

Butters

Proteins

Alcohols

Silicones

Surfactants


Each ingredient must store:

name

category

heavy (boolean)

low_porosity_safe

high_porosity_safe

scalp_safe

notes



---

🧪 7. Testing Setup

Include tests for:

Backend:

Scan accuracy

Ingredient parsing

Hair profile matching

Verdict logic


Engine:

Porosity rules

Buildup scoring

Scalp sensitivity


Use:

Jest

Supertest



---

📝 8. Documentation

Inside /docs generate:

API Reference

Hair Science Rules

Scoring Engine Logic

System Architecture

Scan Flow Diagram


All in Markdown.


---

🌟 Extra Notes for Emergent (Important)

Use TypeScript everywhere

Keep folder structures EXACTLY as written

Use .env.example with placeholder keys

No fake lorem ipsum logic — all rules must be functional placeholders

Output must be MVP‑ready and deployable

Focus on correctness of ingredient → hair compatibility logic
