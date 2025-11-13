# Anonymous Messaging Platform

A full-stack anonymous messaging web application built with Next.js 15, where users can create profiles and receive anonymous messages from others. Similar to platforms like Qooh.me or Sarahah.

## ✨ Features

- **User Authentication**: Secure sign-up and sign-in with NextAuth.js, including email-based account verification
- **Anonymous Messaging**: Send and receive anonymous messages through unique profile links (`/u/[username]`)
- **AI-Powered Suggestions**: Google Gemini AI integration generates contextual message suggestions to help users write engaging messages
- **User Dashboard**: Comprehensive dashboard to view, manage, and delete received messages
- **Message Control**: Toggle message acceptance on/off in real-time
- **Email Verification**: Automated email verification system using Resend with custom email templates
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS and shadcn/ui components
- **Form Validation**: Client and server-side validation using Zod schemas with React Hook Form

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3 (App Router), React 19.1.0, TypeScript
- **Authentication**: NextAuth.js v4 with JWT strategy
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Gemini AI SDK (@ai-sdk/google) for message suggestions
- **Email Service**: Resend for transactional emails
- **Styling**: Tailwind CSS v4, shadcn/ui components, Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Lucide React icons, Sonner for toast notifications
- **State Management**: React Hooks, NextAuth session management

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local installation or MongoDB Atlas cloud)
- Resend account and API key (for email verification)
- Google AI API key (for AI-powered message suggestions)
- NextAuth secret (generate a random secure string)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/your-database-name
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# NextAuth Configuration
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Resend API (Email Service)
RESEND_API_KEY=re_your_resend_api_key

# Google AI API (Optional - for message suggestions)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
```

**Note**: Generate a secure `NEXTAUTH_SECRET` using:
```bash
openssl rand -base64 32
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── (app)/              # Protected routes group
│   │   │   ├── dashboard/      # User dashboard page
│   │   │   ├── page.tsx        # Home page
│   │   │   └── layout.tsx      # App layout
│   │   ├── (auth)/             # Authentication routes group
│   │   │   ├── sign-in/        # Sign in page
│   │   │   ├── sign-up/        # Sign up page
│   │   │   └── verify/         # Email verification page
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # NextAuth endpoints
│   │   │   ├── signup/         # User registration
│   │   │   ├── verifyCode/     # Email verification
│   │   │   ├── send-message/   # Send anonymous message
│   │   │   ├── get-messages/   # Fetch user messages
│   │   │   ├── accept-messages/# Toggle message acceptance
│   │   │   ├── delete-message/ # Delete a message
│   │   │   ├── suggest-messages/# AI message suggestions
│   │   │   └── check_username_unique/ # Username validation
│   │   ├── u/[username]/       # Public profile pages
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── MessageCard.tsx     # Message display component
│   │   └── Navbar.tsx          # Navigation component
│   ├── context/                # React context providers
│   │   └── AuthProvider.tsx    # NextAuth provider wrapper
│   ├── lib/                    # Utility functions
│   │   ├── db.ts               # MongoDB connection
│   │   ├── resend.ts           # Resend client
│   │   └── utils.ts            # Helper utilities
│   ├── models/                 # Mongoose models
│   │   └── User.ts             # User schema
│   ├── schemas/                # Zod validation schemas
│   │   ├── signupSchema.ts
│   │   ├── signinSchema.ts
│   │   ├── MessageSchema.ts
│   │   └── acceptMessageSchema.ts
│   ├── helpers/                # Helper functions
│   │   └── sendVerificationMail.ts
│   ├── types/                  # TypeScript types
│   ├── middleware.ts           # Next.js middleware for route protection
│   └── messages.json           # Sample messages data
├── templates/                  # Email templates
│   └── verificationEmailTemplate.tsx
├── public/                     # Static assets
└── package.json
```

## 🔑 Key Features Explained

### Authentication Flow

1. **Sign Up**: User creates account with username, email, and password
2. **Email Verification**: System sends 6-digit verification code via Resend
3. **Account Activation**: User verifies account using the code (valid for 1 hour)
4. **Sign In**: Authenticated users can sign in using NextAuth credentials provider

### Messaging System

- Users receive a unique profile URL: `/u/[username]`
- Anonymous visitors can send messages without authentication
- Users can toggle message acceptance on/off from dashboard
- Messages are stored in MongoDB and displayed in user dashboard
- Users can delete individual messages

### AI Integration

- Google Gemini AI generates contextual message suggestions
- Suggestions help users write engaging, appropriate messages
- AI prompts are optimized for anonymous messaging platforms
- Suggestions are displayed as clickable buttons for quick selection

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/signup` | POST | Register new user |
| `/api/verifyCode` | POST | Verify email with code |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth endpoints |
| `/api/send-message` | POST | Send anonymous message |
| `/api/get-messages` | GET | Fetch user's messages |
| `/api/accept-messages` | GET/POST | Get/update message acceptance status |
| `/api/delete-message/[messageId]` | DELETE | Delete a message |
| `/api/suggest-messages` | POST | Get AI-generated message suggestions |
| `/api/check_username_unique` | POST | Check username availability |


```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `MONGO_URI` is correct and accessible
- Check MongoDB connection string format
- Ensure database server is running (for local MongoDB)

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for API status
- Ensure sender email is verified in Resend

### Authentication Errors
- Verify `NEXTAUTH_SECRET` is set and matches in all environments
- Check `NEXTAUTH_URL` matches your deployment URL
- Clear browser cookies if experiencing session issues

### Build Errors
- Remove `--turbopack` from build script for production
- Ensure all environment variables are set
- Check for TypeScript errors: `npm run lint`

## 📝 Available Scripts

- `npm run dev` - Start development server 






