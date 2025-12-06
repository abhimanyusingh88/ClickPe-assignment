live link for the deployed website:-
https://click-pe-assignment.vercel.app
Loan Picks Dashboard (Frontend Intern Mission)
 Setup Instructions

Follow these steps to get the project running locally.

1. Clone & Install

git clone <your-repo-url>
cd clickpe-assignment
npm install


2. Environment Configuration

Create a .env.local file in the root directory and add the following keys:

# Supabase Configuration (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# AI Configuration (Google Gemini)
GEMINI_API_KEY=<your-gemini-api-key>


3. Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor to create the necessary tables and seed data:

-- Create Products Table
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  bank text not null,
  type text,
  rate_apr numeric not null,
  min_income numeric not null,
  min_credit_score int not null,
  tenure_min_months int default 6,
  tenure_max_months int default 60,
  processing_fee_pct numeric default 0,
  prepayment_allowed boolean default true,
  disbursal_speed text default 'standard',
  docs_level text default 'standard',
  summary text,
  faq jsonb default '[]'::jsonb,
  terms jsonb default '{}'::jsonb
);

-- (Optional) Add dummy data using the INSERT script provided in project docs


4. Google OAuth Setup

Go to Supabase Dashboard > Authentication > Providers > Google.

Enable Google and paste your Client ID and Client Secret from Google Cloud Console.

In Google Cloud Console, set the Authorized Redirect URI to:
https://<your-project-id>.supabase.co/auth/v1/callback

5. Run the Application

npm run dev


Open http://localhost:3000 to view the dashboard.

🏷️ Badge Logic

The dashboard dynamically assigns badges to loan products to highlight their key features. This logic is implemented in the ProductCard component (components/product-card.tsx).

Badge Text

Condition Logic

Description

Low APR

rate_apr < 11%

Highlights loans with competitive interest rates.

Zero Processing Fee

processing_fee_pct === 0

Indicates no upfront administrative charges.

No Prepayment Penalty

prepayment_allowed === true

Shows that the loan can be closed early without extra cost.

Low Credit Score OK

min_credit_score < 700

Highlights products accessible to users with average credit history.

Fast Disbursal

disbursal_speed === 'instant' OR Bank is 'Bajaj Finserv'

Flags loans that are processed and credited quickly.

Note: The UI limits the display to the top 3 most relevant badges per card to maintain a clean layout.

AI Grounding Strategy

The AI Chatbot (/api/ai/ask) is designed to provide hallucination-free answers by strictly grounding the AI model in the specific product's data.

1. Context Injection

When a user asks a question about a specific loan (e.g., "What is the interest rate?"), the backend:

Receives the productId.

Fetches the entire row for that product from the Supabase database.

Injects this data directly into the System Prompt.

2. Strict System Prompt

We use a "Role-Based" prompting strategy with explicit constraints:

"You are a helpful financial assistant. You are answering questions about a specific loan product.
PRODUCT DETAILS: [JSON Dump of Database Row]
INSTRUCTIONS:

Answer the user's question using ONLY the above data.

If the answer is not in the data, say 'I don't have that specific information.'

Do not make up facts."

3. Isolation

The AI context is isolated per chat session. It does not know about other loan products in the database, preventing it from confusing details between two different offers (e.g., mixing up the HDFC interest rate with the SBI tenure).
