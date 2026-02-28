# Product Roadmap: Fittest.ai for Trainers

## Vision
To build the premier AI-powered operating system for padel coaches and personal trainers. Fittest.ai aims to automate the science of programming so coaches can focus on the art of coaching, enabling them to scale their impact from 10 to 100+ athletes without compromising personalization.

## Core Pillars
1.  **Efficiency & Scale:** AI automates 80% of session planning; Coaches refine the final 20%.
2.  **Data-Driven Insights:** Transform "daily check-in" data into professional readiness dashboards.
3.  **Scientific Integrity:** All AI generation is grounded in the `docs/training-context.md` methodology.

---

## Phase 1: Professional Infrastructure (Q2 2026)
**Goal:** Establish the "Trainer" user role and the ability to manage a roster of athletes.

### Features
-   **Role-Based Access Control (RBAC):**
    -   New `Coach` role in Supabase Auth.
    -   Coach onboarding flow (Specialties, Certifications).
-   **Roster Management:**
    -   "My Athletes" dashboard.
    -   Invite system (Link/QR Code) for athletes to join a coach's roster.
-   **Shared Session Library:**
    -   Ability to save AI-generated sessions as "Templates".
    -   Folder organization (e.g., "Pre-season", "Rehab", "Tactical").

### Technical Deliverables
-   [ ] Schema update: `profiles` table with `role` enum.
-   [ ] Schema update: `coach_athlete` relationship table.
-   [ ] Feature: `src/features/trainer-dashboard`.

---

## Phase 2: Athlete Monitoring & Insights (Q3 2026)
**Goal:** Empower coaches with real-time data on athlete readiness and recovery.

### Features
-   **Readiness Dashboard:**
    -   "Traffic Light" system (Red/Yellow/Green) based on Daily Check-ins.
    -   Alerts for high acute workload or injury risk.
-   **Compliance Tracking:**
    -   View adherence to assigned sessions.
    -   Visual progress of "Streaks" and "Volume".
-   **Intervention Logic:**
    -   AI suggestions for coaches: "Athlete X reports knee pain; switch to low-impact technical session?"

### Technical Deliverables
-   [ ] Aggregation functions in Supabase (Edge Functions).
-   [ ] Data visualization components (`recharts` or similar).

---

## Phase 3: Collaborative Pro-Generation (Q4 2026)
**Goal:** Advanced tools for complex programming and group dynamics.

### Features
-   **Pro-Level Controls:**
    -   "Director Mode" for Session Generation (e.g., force specific drills, set precise RPE targets).
    -   Manual override of AI logic blocks.
-   **Group Training Logic:**
    -   Generate sessions for 2v2 (Match Play) or 1v3 (Coach + 3 Players).
    -   Drill rotation logic for mixed-level groups.
-   **Macro-Cycle Planning:**
    -   Generate 4-6 week blocks rather than single sessions.

### Technical Deliverables
-   [ ] Advanced Prompt Engineering (Chain-of-Thought for groups).
-   [ ] "Session Builder" UI (Drag-and-drop blocks).

---

## Phase 4: Brand, Retention & Expansion (2027+)
**Goal:** White-labeling and expanding beyond Padel.

### Features
-   **White-Labeling:**
    -   Custom branding (Logo, Colors) for Coach export PDFs.
    -   Client-facing app view with Coach's branding.
-   **Video Integration:**
    -   Upload/Link video demonstrations for custom drills.
-   **Multi-Sport Support:**
    -   Expansion to Tennis and Pickleball.

---

## Immediate Next Steps (Technical)
1.  **Schema Expansion:** Define `coach_profiles` and `roster_links` in `database.types.ts`.
2.  **Auth Integration:** Migrate from local-only state to Supabase Auth.
3.  **Dashboard Scaffolding:** Initialize `src/features/trainer-dashboard`.
