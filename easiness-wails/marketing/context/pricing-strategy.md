# Easiness — Pricing Strategy

This file recommends a pricing structure and explains how to talk about price with customers.
Adjust the exact numbers based on your target market's purchasing power.

---

## Recommended pricing tiers

### Standard — $29 / year
**Who it's for:** Solo shop owner or small business, single computer.

**Includes:**
- All core features (products, stock, PO, invoices, accounts, people, transactions, dashboard)
- Offline-first operation
- PDF export
- 1 device only
- Community support (email/FAQ)

**Positioning:** "Everything you need to run your shop for less than $3/month."

---

### Professional — $59 / year
**Who it's for:** Business owner who needs access on multiple devices or from a browser.

**Includes everything in Standard, plus:**
- Cloud sync across devices
- Web browser access from anywhere
- Priority email support

**Positioning:** "Access your business from your desktop at work and your phone at home."

---

### Enterprise — $129 / year
**Who it's for:** Businesses with a manager and staff who need multi-user access.

**Includes everything in Professional, plus:**
- Self-hosted server setup support
- Multiple user access via web
- Priority support with 24-hour response

**Positioning:** "Your whole team sees the same live data."

---

## Price anchoring tips

When showing pricing, always show all three tiers together. The Enterprise tier makes
Professional look affordable, and Professional makes Standard look like a bargain.

**Always compare to the cost of the problem:**
- "A single stockout mistake costs more than a year of Easiness Standard"
- "One missed customer invoice is worth more than the Professional plan"
- "Most accounting software charges $20–$50 per month. Easiness charges that per year."

---

## How to handle price objections

**"It's too expensive"**
> "Easiness Standard is $29 for a full year — that's less than $2.50 per month. If it saves you from one pricing mistake or one stock loss, it pays for itself in the first week."

**"I use Excel for free"**
> "Excel is free, but your time isn't. How many hours per week do you spend updating it? And can it tell you your profit on each sale automatically?"

**"I'll try the free version first"**
> If you offer a trial: "You can try it free for 14 days — no credit card needed."
> If you don't: "I can show you a live demo so you can see exactly what you get before buying."

**"I'm not sure I need it"**
> "Let me ask you — do you currently know exactly which product made you the most profit last month? If not, Easiness will show you that in the first week."

---

## Trial / free tier recommendation

Consider offering a **14-day free trial** (full features, no credit card). This dramatically
increases conversion for software products. You can implement this by generating a trial
license key with a 14-day expiry using the keygen tool:

```bash
go run ./cmd/keygen --private private.key --expiry 2026-05-28
```

---

## Pricing for different markets

If selling in markets with lower purchasing power (South Asia, Southeast Asia, Africa), consider:
- Standard: $15–$19/year
- Professional: $29–$39/year
- Enterprise: $69–$99/year

The product value is the same. The pricing should reflect local market conditions.

---

## What NOT to do with pricing

- Do not apologise for your price.
- Do not discount heavily without a reason (creates the impression the "real" price is the discount price).
- Do not hide the price — show it clearly on your website.
- Do not offer a free tier that includes all features — it kills paid conversion.
