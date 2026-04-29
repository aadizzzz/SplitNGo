# 🚂 SplitNGo

<div align="center">
  <h3>Your Smart Train Journey Companion</h3>
  <p>Find confirmed seats on long routes by smartly splitting your journeys!</p>
  <a href="https://splitngo.vercel.app/" target="_blank"><strong>View Live Project »</strong></a>
</div>

<br />

## 🌟 About The Project

**SplitNGo** is an innovative train ticket booking platform designed to solve a common problem: unavailability of direct train tickets for long journeys. Our core algorithm intelligently finds and suggests "split journeys" (layovers), allowing users to travel the same route by seamlessly switching trains or changing seats at intermediate stations, drastically increasing the chances of finding confirmed bookings.

**Live Project URL:** [https://splitngo.vercel.app/](https://splitngo.vercel.app/)

---

## 🧠 Core Concept & Algorithm

### The "Split" Matching Algorithm
When direct train tickets are waitlisted or unavailable, SplitNGo's logic kicks in to analyze intermediate stations.
- **Direct Route Search:** First, the system attempts to find a direct train from the source to the destination.
- **Layover/Split Calculation:** If no direct routes are suitable, the algorithm identifies key junction stations between the source and destination. It then matches:
  - Leg 1: Source ➡️ Layover Station
  - Leg 2: Layover Station ➡️ Destination
- **Seamless Integration:** It ensures the arrival time of Leg 1 gives adequate but not excessive buffer time before the departure of Leg 2.

---

## 🏗️ Project Modules & Features

### 1. Authentication & User Management (`/src/pages/Auth.tsx`, `/src/pages/Profile.tsx`)
- Secure login and registration using **Supabase Auth**.
- Persistent user sessions.
- Profile management allowing users to save personal information and preferred travel classes for faster checkout.
- Dashboard for viewing past and upcoming bookings.

### 2. Search & Results Engine (`/src/pages/Results.tsx`)
- Dynamic search interface accepting source, destination, date, and passenger count.
- Results page categorized by "Direct Trains" and "Split Journeys".
- Displays train details, durations, availability, and pricing.

### 3. Booking & Seat Allocation (`/src/pages/Booking.tsx`)
- Comprehensive booking form collecting passenger details and ID verification.
- Validates data using **Zod** and **React Hook Form**.
- Generates realistic mock PNR, Coach (e.g., S4, B2, A1), and Seat Number allocations based on the chosen coach class (Sleeper, 3AC, 2AC, etc.).

### 4. Secure Payment Gateway Integration (`/supabase/functions/create-razorpay-order`)
- **Razorpay** is fully integrated for seamless payments.
- **Server-Side Security:** Order creation is handled securely via **Supabase Edge Functions** (Deno), protecting Razorpay API keys from being exposed on the frontend.
- **Client-Side Checkout:** Razorpay Checkout script loads dynamically to process the payment securely and returns the payment signature.
- **Post-Payment Verification:** Upon successful payment, booking details are securely committed to the Supabase PostgreSQL database.

---

## 💻 Technologies Used

**Frontend**
- **React.js (Vite):** Fast, modern UI development.
- **TypeScript:** Strongly typed codebase for fewer bugs.
- **Tailwind CSS & shadcn/ui:** For a beautiful, responsive, and accessible user interface.
- **Framer Motion:** Smooth micro-animations and page transitions.
- **React Hook Form + Zod:** Form state management and schema validation.

**Backend & Database**
- **Supabase:** Open-source Firebase alternative used for Authentication and PostgreSQL Database.
- **Supabase Edge Functions:** Serverless functions running on Deno for secure backend tasks (Razorpay Order creation).

**Integrations**
- **Razorpay:** Payment gateway.

---

## 🚀 How to Set Up Locally

Follow these steps to get a local copy up and running.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn or pnpm
- A Supabase account and project
- A Razorpay account for API Keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aadizzzz/SplitNGo.git
   cd SplitNGo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Set up Supabase Edge Functions (For Payments)**
   Ensure you have the Supabase CLI installed, then link your project and deploy the functions:
   ```bash
   # Link your project
   npx supabase link --project-ref your_project_id

   # Set Edge Function Secrets
   npx supabase secrets set RAZORPAY_KEY_ID=your_razorpay_key_id
   npx supabase secrets set RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Deploy the edge function
   npx supabase functions deploy create-razorpay-order
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## 📂 Directory Structure Overview

- `src/components/`: Reusable UI components (buttons, inputs, navigation, etc.).
- `src/pages/`: Main application views (Home, Booking, Results, Auth, Profile).
- `src/integrations/supabase/`: Supabase client configuration and types.
- `src/utils/`: Helper functions (payment logic, error handling).
- `supabase/functions/`: Backend serverless Edge Functions (Razorpay integration).

---
<div align="center">
  <i>Developed by Aadi</i>
</div>
