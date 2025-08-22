# Survey App

A modern, full-featured survey application built with Next.js 15, featuring role-based access control, real-time results with charts, and a beautiful glassmorphism UI.

## ✨ Features

- **🔐 Authentication & Authorization**
  - NextAuth.js with credentials provider
  - OAuth support (Google, GitHub)
  - Role-based access control (Coordinator/Respondent)
  - Protected routes with middleware

- **📊 Survey Management**
  - Create, edit, and delete surveys
  - 1-10 questions per survey
  - 1-5 options per question
  - Open/close survey status
  - Draft saving with localStorage

- **📝 Survey Taking**
  - Interactive survey interface
  - One response per user per survey
  - Form validation with Zod
  - Responsive design

- **📈 Results & Analytics**
  - Tabulated response counts
  - Interactive charts with Recharts
  - Real-time data updates

- **🎨 Modern UI/UX**
  - Glassmorphism design
  - Dark/light theme toggle
  - Micro-animations
  - Responsive layout
  - Tailwind CSS

- **🔍 Advanced Features**
  - Search and pagination
  - Admin dashboard
  - Toast notifications
  - Client-side state management

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, CSS Variables
- **State**: Zustand, React Hook Form
- **Validation**: Zod
- **Database**: Prisma, SQLite
- **Authentication**: NextAuth.js 4
- **Charts**: Recharts
- **UI**: Custom components with glassmorphism

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd surveyJS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your `.env` file:
   ```env
   # Database
   DATABASE_URL=file:./prisma/dev.db
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-here
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_ID=your-github-client-id
   GITHUB_SECRET=your-github-client-secret
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Default Accounts

After seeding, you can use these demo accounts:

- **Coordinator**: `coordinator@example.com` / `password123`
- **Respondent**: `respondent@example.com` / `password123`

## 📱 Usage

### For Coordinators

1. **Login** with coordinator account
2. **Create Survey** at `/surveys/new`
3. **Manage Surveys** at `/admin`
4. **Edit Surveys** by clicking "Редактировать" in admin
5. **Open/Close** surveys as needed

### For Respondents

1. **Login** with respondent account
2. **Browse Surveys** at `/surveys`
3. **Take Surveys** by clicking "Пройти"
4. **View Results** for closed surveys

### Survey Creation

1. Enter survey title
2. Add 1-10 questions
3. Add 1-5 options per question
4. Save as draft (auto-saved)
5. Publish when ready

## 🌐 OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

### GitHub OAuth

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Secret to `.env`

## 🎨 Customization

### Themes

The app supports light and dark themes. Toggle using the theme button in the header.

### Styling

- Modify `src/app/globals.css` for global styles
- Update Tailwind config for design tokens
- Customize glassmorphism effects

### Localization

- Add new languages in `src/lib/i18n.ts`
- Update translation keys as needed

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── login/             # Authentication
│   ├── surveys/           # Survey pages
│   └── layout.tsx         # Root layout
├── components/             # Reusable components
├── lib/                   # Utilities and configs
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- Recharts for the beautiful chart components

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Contact the maintainers

---

**Happy Surveying! 🎉**
