# CoinFusion - Bitcoin Landing Page

A modern, responsive landing page for Bitcoin/Stacks ecosystem built with Vite, React 18, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Pixel-perfect replication of the reference designs
- **Responsive**: Optimized for desktop, tablet, and mobile devices
- **Scroll Animations**: Smooth reveal animations with accessibility support
- **Interactive Components**: Horizontal scrolling carousels and metrics display
- **Performance**: Built with Vite for fast development and optimized builds
- **TypeScript**: Full type safety throughout the application
- **Accessibility**: Respects user motion preferences

## 🛠 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **Language**: TypeScript
- **Fonts**: Inter (Google Fonts)

## 📋 Prerequisites

- Node.js ≥ 18.0.0
- npm or yarn package manager

## 🏃‍♂️ Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
/
├── index.html              # Vite entry point
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Main application component
│   ├── index.css          # Global styles and Tailwind imports
│   ├── components/        # React components
│   │   ├── Header.tsx     # Navigation header
│   │   ├── Hero.tsx       # Hero section with main CTA
│   │   ├── EcosystemNews.tsx # Horizontal scrolling news
│   │   ├── Metrics.tsx    # Stacking metrics display
│   │   ├── FeatureCarousel.tsx # Feature cards carousel
│   │   ├── DeveloperSection.tsx # Developer-focused content
│   │   ├── Footer.tsx     # Simple footer
│   │   └── Button.tsx     # Reusable button component
│   ├── hooks/
│   │   └── useScrollReveal.ts # Scroll animation hook
│   ├── assets/            # SVG icons and illustrations
│   │   ├── bitcoin.svg
│   │   ├── padlock.svg
│   │   ├── phone.svg
│   │   └── card-badge.svg
│   └── types.d.ts         # TypeScript type definitions
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🎨 Design System

### Colors
- **Primary**: `#635BFF` (Electric Purple)
- **Primary Dark**: `#5246E0`
- **Warning**: `#FFCA1B` (Golden Yellow)
- **Gray 900**: `#1A1A1A`
- **Gray 500**: `#8C94A3`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Hero Text**: Fluid scaling from 96px (desktop) to 38px (mobile)

### Components
- **Border Radius**: Custom `xlTop` (48px 48px 0 0) for hero section
- **Animations**: Smooth scroll reveals with `prefers-reduced-motion` support
- **Responsive**: Mobile-first approach with lg/md/sm breakpoints

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Key Features Implementation

1. **Scroll Reveal Animations**: Uses Intersection Observer API with accessibility considerations
2. **Horizontal Scrolling**: Implemented with CSS scroll-snap for smooth navigation
3. **Responsive Design**: Mobile-first approach with Tailwind breakpoints
4. **Custom Icons**: SVG illustrations for Bitcoin, security, and device mockups

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: ≥ 1024px

## ♿ Accessibility

- Respects `prefers-reduced-motion` user setting
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- High contrast color ratios

## 🚀 Deployment

The built application is a static site that can be deployed to any static hosting service:

- Vercel
- Netlify  
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

## 📄 License

This project is created for demonstration purposes.

---

**CoinFusion** - Unleash Bitcoin's full potential through modern web experiences. 