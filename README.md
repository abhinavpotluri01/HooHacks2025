# Outfitted.AI 👟✨

**From inspiration to action: AI-powered fashion discovery.**

Ever spotted someone’s outfit and thought, *“Where can I get shoes like that?”*  
Outfitted.AI bridges that gap—upload a photo, get four AI-designed shoe concepts that match the vibe, and instantly find shoppable products online.

---

## 🎯 Inspiration

Scrolling through fashion sites or hunting for the perfect item takes forever.  
We wanted to flip the process: **start with the look you like, then find matching pieces instantly.**

So we built a tool that uses visual AI to generate stylish footwear ideas—then scrapes the web to find real shoes that match.

---

## 💡 What It Does

1. 📸 **Input**: Upload a photo of a person’s outfit.
2. 🧠 **Generation**: AI designs 4 shoe concepts matching their vibe.
3. ✅ **Selection**: You pick the concept you like best.
4. 🔍 **Search & Scrape**: We reverse image search that concept and return real, shoppable products with:
   - Product Name  
   - Price  
   - Store  
   - Product Image

**→ A few clicks from visual inspiration to real-world fashion.**

---

## ⚙️ How It Works

### 👁️ Gemini Vision + Style Generation
- Gemini 2.0 Flash analyzes the photo.
- Our custom generative model creates **4 AI-designed shoes** tailored to the outfit.

### 🧍 User Selection
- You pick your favorite from the 4 concepts.

### 🔎 Reverse Image Search + Scraping
- Using **Serp API**, we reverse image search the concept.
- **Gemini 2.5 Pro** and our scraper extract:
  - Product Title  
  - Price  
  - Store URL  
  - Visuals  

---

## 🧱 Built With

- **React Native + TypeScript** — Cross-platform mobile app
- **Python** — Backend & scraping logic
- **MongoDB** — User/product data storage
- **Amazon Web Services** — Hosting & pipeline orchestration
- **Gemini 2.0 & 2.5** — Image analysis, generation, and scraping logic
- **Serp API** — Reverse image search from Google

---

## ⚔️ Challenges

- 🎨 **Visual Prompt Tuning** — Getting stylish and coherent shoe generations from Gemini required lots of experimentation.
- 🧼 **Scraping Variability** — Product pages across retailers are inconsistent; scraping needed flexible parsing logic.
- ⏱️ **Timing + Sync** — Ensuring each step in the pipeline ran smoothly without long delays.

---

## 🏆 Accomplishments

- ✅ End-to-end fashion discovery in a weekend
- 🤝 Bridged generative AI with real product search
- ⚡ Delivered a tool that feels practical, fast, and fun

---

## 📚 What We Learned

- Using Gemini for **visual-to-style generation**
- Implementing **reverse image search pipelines** with real-world e-commerce data
- Chaining multiple AI and scraping layers into one **seamless UX**

---

## 📈 What’s Next

- 💅 **Polished Frontend UI** — Launching a clean, responsive app interface
- 🧥 **Full Outfit Generation** — Not just shoes—tops, pants, accessories next
- 🔐 **User Accounts & History** — Save searches, revisit old looks
- 🛍️ **E-commerce Integrations** — Retailer partnerships for direct product pulls & affiliate support

We believe Outfitted.AI can evolve into your go-to **style discovery companion**.

---

## 🤝 Contributing

We’re open to PRs, feedback, and collaborations.  
Feel free to fork, star ⭐️, and get involved!

---

## 📜 License

MIT License


