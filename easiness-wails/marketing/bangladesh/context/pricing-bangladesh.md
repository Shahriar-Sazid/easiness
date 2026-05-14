# Easiness — Pricing Strategy for Bangladesh

This file defines the pricing structure specifically for the Bangladesh market.
It replaces the global pricing in `marketing/context/pricing-strategy.md` for this market.

---

## Core pricing philosophy for Bangladesh

1. **The base price must feel like a no-brainer.** If a shopkeeper spends more on tea per month than on Easiness, price objections disappear.
2. **Sync is a premium feature that costs real money (server costs) — price it accordingly.**
3. **Offer both monthly and yearly options.** Many small business owners prefer monthly because cash flow is unpredictable.
4. **Yearly saves the customer 2 months** — this is the incentive to pay upfront.
5. **Never hide the price.** Show all tiers clearly on your website or in your messages.

---

## Pricing tiers — Bangladesh

### Tier 1 — Offline Plan (ব্যক্তিগত)

| Period | Price |
|--------|-------|
| Monthly | ৳60 / month |
| Quarterly | ৳160 / 3 months (saves ৳20) |
| Yearly | ৳600 / year (saves ৳120 — 2 months free) |

**Who it's for:** Single shop owner, one computer, no need to access from another device.

**What's included:**
- All core features: products, stock management, purchase orders, sales invoices, accounts, people management, transaction ledger, dashboard
- PDF export (professional invoices and purchase orders)
- Works fully offline — no internet required
- Data stored on your computer only
- Email/FAQ support

**Positioning:**
> "৳60 টাকায় সারা মাস। আপনার দোকানের স্টক, ক্রয়, বিক্রয় এবং লাভ — সব এক জায়গায়।"
> (Bengali: "৳60 a month. Your shop's stock, purchases, sales and profit — all in one place.")

**English positioning:** "Less than the cost of a cup of tea per day. Everything you need to run your shop — on one computer, no internet required."

---

### Tier 2 — Sync Plan (সিঙ্ক)

| Period | Price |
|--------|-------|
| Monthly | ৳180 / month |
| Quarterly | ৳490 / 3 months (saves ৳50) |
| Yearly | ৳1,800 / year (saves ৳360 — 2 months free) |

**Who it's for:** Shop owner or manager who wants to check business data from a phone or second computer.

**What's included — everything in Offline, plus:**
- Cloud sync to your own server (or hosted option)
- Web browser access from any device (phone, tablet, second computer)
- Access your data when you are away from the main computer
- Priority email support

**Positioning:**
> "আপনার দোকানে বসে কাজ করুন, বাড়ি থেকে চেক করুন। সব সময় আপডেট।"
> (Bengali: "Work at your shop, check from home. Always updated.")

**English positioning:** "Work at your desk, check sales from your phone at home. Your data follows you — securely, on your own server."

**Why the price jumps from ৳60 to ৳180:**
Cloud sync requires a server. This is a real cost — hosting, bandwidth, maintenance. The 3x price increase reflects this. When you explain this to customers, most understand and either stay on the Offline plan (which is completely fine) or upgrade because the access from phone is worth it to them.

---

### Tier 3 — Team Plan (টিম)

| Period | Price |
|--------|-------|
| Monthly | ৳360 / month |
| Quarterly | ৳980 / 3 months (saves ৳100) |
| Yearly | ৳3,600 / year (saves ৳720 — 2 months free) |

**Who it's for:** Business with 2+ staff who all need to see or enter data (manager, salesperson, warehouse worker).

**What's included — everything in Sync, plus:**
- Multiple user accounts with separate logins
- Access from any browser for all team members
- Self-hosted server setup assistance
- Priority support with 24-hour response

**Positioning:**
> "আপনার সেলসম্যান মাঠে, আপনি অফিসে — দুজনেই একই ডেটা দেখছেন।"
> (Bengali: "Your salesperson in the field, you in the office — both seeing the same data.")

**English positioning:** "Your salesperson at the customer's site, your warehouse manager at the back, and you — all seeing the same live data."

---

## Why offer monthly, quarterly, and yearly?

| Option | Who chooses it | Your benefit |
|--------|---------------|--------------|
| Monthly | New customers who are unsure; seasonal businesses | Lower commitment barrier to start |
| Quarterly | Customers who want to pay less often but aren't ready for yearly | 3x fewer payment transactions |
| Yearly | Confident customers; businesses with stable cash flow | Best cash flow for you; lower churn risk |

