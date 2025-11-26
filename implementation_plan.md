# Production Deployment & Backend Migration Plan

## Goal
Deploy the Havengurt application to a public server and upgrade the data storage to a real backend so orders and user accounts work across different devices.

## User Review Required
> [!IMPORTANT]
> **Current Limitation**: The current "Database" uses **LocalStorage**. This means if a customer orders on their phone, **YOU WILL NOT SEE IT** on your admin laptop.
> **Solution**: We MUST migrate to a real cloud database like **Firebase** or **Supabase** before launching for real customers.

## Proposed Changes

### 1. Backend Migration (Firebase)
I recommend **Firebase** (by Google) as it's free for small apps, fast, and easy to integrate.

#### [NEW] `src/services/firebase.js`
- Initialize Firebase App.
- Replace `db.js` logic to read/write from **Firestore**.
- Replace `auth.js` logic to use **Firebase Auth** (handles Google Login natively).

#### [MODIFY] `src/services/db.js` & `src/services/auth.js`
- Refactor these to use the new `firebase.js` methods instead of `localStorage`.

### 2. Hosting & Domain
I recommend **Vercel** or **Netlify**.
- **Cost**: Free for starter tier.
- **Ease**: Connects to GitHub. Updates automatically when you push code.
- **Domain**: You can buy `havengurt.com` (or similar) directly through them or via Namecheap/GoDaddy and connect it.

## Deployment Steps
1.  **Migrate Data**: Switch from LocalStorage to Firebase.
2.  **Push to GitHub**: Upload your code to a GitHub repository.
3.  **Connect to Vercel**: Import the repo on Vercel.
4.  **Launch**: Vercel gives you a URL (e.g., `havengurt.vercel.app`).
5.  **Domain**: Buy your custom domain and add it to Vercel.

## Verification Plan
1.  **Build**: Ensure `npm run build` passes (Already checking).
2.  **Data Sync**: Open the app in two different browsers (e.g., Chrome and Edge). Register on one, see if login works on the other. Place order on one, see if Admin Dashboard on the other updates.
