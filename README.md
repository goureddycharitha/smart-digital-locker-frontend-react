# Smart Digital Locker - Frontend (React + Vite)

Modern single-page document vault application built with React 18, React Router DOM, and custom modular glassmorphism CSS.

## Tech Stack
- **Framework:** React 18 / 19
- **Build Tool:** Vite 8
- **Routing:** React Router DOM
- **HTTP Client:** Fetch API with centralized JWT authentication interceptors
- **Icons & Typography:** Google Font Inter & SVG Icon System

## Environment Variables
Configure the backend API URL in `.env` (refer to `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

In production (e.g. Render), set `VITE_API_BASE_URL` to your deployed backend URL:
```env
VITE_API_BASE_URL=https://smart-digital-locker-backend-spring.onrender.com/api
```

## Available Scripts

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```
