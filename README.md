# 🎬 MovieVerse

MovieVerse is a movie discovery web application built with **Next.js** and the **TMDB API**.  
It uses **Server-Side Rendering (SSR)** to deliver SEO-friendly dynamic movie pages with a modern, cinematic UI.

---

## 🚀 Live Demo

🔗 https://movie-seo-app.vercel.app

---

## ✨ Features

- ✅ Server-Side Rendering (SSR) with Next.js  
- ✅ SEO-friendly dynamic routes (`/movies/[slug]`)  
- ✅ JSON-LD structured data (Movie schema)  
- ✅ OpenGraph meta tags for social sharing  
- ✅ Sticky header navigation  
- ✅ Search movies in real-time  
- ✅ Sort by rating & release date (ASC / DESC)  
- ✅ Genre-based horizontal carousels  
- ✅ Vertical movie browsing grid  
- ✅ Movie detail pages with:
  - Cast & crew
  - Similar movies
  - Release date, rating & language  
- ✅ Responsive design (mobile + desktop)  
- ✅ Deployed on Vercel

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (Pages Router)
- **Styling:** Tailwind CSS
- **API:** TMDB (The Movie Database)
- **SEO:** Meta tags, OpenGraph, JSON-LD
- **Deployment:** Vercel

---

## 🧠 SEO Implementation

- Dynamic `<title>` and `<meta description>`
- OpenGraph metadata for social previews
- JSON-LD Movie schema for search engines
- Clean, human-readable URLs
- Server-rendered HTML for fast indexing

---

## 📂 Project Structure

```txt
pages/
 ├── index.js              # Homepage (SSR, search, filters, UI)
 ├── movies/
 │    └── [slug].js        # Dynamic movie detail page (SSR)
 ├── _app.js
 └── _document.js

styles/
 └── globals.css

```

---
##⚙️ Environment Variables

Create a .env.local file:

```text
TMDB_BEARER_TOKEN=your_tmdb_v4_bearer_token
```

---

##▶️ Run Locally

```text
git clone https://github.com/prathishriyan/movie-seo-app.git
cd movie-seo-app
npm install
npm run dev

```
Open:
```text
http://localhost:3000
```
---
