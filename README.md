# Micro-SaaS Subscription Dashboard (Spec #03)

> A modern, multi-tenant B2B platform template engineered to handle multi-tier subscriptions, role-based access control (RBAC), metered API usage tracking, and automated billing synchronization via Stripe.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-teal?style=flat&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635bff?style=flat&logo=stripe)](https://stripe.com/)

---

## 1. Architecture Highlights

1. **Multi-Tenant Workspace Engine**
   - Complete organization-level data isolation.
   - Dedicated workspace routing (`/dashboard/[orgSlug]`).
   - Secure invitation tokens with expiration limits.
   - Enterprise SAML/OIDC Single Sign-On (SSO) configuration.

2. **Stripe Billing & Webhook Synchronization**
   - Multi-tier plans: **Free ($0/mo)**, **Pro ($29/mo)**, **Team ($99/mo)**, and **Enterprise ($299+)**.
   - Prorated tier upgrades, downgrades, and cancellations.
   - Idempotent Stripe webhook listener (`/api/webhooks/stripe`) handling subscription states, invoices, and automated grace periods.

3. **Role-Based Access Control (RBAC)**
   - Strict hierarchical access levels: `OWNER`, `ADMIN`, `BILLING`, and `MEMBER`.
   - Granular permission matrix governing seat management, API token creation, payment settings, and workspace deletion.
   - Live interactive RBAC role simulator in the dashboard header for testing permissions in real time.

4. **Metered Usage & Rate Limiting**
   - Telemetry tracking for consumption metrics (`api_requests`, `storage_bytes`).
   - Real-time **Soft Warning (80%)** and **Hard Warning (95%)** threshold detection.
   - Automated overage billing calculation (+$0.15 / 1,000 requests over plan quota).
   - In-memory / Upstash Redis **Token Bucket Rate Limiting** (60 req/min/key) with `X-RateLimit-*` headers.

---

## 2. User Tier & Entitlement Matrix

| Plan Tier | Monthly Price | Seat Limit | Metered API Quota | Entitlements / Features |
| :--- | :--- | :--- | :--- | :--- |
| **Free Tier** | $0 / mo | 1 Seat | 1,000 req / mo | Community Support, Basic Metrics, 1 API Key |
| **Pro Tier** | $29 / mo | 5 Seats | 50,000 req / mo | Email Support, Custom Webhooks, Audit Logs |
| **Team Tier** | $99 / mo | 20 Seats | 500,000 req / mo | Priority Support, SSO, Usage Overage Billing, Advanced RBAC |
| **Enterprise**| Custom ($299+) | Unlimited | Custom SLA | Dedicated Account Manager, Custom Contracts, 99.99% SLA |

---

## 3. Project Structure

```
microsaas-dashboard/
├── .env.example
├── docker-compose.yml
├── package.json
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── (dashboard)/
    │   │   ├── [orgSlug]/
    │   │   │   ├── api-keys/page.tsx
    │   │   │   ├── billing/
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── success/page.tsx
    │   │   │   ├── settings/page.tsx
    │   │   │   ├── team/page.tsx
    │   │   │   └── usage/page.tsx
    │   │   └── layout.tsx
    │   ├── api/
    │   │   ├── v1/
    │   │   │   └── metrics/route.ts       # Metered external API endpoint
    │   │   └── webhooks/
    │   │       └── stripe/route.ts        # Idempotent Stripe webhook listener
    │   └── layout.tsx
    ├── components/
    │   ├── billing/
    │   │   ├── PricingCards.tsx
    │   │   └── UsageProgressBar.tsx
    │   ├── team/
    │   │   ├── InviteMemberModal.tsx
    │   │   └── TeamTable.tsx
    │   ├── layout/
    │   │   ├── Sidebar.tsx
    │   │   └── Header.tsx
    │   └── ui/
    │       ├── Badge.tsx
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       └── Modal.tsx
    ├── lib/
    │   ├── auth.ts                        # Session & RBAC helpers
    │   ├── constants.ts                   # Plan matrix & thresholds
    │   ├── db.ts                          # Database & seeded repository
    │   ├── redis.ts                       # Upstash Redis / Token Bucket rate limiter
    │   └── stripe.ts                      # Stripe SDK setup & checkout simulator
    └── services/
        ├── billing.service.ts             # Customer & subscription management
        ├── rbac.service.ts                # Permission enforcement
        └── usage.service.ts               # Metered usage increments & analytics
```

---

## 4. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm or yarn

### Quick Start (Local Development)
```bash
# 1. Clone the repository
git clone https://github.com/ademolaadepo28-arch/Micro-SaaS-Subscription-Dashboard.git
cd Micro-SaaS-Subscription-Dashboard

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Environment (Optional for Postgres & Redis)
```bash
docker compose up -d
```

---

## 5. Testing the System

1. **Multi-Tenant Switcher**: Navigate between pre-configured organizations (`Acme Cloud Dynamics`, `Hyperflow AI Labs`, and `DevStudio Indie`).
2. **Interactive RBAC Simulator**: Use the RBAC dropdown in the dashboard header to test actions as `OWNER`, `ADMIN`, `BILLING`, or `MEMBER`.
3. **Metered Ingestion & Quota Alerts**: Go to `/dashboard/acme-corp/usage` and click `+50,000 Heavy Burst` to watch real-time quota transitions and overage billing calculations.
4. **Interactive API Tester**: Visit `/dashboard/acme-corp/api-keys` and click `Dispatch API Request` to test token authentication and inspect `X-RateLimit-*` headers.
5. **Subscription Upgrades**: Go to `/dashboard/acme-corp/billing` to preview tier changes and Stripe synchronization.

---

## 6. License
MIT License
