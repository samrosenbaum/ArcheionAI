# Archeion AI - Financial Document Management

A modern, AI-powered financial document management system built with Next.js, Supabase, and Claude AI.

## 🚀 Features

- **AI Document Analysis**: Automatic categorization and insights using Claude AI
- **Photo Capture**: Mobile-optimized document capture with camera integration
- **SMS Integration**: Upload documents via SMS with Twilio
- **Smart Categorization**: Automatic document classification and tagging
- **Financial Insights**: AI-generated recommendations for tax optimization, insurance gaps, and more
- **Secure Storage**: Supabase-powered document storage with encryption
- **Mobile First**: Responsive design optimized for mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **AI**: Anthropic Claude AI
- **SMS**: Twilio
- **Authentication**: Supabase Auth

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Anthropic API key
- Twilio account (optional, for SMS features)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd archeion
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services
ANTHROPIC_API_KEY=your_anthropic_api_key

# SMS/Twilio Integration (optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Run the database setup script:

```bash
# Copy the SQL from scripts/setup-database.sql
# Run it in your Supabase SQL editor
```

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Create documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'uploading' CHECK (status IN ('uploading', 'processing', 'analyzed', 'error')),
  insights_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document insights table
CREATE TABLE document_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  change_percentage DECIMAL,
  confidence INTEGER NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  category TEXT NOT NULL,
  potential_savings DECIMAL,
  recommendation TEXT NOT NULL,
  next_steps TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  document_count INTEGER DEFAULT 0,
  total_value DECIMAL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | No |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | No |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | No |

### Supabase Storage Buckets

Create a `documents` bucket in Supabase Storage with the following policy:

```sql
-- Allow authenticated users to upload documents
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Allow users to view their own documents
CREATE POLICY "Users can view their documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 📱 Mobile Optimization

The app is optimized for mobile devices with:

- Touch-friendly interfaces
- Camera integration for document capture
- Responsive design
- Mobile-specific navigation
- SMS document upload support

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- Environment variable protection
- Input validation with Zod
- Error handling without information leakage
- Secure file uploads

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📊 Health Checks

The application includes a health check endpoint at `/api/health` that monitors:

- Database connectivity
- AI service availability
- SMS service configuration
- Overall application status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Check the [issues](https://github.com/your-username/archeion/issues) page
- Create a new issue for bugs or feature requests
- Review the documentation in the `docs/` folder

## 🔄 Changelog

### v0.1.0
- Initial release
- Basic document management
- AI-powered insights
- Mobile-optimized interface
- SMS integration
- Supabase backend
