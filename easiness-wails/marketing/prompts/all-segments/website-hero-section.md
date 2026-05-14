# Prompt: Website Hero Section (All Segments)

**Before using this prompt:** Upload the four context files to Claude or NotebookLM.
(No segment file needed — this prompt generates options for all three audiences.)

---

## What is a hero section?

The hero section is the first thing a visitor sees when they land on your website.
It has three parts:
1. **Headline** — the biggest text on the page (1 short sentence)
2. **Subheadline** — 1–2 sentences that explain the headline
3. **Call to action** — one button (e.g. "Try free for 14 days" or "See how it works")

The goal of the hero section is to make the visitor think "this is for me" within 5 seconds.
If they don't understand what the product does and who it is for within 5 seconds, they leave.

---

## Prompt

```
You are a marketing copywriter for a software product called Easiness.

I have provided you with context files about the product, its features and benefits, pricing, and brand voice.

Write three versions of a website hero section — one for each target customer segment.

Segments:
- Version A: Retail shop owners (grocery, clothing, electronics, pharmacy, hardware)
- Version B: Wholesale and distribution businesses
- Version C: Trading and import/export companies

For each version, write:
1. Headline — Maximum 8 words. Must be specific and benefit-driven. Not clever — clear.
2. Subheadline — 1–2 sentences (maximum 30 words). Expands on the headline. States what the product does and who it is for.
3. CTA button text — 2–5 words. Action verb. Specific. Not "Learn More" or "Get Started".
4. One supporting line below the CTA (optional, max 12 words) — removes a fear or objection. Example: "No credit card required. Works offline. Cancel anytime."

Requirements:
- Use the brand voice: clear, confident, empathetic
- The headline must answer: "What does it do for me?" — not "What is it?"
- Do NOT use: "the ultimate", "powerful", "seamless", "robust", "all-in-one" (unless very specific), "streamline"
- The visitor should immediately know: what the product does, who it is for, and what to do next
- Use the customer's own language from the brand voice guide

Output format:
VERSION A — Retail Shop Owners
Headline: [headline]
Subheadline: [subheadline]
CTA: [button text]
Supporting line: [optional line]

VERSION B — Wholesale & Distribution
Headline: [headline]
Subheadline: [subheadline]
CTA: [button text]
Supporting line: [optional line]

VERSION C — Trading & Import/Export
Headline: [headline]
Subheadline: [subheadline]
CTA: [button text]
Supporting line: [optional line]

Then, write one universal version that works for all three segments without being too generic.

UNIVERSAL VERSION
Headline: [headline]
Subheadline: [subheadline]
CTA: [button text]
Supporting line: [optional line]
```

---

## How to use the output

1. If your website serves all three segments, use the Universal Version
2. If you are building a separate landing page for each segment (recommended), use the segment-specific version
3. Test two different headlines using A/B testing if your website platform supports it (Webflow, Framer, and WordPress all support this)
4. The supporting line below the CTA is one of the highest-impact spots — use it to remove the biggest objection ("No monthly fees", "Works offline", "Try free for 14 days")

## What makes a good headline (reference)

Weak: "The business management software that grows with you"
Strong: "Know exactly what you have, what you owe, and what you earned"

Weak: "Easiness — simplifying business operations"
Strong: "Stop guessing your stock levels. Know them."

The test: read the headline and ask "so what?" — if you can still ask that, it's not specific enough.
