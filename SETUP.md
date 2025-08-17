# Archeion Setup Instructions

## 1. Supabase Project Setup

### Create New Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in and click "New Project"
3. Choose your organization
4. Enter project name: `archeion-ai`
5. Enter database password (save this securely)
6. Choose region closest to you
7. Click "Create new project"

### Get Project Credentials
1. Once project is created, go to Settings → API
2. Copy the `Project URL` (looks like: `https://mdzfyiecigbmfusaxmoy.supabase.co`)
3. Copy the `anon public` key (starts with `eyJ...`)

### Update Environment Variables
1. Copy `.env.local` to your project root
2. Update these values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

## 2. Database Setup

### Run SQL Script
1. In your Supabase project, go to SQL Editor
2. Copy the contents of `scripts/setup-database.sql`
3. Paste and run the script
4. This creates:
   - `documents` table
   - `document_insights` table  
   - `categories` table
   - Storage bucket for files
   - Row Level Security policies

### Verify Setup
1. Go to Table Editor → check if tables exist
2. Go to Storage → check if `documents` bucket exists
3. Go to Authentication → Settings → URL Configuration
4. Add these URLs to "Site URL" and "Redirect URLs":
   - `http://localhost:3000`
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/login`
   - `http://localhost:3000/onboarding`

## 3. Local Development

### Install Dependencies
```bash
pnpm install
```

### Start Development Server
```bash
pnpm dev
```

### Test Upload Functionality
1. Go to `http://localhost:3000/upload`
2. Try uploading a small PDF or image file
3. Check browser console for debug logs
4. Check Supabase Storage and Tables for uploaded files

## 4. Troubleshooting

### Upload Not Working
- Check browser console for errors
- Verify environment variables are correct
- Ensure database tables exist
- Check if storage bucket exists
- Verify RLS policies are enabled

### Common Issues
- **"Storage bucket not found"**: Run the SQL setup script
- **"Table doesn't exist"**: Run the SQL setup script  
- **"Unauthorized"**: Check environment variables
- **"File too large"**: Files must be under 50MB

## 5. Next Steps

Once upload is working:
1. Test document categorization
2. Implement AI analysis
3. Add alert system
4. Build mobile app (PWA)

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify Supabase project settings
3. Check environment variables
4. Ensure database setup is complete
