# Deployment Guide: Frontend on Vercel & Backend on Render

This guide explains how to deploy the **CodeVector Product Dashboard** to production.

---

## 🗺️ Deployment Overview
- **Frontend**: React + Vite (located in the `/frontend` directory) deployed on **Vercel**.
- **Backend**: Node.js + Express (located in the `/backend` directory) deployed on **Render**.
- **Database**: MongoDB Atlas.

---

## 1. 🚀 Backend Deployment (Render)

Render can deploy the backend using the Blueprint (`render.yaml`) or manually through the web dashboard. We recommend the dashboard method for easy control over environment variables.

### Option A: Manual Setup (Recommended)
1. **Sign Up / Log In** to [Render](https://render.com).
2. Click **New +** at the top right and select **Web Service**.
3. Connect your GitHub account and select your repository: `CodeVector-assignment`.
4. Configure the Web Service settings:
   - **Name**: `codevector-backend` (or any name you prefer)
   - **Region**: Select the region closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend` *(CRITICAL: do not leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or any tier)
5. Scroll down and click **Advanced** -> **Add Environment Variable**. Add the following:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `mongodb+srv://haridevoffical_db_user:KKo2ZJvybZSElDSh@codevector-ass.hbuws6f.mongodb.net/`
   - `CLIENT_URL`: `https://your-vercel-project.vercel.app` *(Leave this temporary value for now; you will update it once Vercel gives you your frontend URL)*
6. Click **Create Web Service**.
7. Render will build and start your backend. Once it is live, **copy the URL** of your Web Service (e.g., `https://codevector-backend.onrender.com`).

---

## 2. ⚡ Frontend Deployment (Vercel)

Vercel is designed for frontend frameworks like Vite. It will build and serve your frontend static files globally.

1. **Sign Up / Log In** to [Vercel](https://vercel.com).
2. Click **Add New** and select **Project**.
3. Import your repository: `CodeVector-assignment`.
4. Configure the Project settings:
   - **Project Name**: `codevector-frontend`
   - **Framework Preset**: `Vite` (Vercel should auto-detect this)
   - **Root Directory**: Click **Edit** and choose the `frontend` folder *(CRITICAL)*
5. Expand the **Build and Development Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` *(Paste the Render URL you copied in step 7 of backend deployment)*
7. Click **Deploy**.
8. Once deployment is complete, Vercel will generate a public URL (e.g., `https://codevector-frontend.vercel.app`). **Copy this URL**.

---

## 3. 🔗 Connect Frontend & Backend (Final Sync)

To allow the frontend to communicate with the backend securely under CORS (Cross-Origin Resource Sharing):

1. Go back to your **Render Dashboard**.
2. Select your `codevector-backend` Web Service.
3. Click on the **Environment** tab on the left sidebar.
4. Locate the `CLIENT_URL` environment variable.
5. Update its value from the temporary one to your actual Vercel URL (e.g., `https://codevector-frontend.vercel.app` — **without a trailing slash**).
6. Save the changes. Render will automatically redeploy your backend with the updated CORS policy.

---

## 🔍 Verification

Once both are deployed, you can verify they are working:
1. Visit your backend health check: `https://your-backend-url.onrender.com/api/health` -> should return `{"success": true, "status": "healthy"}`.
2. Visit your frontend website.
3. Open the browser console (`F12`) to confirm there are no CORS errors.
4. Try loading categories and products to verify the data is fetched correctly.
