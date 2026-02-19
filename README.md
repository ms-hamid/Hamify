# Ecommerce Learning Project (Next.js + Prisma + TypeScript)

This project is a personal study lab designed to bridge the gap between **JavaScript Fundamentals** and building modern, production-ready applications. It focuses heavily on understanding **Type Safety (TypeScript)**, **Database Interactions**, and applying **Clean Code** principles in a real-world context.

## 🎯 Learning Objectives

This repository is not just about building an ecommerce store; it's about mastering the "Why" and "How" behind the code:

- **From JavaScript to TypeScript:** Transitioning from dynamic typing to strict typing to catch errors early.
- **Data Modeling:** Designing database schemas with **Prisma ORM** and understanding relationships (One-to-Many).
- **server-side vs client-side:** Understanding when to use `"use client"` vs `"use server"` (Server Actions).
- **Clean Code Architecture:**
  - **Data Access Layer (DAL):** Separating database logic from UI components.
  - **Centralized Configuration:** Managing constants and validation schemas in one place.
  - **DRY Principle:** Refactoring repetitive code into reusable functions.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Styling:** Tailwind CSS (Shadcn UI)
- **Storage:** Supabase Storage (for product images)
- **Validation:** Zod

## 🚀 Key Implementation Concepts

### 1. Data Access Layer (DAL)

Instead of scattering database queries across random files, we centralized them in `lib/dal/`. This mimics professional patterns where the UI doesn't know _how_ data is fetched, only _that_ it is fetched.

```typescript
// Example: lib/dal/products.ts
export const getProducts = cache(async () => {
  return await prisma.product.findMany({ ... });
});
```

### 2. Centralized Validation (Schema)

We moved all Zod schemas to `lib/schema.ts`. This ensures that validation rules (e.g., "Product price must be > 0" or "Image must be PNG/JPG") are consistent across the app.

### 3. Server Actions & Type Safety

We use Next.js Server Actions for mutations (Create, Update, Delete). TypeScript ensures that the data sent from the client matches exactly what the server expects.

```typescript
// Example: lib/actions.ts
export async function createProduct(data: TProduct) {
  // Typescript ensures 'data' matches the TProduct shape
}
```

## 📂 Project Structure

```
├── app/
│   ├── (admin)/dashboard/  # Admin Panel (Protected)
│   │   ├── (index)/        # Feature modules (Products, Brands, Orders)
│   │   │   ├── products/
│   │   │   │   ├── _components/  # UI Components (Dialogs, Tables)
│   │   │   │   ├── lib/          # Action wrappers
│   │   │   │   └── page.tsx      # Main View
│   │   └── layout.tsx
├── lib/
│   ├── dal/                # Data Access Layer (Database Queries)
│   ├── schema.ts           # Centralized Zod Schemas
│   ├── constants.ts        # Shared Constants (File limits, MIME types)
│   ├── prisma.ts           # Prisma Client Instance
│   └── upload.ts           # Supabase Storage Logic
├── prisma/
│   └── schema.prisma       # Database Models
└── public/                 # Static Assets
```

## 📝 Getting Started

1.  **Clone the repo**
2.  **Install dependencies:** `npm install`
3.  **Setup Environment Variables:**
    Create a `.env` file with:
    ```
    DATABASE_URL="postgresql://..."
    NEXT_PUBLIC_SUPABASE_URL="https://..."
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="..."
    SUPABASE_SERVICE_ROLE_KEY="..."
    ```
4.  **Run Migrations:** `npx prisma migrate dev`
5.  **Start Dev Server:** `npm run dev`

---

_Built with ❤️ for learning and mastering modern web development._