**Recommendation:** Push yearly during the first sale. If they hesitate, offer monthly to get them started.
Once they use it for 1–2 months and see the value, upgrading to yearly is an easy conversation.

---

## How to collect payment in Bangladesh

| Method | Details |
|--------|---------|
| **bKash** | Most widely used mobile payment. Send a bKash payment request to the customer. |
| **Nagad** | Government-backed mobile payment. Growing rapidly, especially outside Dhaka. |
| **Rocket (DBBL)** | Dutch-Bangla Bank mobile banking. |
| **Bank transfer** | For larger businesses (Segment 2 and 3) who prefer bank-to-bank. |
| **Cash** | For local sales where you meet the customer in person. |

**Avoid:** Requiring international credit/debit cards — very few small business owners in Bangladesh have them.

**Recommended setup:**
1. Create a bKash merchant account (merchant.bkash.com) — this lets you send payment requests and receive payments professionally
2. Create a Nagad merchant account (nagad.com.bd)
3. For Tier 2 and 3 customers, accept bank transfer and issue a proper receipt

---

## License key delivery

After payment:
1. Generate a license key using the keygen tool:
   ```bash
   go run ./cmd/keygen --private private.key --expiry 2026-12-31
   ```
   Set the expiry date based on the plan purchased (1 month, 3 months, or 1 year from today).
2. Send the license key to the customer via WhatsApp, Messenger, or email.
3. Include short instructions: "Open Easiness → License → Enter this key → Click Activate"

---

## Price objection handling — Bangladesh

**"দাম বেশি" (It's too expensive)**
> "Offline plan মাত্র ৳60 টাকা মাসে — এক কাপ চায়ের চেয়েও কম। একটা স্টক মিসের কারণে যে ক্ষতি হয়, তার চেয়ে অনেক কম।"
> (Monthly offline is ৳60 — less than a cup of tea. Less than the loss from a single stockout.)

**"আমি Excel ব্যবহার করি" (I use Excel)**
> "Excel-এ কি প্রতিটা পণ্যের লাভ দেখায়? স্টক নিজে থেকে আপডেট হয়? সাপ্লায়ারের বকেয়া ট্র্যাক করে?"
> (Does Excel show profit per product automatically? Does stock update itself? Does it track supplier balances?)

**"Internet নেই তখন কী হবে?" (What if there's no internet?)**
> "Offline plan-এ internet লাগে না মোটেই। আপনার কম্পিউটারে সব data থাকে। লোডশেডিং বা নেট না থাকলেও কাজ চলবে।"
> (Offline plan needs no internet at all. All data is on your computer. Works during load-shedding or when internet is down.)

**"আমার computer নেই" (I don't have a computer)**
> "Sync plan-এ মোবাইল থেকে browser দিয়েও ব্যবহার করা যায়। তবে প্রথমে একটা computer বা laptop থেকে setup করতে হবে।"
> (With Sync plan, you can also use it from mobile browser. But initial setup needs a computer or laptop.)

**"চেষ্টা করে দেখতে চাই" (I want to try it first)**
> "১৪ দিনের free trial দিচ্ছি — কোনো payment লাগবে না। পছন্দ না হলে কিছু বলতে হবে না।"
> (14-day free trial — no payment needed. If you don't like it, no obligation.)

---

## Discount strategy

- Do NOT discount the listed price without a reason (devalues the product).
- **Acceptable reasons to discount:**
  - Launch offer: "প্রথম ৫০ জনের জন্য ৫০% ছাড়" (50% off for first 50 customers) — time-limited
  - Referral: "আপনার বন্ধুকে রেফার করুন, দুজনেই ১ মাস ফ্রি পাবেন" (Refer a friend, both get 1 month free)
  - Annual prepay: already built into the pricing (2 months free)

---

## Pricing comparison (to use in marketing)

| What they spend on | Cost |
|-------------------|------|
| One cup of tea per day | ~৳900/month |
| One accounting notebook | ৳50–100 one-time |
| One stockout loss | ৳500–5,000+ per incident |
| Easiness Offline | ৳60/month |
| Easiness with Sync | ৳180/month |

**Marketing line:**
> "একটা হিসাবের খাতার দামে সারা বছর চলে। স্টক, ক্রয়, বিক্রয়, লাভ — সব।"
> (Runs a whole year for the price of one ledger. Stock, purchases, sales, profit — everything.)
