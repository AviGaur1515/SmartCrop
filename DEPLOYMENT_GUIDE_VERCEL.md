# SmartCrop Deployment Guide

This guide details the exact steps required to deploy the **Frontend** to Vercel via GitHub, and the considerations for deploying the **Backend**. 

## Part 1: Initializing GitHub Repository
Before you deploy, your code needs to live on GitHub.

1. Open a terminal (PowerShell or command prompt).
2. Navigate to your project folder:
   ```bash
   cd "c:\Users\ASUS\OneDrive\Desktop\CLG\IITGn Hackathon\FINAL"
   ```
3. Initialize the Git repository and save your first version:
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   ```
4. Link it to the empty GitHub repository you create:
   - Log into GitHub & create a **New Repository**. Do **NOT** add a README/gitignore.
   - Copy the repository URL (e.g., `https://github.com/YourUsername/smartcrop.git`).
   - Run:
     ```bash
     git remote add origin YOUR_REPOSITORY_URL_HERE
     git push -u origin main
     ```

---

## Part 2: Deploying Frontend to Vercel

Vercel is optimized for React/Vite. The process is almost entirely automatic.

1. Log in to [Vercel.com](https://vercel.com/) with your GitHub account.
2. Click **"Add New..." > "Project"**.
3. Under "Import Git Repository," find the `smartcrop` repository you just created and click **"Import"**.
4. Configure the Project:
   - **Framework Preset**: Vercel should auto-detect `Vite`. If it doesn't, select it manually.
   - **Root Directory**: Leave it at `./`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
5. Environment Variables:
   - *Skip this step for now*. When you deploy the backend somewhere on the internet later (like Render), you will add `VITE_API_URL` here pointing to the new backend address. Right now, it will default to looking for `http://localhost:5000/api`.
6. Click the big blue **"Deploy"** button.

### What happens now?
Vercel will download your code, build the React app, and give you a live URL.
*Note: The frontend will load and look beautiful, but you won't be able to log in or run an analysis purely on the internet yet, because the frontend will still be asking your local computer (`localhost:5000`) for data.*

---

## Part 3: Why Can't I Deploy the Backend on Vercel?

Your backend (`app.py`) is written in Flask and uses a **local SQLite database** (`smartcrop.db`). 

Vercel uses "Serverless Functions". This means that when someone visits your site, Vercel spins up a tiny server, runs your python code, sends a response, and **immediately destroys the server**. Because of this, any new user registrations or crop scans saved into the SQLite database file would disappear forever seconds later. 

### How to Deploy the Backend (The Right Way)
To put this effectively on the internet, you need a service that runs continuously or has a " persistent disk ". 
I highly recommend deploying the Python backend to **Render.com**.
1. Create a `Render` web service pointing to your GitHub Repo.
2. Add a `Start Command` like: `gunicorn app:app` (you will need to add `gunicorn` to your requirements.txt).
3. Connect a Persistent Disk to `/data`, so your sqlite database (`smartcrop.db`) doesn't get wiped.

If you are just presenting this for a hackathon, **it is perfectly fine to have the Frontend live on Vercel, while running the Backend locally on your laptop.** As long as you present from the laptop running the backend, it will work seamlessly!
