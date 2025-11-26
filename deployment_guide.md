# Deployment Guide: Havengurt

This guide will help you deploy your React application to **Vercel** and connect it to your **Firebase** backend.

## 1. Prerequisites
- [x] Code pushed to GitHub (`https://github.com/avexrage/havengurt`)
- [x] Firebase Project set up
- [ ] Vercel Account (Create one at [vercel.com](https://vercel.com))

## 2. Deploy to Vercel
1.  **Log in** to Vercel.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"**.
4.  Find and select your `havengurt` repository.
5.  **Configure Project**:
    - **Framework Preset**: Vite (should be auto-detected).
    - **Root Directory**: `./` (default).
    - **Build Command**: `npm run build` (default).
    - **Output Directory**: `dist` (default).
6.  **Environment Variables** (Optional but recommended for security):
    - Instead of hardcoding keys in `firebase.js`, you can use `import.meta.env.VITE_FIREBASE_API_KEY`.
    - For now, since they are in the code, you can skip this.
7.  Click **"Deploy"**.

## 3. Configure Domain
1.  Once deployed, go to your Project Dashboard on Vercel.
2.  Click **"Settings"** -> **"Domains"**.
3.  Enter your desired domain (e.g., `havengurt.com`).
4.  Vercel will give you DNS records (A Record / CNAME).
5.  Go to your Domain Provider (Namecheap, GoDaddy, etc.) and add these records.

## 4. Firebase Production Settings
1.  Go to **Firebase Console** -> **Authentication** -> **Settings** -> **Authorized Domains**.
2.  Add your new Vercel domain (e.g., `havengurt.vercel.app` and `havengurt.com`) to the list.
    - *If you don't do this, Google Login will fail on the live site.*

## 5. Troubleshooting
- **"ENOSPC" Error**: If you saw this locally, it means your disk was full. Vercel builds on their servers, so it won't be an issue there.
- **White Screen**: Check the "Console" in browser dev tools for errors.
