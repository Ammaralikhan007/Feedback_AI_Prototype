# Environment Variables Setup

## For Local Development
Create a `.env.local` file (already created) with:
```
VITE_API_BASE_URL=http://localhost:3001
```

## For Vercel Production Deployment
In your Vercel dashboard, add the environment variable:
- Key: `VITE_API_BASE_URL`
- Value: `https://api.clarity360.io`

## How it works
- Locally: Uses `http://localhost:3001` (your local backend)
- Production: Uses `https://api.clarity360.io` (your deployed backend)
- Fallback: Always defaults to `https://api.clarity360.io` if no env var is set

The app will automatically use the correct URL based on the environment.