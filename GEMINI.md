# WishPay - Project Context

## Project Overview
**WishPay** is a financial goal tracking application designed to help users manage their money by distinguishing between "Needs" (necessities) and "Wants" (wishes). It features a virtual wallet, multi-bank account tracking, and goal-oriented savings progress with linked funding sources.

## Tech Stack
*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI v5](https://daisyui.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/) (using `postgres` driver)
*   **Authentication:** Custom JWT implementation using `jose` and `bcryptjs`.
*   **Icons:** [Lucide React](https://lucide.dev/)

## Architecture & Key Directories
*   `app/`: Main application source (Next.js App Router).
    *   `app/api/`: API routes for backend logic (Auth, Items, Banks, User).
    *   `app/components/`: Reusable UI components.
        *   `app/components/modals/`: Specialized modals for adding/editing banks, funds, and goals.
    *   `app/dashboard/`: Main user dashboard with bank carousel and wallet summary.
    *   `app/goals/`: Goals listing page with Needs/Wants filtering.
    *   `app/history/`: Transaction history with source-based filtering.
*   `lib/`: Shared utilities.
    *   `db.ts`: Database connection initialization.
    *   `schema.ts`: Drizzle ORM schema definitions (Users, Items, BankAccounts).
    *   `auth.ts`: Authentication utilities.
*   `drizzle/`: Database migration files.
*   `public/`: Static assets.

## Building and Running

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL Database URL

### Setup & Installation
1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Variables:**
    Ensure `.env` contains:
    ```env
    DATABASE_URL=postgresql://user:pass@host:port/db_name
    JWT_SECRET=your_secret
    ```

### Database Management
*   **Generate Migrations**: `npm run db:generate`
*   **Apply Migrations**: `npm run db:migrate`

### Development
*   **Start Dev Server**: `npm run dev` (http://localhost:3000)

## Development Conventions
*   **Styling:** Tailwind + DaisyUI.
*   **Funding Sources:** Each `Item` (Goal) can optionally link to a `BankAccount` via `bankId`. If `bankId` is null, it defaults to the main `Wallet`.
*   **Visual Cues:** Items and transactions use vertical color strips to indicate the funding source based on the bank's assigned color.
*   **Modals:** `ItemModal` and `AddFundsModal` now include source selection, allowing users to choose which account to deduct from.
*   **History:** Transactions are grouped by date and can be filtered by both type and source bank.

## Recent Major Changes
*   **Dynamic Funding Sources:** Items are now linked to specific banks. Deductions automatically target the correct source balance.
*   **Modal Redesign:** Overhauled "Add Goal" modal with card-based priority selection and bank source dropdown.
*   **Bank Expansion:** Support for 9 customizable bank colors with updated indicators across the entire UI.
*   **History Filters:** Added ability to filter history by source (Wallet vs specific Banks).