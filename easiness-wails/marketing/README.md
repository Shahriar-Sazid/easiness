# Easiness — Marketing Folder

Welcome! This folder contains everything you need to market **Easiness** online and offline.
You do not need any marketing experience to use it.

---

## What is digital marketing? (Quick intro)

Digital marketing means promoting your product where your customers already spend time:
- **Facebook / Instagram** — best for reaching small shop owners
- **LinkedIn** — best for reaching business owners and managers
- **WhatsApp** — best for direct outreach and local markets
- **Email** — best for professional follow-ups
- **Your website / app marketplace listing** — best for people who are already searching

You do not need to do all of these at once. Start with one channel, get comfortable, then add more.

---

## How this folder is organized

```
marketing/
│
├── context/                   ← Feed these files to Claude or NotebookLM as background
│   ├── product-overview.md    ← What Easiness is (non-technical, plain language)
│   ├── features-and-benefits.md ← Every feature explained as a customer benefit
│   ├── pricing-strategy.md    ← Recommended pricing tiers and how to talk about them
│   └── brand-voice.md         ← How Easiness should sound: tone, words to use/avoid
│
├── customers/                 ← Who buys Easiness and why
│   ├── overview.md            ← All three customer segments at a glance
│   ├── segment-1-retail-shops.md       ← Small shop owners (grocery, clothing, etc.)
│   ├── segment-2-wholesalers.md        ← Distributors and wholesale businesses
│   └── segment-3-trading-companies.md  ← Import/export and trading businesses
│
└── prompts/                   ← Instructions to give Claude or NotebookLM
    ├── README.md              ← Step-by-step guide on how to use the prompts
    ├── all-segments/          ← Content that works for all customer types
    ├── segment-1-retail/      ← Prompts targeting retail shop owners
    ├── segment-2-wholesale/   ← Prompts targeting wholesale/distribution businesses
    └── segment-3-trading/     ← Prompts targeting trading/import-export companies
```

---

## The workflow (step by step)

### Step 1 — Choose your audience
Decide which customer segment you want to reach first. If you are just starting out,
begin with **Segment 1 (Retail Shops)** — they are the largest group and easiest to reach
on Facebook.

### Step 2 — Decide what content you need
Examples: a Facebook post, a cold email, a WhatsApp message, a website description.
Each prompt file in `prompts/` creates a specific type of content.

### Step 3 — Open Claude or NotebookLM

**Using Claude (claude.ai):**
1. Open a new chat at https://claude.ai
2. Paste the contents of `context/product-overview.md`
3. Paste the contents of the relevant customer file (e.g. `customers/segment-1-retail-shops.md`)
4. Then paste the prompt from the relevant prompt file
5. Review the output, ask Claude to adjust tone/length as needed

**Using NotebookLM (notebooklm.google.com):**
1. Create a new notebook
2. Upload these files as sources:
   - `context/product-overview.md`
   - `context/features-and-benefits.md`
   - `context/brand-voice.md`
   - The relevant customer segment file
3. In the chat, paste the prompt from the relevant prompt file
4. Download or copy the output

### Step 4 — Review and personalise
Always read the output before publishing. Add:
- Your real prices
- Your contact details
- Your local currency
- A real photo or screenshot of the app

### Step 5 — Post and track results
After you post, note:
- How many people saw it (reach/impressions)
- How many clicked or responded
- How many became customers

Use this to decide which content to make more of.

---

## Recommended order for a new seller

| Week | Action |
|------|--------|
| 1 | Set up your pricing (see `context/pricing-strategy.md`). Create your website or marketplace listing using the prompt in `prompts/all-segments/app-store-listing.md` |
| 2 | Post 3 Facebook posts targeting retail shop owners. Use `prompts/segment-1-retail/facebook-post-series.md` |
| 3 | Send 10 cold emails to local business owners. Use `prompts/segment-1-retail/cold-email.md` |
| 4 | Review what worked, repeat the best-performing content |

---

## Quick tips for someone new to marketing

1. **Consistency beats perfection.** One post per week for a year beats ten posts in one month and then silence.
2. **Speak to one person.** Write as if you are talking to one specific shop owner, not "all businesses".
3. **Benefits, not features.** Say "know your profit instantly" not "financial reporting module".
4. **Use real screenshots.** Show the actual app. People trust what they can see.
5. **Ask for feedback.** Send the app to 5 people in your target market and ask what confused them. This is more valuable than any advertising.
6. **Price confidently.** Do not apologise for your price. If the product saves someone $500/year in mistakes, charging $59/year is very fair.
