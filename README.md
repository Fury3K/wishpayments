# WishPay 🐷

**WishPay** is a smart financial goal tracking application designed to help you manage your money by clearly separating your **Necessities (Needs)** from your **Wishes (Wants)**.

Stop dreaming and start saving. Prioritize your absolute essentials, fund your fun desires, and watch your financial goals become reality—one deposit at a time.

## 🚀 Core Concept

The philosophy behind WishPay is simple: **Prioritize what you need, plan for what you want.**

*   **⚡ Needs (Necessities):** These are your non-negotiables (e.g., Rent, Utilities, Groceries). They often have high urgency and are critical for your daily life.
*   **💖 Wants (Wishes):** These are the things you dream of having (e.g., New Phone, Vacation, Gaming Console). They make life fun but shouldn't come at the cost of your needs.

WishPay helps you visualize this balance, ensuring you don't accidentally spend your rent money on a new gadget.

## ✨ Key Features

*   **Smart Categorization:** Distinct tabs for "Needs" and "Wants" to keep your priorities clear.
*   **Flexible Funding Sources:** Link your goals to a central **WishPay Wallet** or multiple **Bank Accounts**. Choose where the money comes from during setup or when adding funds.
*   **Multi-Bank Management:** Add and customize multiple bank accounts with unique colors (Blue, Purple, Green, Orange, Red, Pink, Cyan, Yellow, Black).
*   **Goal Tracking:** Detailed progress bars for every item. See exactly how much you've saved and how much is left to go.
*   **Visual Indicators:** Vertical color strips on goal cards and transaction history items show exactly which bank is funding each goal.
*   **Priority System:** Mark needs as High, Medium, or Low priority (with corresponding icons: 🔥, ⚡, 🌱) to know what to fund first.
*   **Advanced History:** Filter your transaction history by type (Needs/Wants) and by specific funding source (Wallet or Bank).
*   **Safe Guards:** Built-in logic prevents you from funding "Wants" if you have high-priority "Needs" that are still unfunded.
*   **Theme Support:** Beautiful UI with seamless Dark (Dim) and Light (Cupcake) mode support.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI v5](https://daisyui.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
*   **Authentication:** Custom JWT (jose) & bcryptjs
*   **Icons:** [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

*   Node.js (v18+)
*   PostgreSQL Database

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/wishpayments.git
    cd wishpayments
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    DATABASE_URL=postgresql://username:password@localhost:5432/wishpay_db
    JWT_SECRET=your_super_secret_key_here
    ```

4.  **Database Setup:**
    Push the schema to your database:
    ```bash
    npm run db:migrate
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).