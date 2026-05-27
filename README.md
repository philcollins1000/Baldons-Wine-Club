# Baldons Wine Club Website

A clean, responsive website for the Baldons Wine Club. Hosted free on GitHub Pages.
Events and wine recommendations are managed via a Google Sheet — no coding required.

---

## 🚀 Deploying to GitHub Pages (one-time setup)

### Step 1 — Put the logo in the right place
Save the club logo image as `images/logo.png` inside the `website/` folder.

### Step 2 — Create a GitHub repository
1. Go to [github.com](https://github.com) and log in as **philcollins1000**
2. Click **New repository** (top right, green button)
3. Name it: `baldons-wine-club`
4. Make it **Public**
5. Leave everything else blank — click **Create repository**

### Step 3 — Upload the files
1. On the new repository page, click **uploading an existing file**
2. Drag the entire contents of the `website/` folder into the upload area
   - Include all HTML files, the `css/`, `js/`, and `images/` folders
3. Scroll down, write "Initial site upload" as the commit message
4. Click **Commit changes**

### Step 4 — Enable GitHub Pages
1. Go to repository **Settings** → **Pages** (left sidebar)
2. Under **Branch**, select `main` and folder `/` (root)
3. Click **Save**
4. Wait ~60 seconds — your site will be live at:
   **`https://philcollins1000.github.io/baldons-wine-club/`**

### Step 5 (Optional) — Custom domain
If you have a domain (e.g. `baldonswinecclub.co.uk`):
1. Go to Settings → Pages → Custom domain
2. Enter your domain and save
3. Add a CNAME DNS record pointing to `philcollins1000.github.io`

---

## 📊 Connecting Google Sheets (for live events & wines)

### Step 1 — Create the spreadsheet
Make a Google Sheet with **two tabs**: `Events` and `Wines`

**Events tab columns:**
| Date | Title | Venue | Description | Type |
|------|-------|-------|-------------|------|
| 14 Jun 2026 | Summer Rosé Evening | The Seven Stars | Brief description | Tasting |

Type must be one of: `Tasting`, `Social`, `Trip`

**Wines tab columns:**
| Name | Region | Grape | Year | Rating | Price | BuyLink | Notes |
|------|--------|-------|------|--------|-------|---------|-------|
| Château Example | Bordeaux, France | Cabernet Sauvignon | 2020 | ★★★★☆ | £22 | https://... | Tasting notes here |

### Step 2 — Publish the sheet
1. In Google Sheets: **File → Share → Publish to web**
2. Choose **Entire Document** and **CSV format**
3. Click **Publish** and confirm

### Step 3 — Get the Sheet ID
Copy the long ID from your sheet's URL:
`https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

### Step 4 — Add it to the site
Open `js/config.js` and replace `YOUR_GOOGLE_SHEET_ID_HERE` with your Sheet ID.

Then re-upload `js/config.js` to GitHub (drag it to the file on GitHub → click the pencil to edit → paste → commit, or just upload the updated file).

---

## 🔐 Changing the Members Password

1. Go to [sha256 hash generator](https://emn178.github.io/online-tools/sha256.html)
2. Type your new password in lowercase (e.g. `baldons2026`)
3. Copy the hash it generates
4. Open `js/config.js` and replace the `MEMBERS_PASSWORD_HASH` value
5. Re-upload `js/config.js` to GitHub

---

## ✏️ Updating content

| What | How |
|------|-----|
| Events | Update the Google Sheet |
| Wine recommendations | Update the Google Sheet |
| Committee bios | Edit `committee.html` — find the name and replace the Lorem Ipsum text |
| Members deals | Edit `members.html` — find the deals cards section |
| Membership fee | Edit `join.html` — find `£XX` and replace |
| Club email address | Edit `js/config.js` — change `CLUB_EMAIL` |
| Gallery photos | Drop images into `images/` folder, add `<img>` tags in `gallery.html` |

---

## 📁 File Structure

```
website/
├── index.html          ← Landing page
├── committee.html      ← Committee & Wine Educator bios
├── events.html         ← Events list (reads from Google Sheet)
├── wines.html          ← Wine library (reads from Google Sheet)
├── members.html        ← Password-protected members area
├── join.html           ← Join us / contact form
├── gallery.html        ← Photo gallery
├── css/
│   └── style.css       ← All styles (colours, layout, typography)
├── js/
│   ├── config.js       ← ⭐ Edit this to configure the site
│   └── main.js         ← Site logic (don't need to edit this)
└── images/
    └── logo.png        ← ⭐ Add your logo here
```
