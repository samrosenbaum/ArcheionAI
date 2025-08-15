# Archeion AI Setup Instructions

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Anthropic Configuration (for AI document classification)
ANTHROPIC_API_KEY=your-anthropic-api-key

# Twilio Configuration (for SMS integration)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
\`\`\`

## Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Run Database Setup**
   - Execute the SQL script in `scripts/setup-database.sql`
   - This creates all necessary tables and security policies

3. **Configure Storage**
   - The script automatically creates a 'documents' storage bucket
   - Storage policies are set up for user-specific access

## Anthropic Setup

1. **Get API Key**
   - Go to [console.anthropic.com](https://console.anthropic.com)
   - Create an API key
   - Add billing information if needed

2. **Model Access**
   - Uses Claude 3.5 Sonnet for document analysis
   - Excellent at parsing complex financial documents
   - Superior OCR and document understanding capabilities

## Why Anthropic Claude?

Claude 3.5 Sonnet offers superior capabilities for financial document analysis:
- **Better OCR**: More accurate text extraction from complex documents
- **Financial Context**: Better understanding of financial terminology and concepts
- **Structured Data**: Superior at extracting structured financial data
- **Risk Assessment**: More nuanced risk analysis capabilities
- **Compliance**: Better understanding of regulatory requirements

## Twilio Setup (Optional - for SMS)

1. **Create Twilio Account**
   - Sign up at [twilio.com](https://twilio.com)
   - Get a phone number for SMS

2. **Configure Webhook**
   - Set webhook URL to: `https://your-domain.com/api/sms-webhook`
   - Configure for incoming messages

## Demo Mode

Without environment variables, the app runs in demo mode:
- ✅ Full UI functionality
- ✅ Mock data and responses  
- ✅ Photo capture simulation
- ❌ No real AI classification
- ❌ No actual document storage
- ❌ No SMS integration

## Production Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   \`\`\`bash
   npm install -g vercel
   vercel
   \`\`\`

2. **Add Environment Variables**
   - Go to Vercel dashboard
   - Add all environment variables
   - Redeploy

### Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway  
- AWS Amplify
- Self-hosted

## Security Notes

- All environment variables are properly scoped
- Supabase RLS policies protect user data
- File uploads are user-isolated
- API keys are server-side only (except Supabase public key)

## Troubleshooting

**"supabaseUrl is required" Error:**
- Check `.env.local` file exists
- Verify environment variable names match exactly
- Restart development server after adding variables

**AI Classification Not Working:**
- Verify Anthropic API key is valid
- Check you have Claude 3.5 Sonnet access
- Monitor API usage limits

**SMS Integration Issues:**
- Verify Twilio webhook URL is accessible
- Check phone number format
- Test webhook endpoint manually
