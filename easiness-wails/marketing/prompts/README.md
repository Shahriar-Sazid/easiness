# How to Use These Prompts

This folder contains ready-made prompts for generating marketing content using Claude or NotebookLM.

You do not need to know marketing. You do not need to be a copywriter.
Follow the steps below and you will get professional marketing copy in minutes.

---

## Step 1 — Choose your tool

**Option A: Claude (claude.ai)**
- Go to claude.ai and start a new conversation
- Upload context files (Step 2), then paste the prompt (Step 3)
- Best for: single pieces of content, back-and-forth refinement

**Option B: NotebookLM (notebooklm.google.com)**
- Go to notebooklm.google.com and create a new notebook
- Upload context files as "sources" (Step 2)
- Paste the prompt in the chat (Step 3)
- Best for: generating many pieces of content from the same context

---

## Step 2 — Upload these context files

Before using any prompt, you must give the AI the context files. These files tell the AI what
Easiness is, who the customers are, and how to write.

**Always upload all four of these files:**

1. `marketing/context/product-overview.md`
2. `marketing/context/features-and-benefits.md`
3. `marketing/context/pricing-strategy.md`
4. `marketing/context/brand-voice.md`

**Also upload the relevant customer segment file depending on who you are targeting:**

- Segment 1 (Retail Shops): `marketing/customers/segment-1-retail-shops.md`
- Segment 2 (Wholesale): `marketing/customers/segment-2-wholesalers.md`
- Segment 3 (Trading): `marketing/customers/segment-3-trading-companies.md`

**How to upload in Claude:**
Click the paperclip icon in the chat input and select the files.

**How to upload in NotebookLM:**
Click "Add Source" and upload the markdown files as text.

---

## Step 3 — Paste the prompt

Open the prompt file you want to use from the subfolders below.
Copy the entire contents of the file and paste it into the chat.
Claude or NotebookLM will generate the content.

---

## Step 4 — Refine the output

The first output is a starting point. You can ask follow-up questions like:

- "Make it shorter"
- "Make the tone more casual / more formal"
- "Add a call to action at the end"
- "Write a version for WhatsApp"
- "Change the product name to [X]"
- "Use this example: [your real example]"
- "Our price is different — it's [X]. Update the copy."

---

## Folder structure

```
prompts/
├── README.md                          ← This file
│
├── all-segments/
│   ├── website-hero-section.md        ← Homepage headline + subtext
│   └── app-store-listing.md           ← Description for software directories
│
├── segment-1-retail/
│   ├── facebook-post-series.md        ← 5 Facebook posts for retail shop owners
│   ├── cold-email.md                  ← Cold email to retail shop owners
│   └── whatsapp-broadcast.md          ← WhatsApp broadcast message series
│
├── segment-2-wholesale/
│   ├── linkedin-post-series.md        ← 5 LinkedIn posts for wholesalers
│   └── cold-email.md                  ← Cold email to wholesale businesses
│
└── segment-3-trading/
    ├── linkedin-post-series.md        ← 5 LinkedIn posts for trading companies
    └── cold-email.md                  ← Cold email to trading/import-export companies
```

---

## Important notes

- Always read the generated content before publishing. AI makes mistakes.
- Adjust prices if you are selling in a different market (see `pricing-strategy.md`).
- Replace placeholder text like `[your city]` or `[your name]` with real details.
- Never publish claims you cannot back up. If the content says "saves you 3 hours a week", make sure that is true for your customers.

---

## Getting the best results

The AI generates better content when you give it specific details. After pasting the prompt, add a line like:

> "Note: I am based in [city/country]. My customers are mostly [specific type]. Our current price is [X]."

This makes the output feel less generic and more relevant to your market.
