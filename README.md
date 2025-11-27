#Afro Hair Product Scanner Platform

A full‑stack platform for scanning afro and curly hair products to determine if they are compatible with a user’s specific hair type using ingredient analysis, OCR, barcode scanning, and a rule‑based scoring engine.

---

## 🚀 Overview

The Afro Hair Product Scanner helps users:
- Create a personalized hair profile
- Scan product barcodes or ingredient labels
- Analyze ingredients using hair‑science rules
- Instantly see if a product is **GREAT**, **CAUTION**, or **AVOID** for their hair type
- Understand *why* a product works or doesn’t

This repository is a **monorepo** containing:
- A **mobile user app**
- A **backend API**
- A **rule‑based ingredient intelligence engine**
- Shared packages and documentation

---

## 🧱 Monorepo Structure

hair-scanner-platform/ ├── backend/                # API + database + OCR + scoring ├── apps/ │   └── mobile-app/         # User-facing mobile application ├── packages/ │   ├── ingredient-engine/ # Hair compatibility logic │   ├── ingredient-db/     # Ingredient JSON databases │   └── shared/            # Shared types and utils ├── docs/                  # API + science + architecture docs ├── scripts/               # Deployment scripts └── tests/                 # E2E and engine tests

---

## ✅ Core Features

- User authentication
- Personalized hair profile setup
- Barcode scanning via camera
- Ingredient label OCR
- Manual ingredient paste
- Water‑based detection
- Heavy oil & protein detection
- Porosity‑based compatibility logic
- Scalp sensitivity warnings
- Clear verdicts with explanations

---

## 🧠 Hair Scoring Logic

Each product is analyzed using:
- **Porosity rules**
- **Buildup risk scoring**
- **Scalp safety scoring**
- **Protein balance detection**

### Output Per Scan

Verdict: GREAT | CAUTION | AVOID Moisture Score: 0–100 Buildup Risk: 0–100 Scalp Safety: 0–100 Water-Based: Yes / No Heavy Oils: Yes / No Protein Heavy: Yes / No Explanation: Text reasons

---

## 🛠️ Tech Stack

### Backend
- Node.js
- TypeScript
- Fastify or Express
- PostgreSQL
- Prisma ORM
- Redis
- JWT Authentication
- OCR & Barcode Processing

### Mobile App
- React (Mobile-first)
- Camera access
- Image upload
- API integration

### Ingredient Engine
- TypeScript rule-based engine
- JSON ingredient datasets
- Modular scoring system

---

## 📦 Database Models

- **users**
- **hair_profiles**
- **ingredients**
- **products**
- **scans**

---

## 🔁 API Scan Flow

1. User scans barcode or uploads ingredients
2. Ingredients are cleaned and parsed
3. Ingredients are matched to the database
4. User hair profile is fetched
5. Scoring engine runs
6. Verdict + explanation returned

---

## 🧪 Testing

- Engine unit tests
- Backend API tests
- End-to-end scan validation

Tools:
- Jest
- Supertest

---

## 🧾 Environment Setup

Each service includes:

.env.example

You must define:
- Database URL
- JWT secret
- OCR provider keys
- Barcode API keys

---

## 📄 Documentation

Located in `/docs`:
- API Reference
- Hair Science Rules
- Scoring Engine Logic
- System Architecture
- Scan Flow Diagrams

---

## ⚠️ Important Notes

- No lorem‑ipsum logic is used
- All scoring rules are functional placeholders
- This is an MVP designed for real product scanning
- Folder structure must remain unchanged
- TypeScript is required across the platform

---

## 📌 Roadmap

- Community product reviews
- Routine builder
- Country‑specific product availability
- Machine‑learning score refinement
- Retail product partnerships

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

## 📜 License

MIT License

---

## 📬 Contact

Project Owner: Afro Hair Product Scanner Team  
Status: MVP In Development
