# B&B Shoes - Technical Stack Documentation

B&B Shoes is a premium, high-performance e-commerce web application. This document provides a complete guide to all the programming languages, runtime environments, frameworks, databases, third-party APIs, and utility packages used in this project, complete with definitions and their roles.

---

## 1. Core Languages
These are the foundational languages used to write the codebase.

### TypeScript (`.ts`, `.tsx`)
* **Definition**: TypeScript is a strongly typed, open-source programming language built on top of JavaScript. It adds static type definitions to Javascript, allowing developers to catch code errors during development rather than at runtime.
* **Role in B&B Shoes**: It is the primary language used across the entire application (both frontend and backend APIs). It provides strict interfaces for product catalogs, cart items, order configurations, and database model types, ensuring safe development.

### JavaScript (`.js`)
* **Definition**: JavaScript is a lightweight, interpreted, compiled scripting language with first-class functions. It is the language of the web, responsible for dynamic behavior on web pages.
* **Role in B&B Shoes**: Used mainly for standalone scripting, automation tasks, database seed scripts (e.g., `backfill-user-id.js`), and configuration files.

### HTML (HyperText Markup Language)
* **Definition**: HTML is the standard markup language used to structure web pages and define the elements (like buttons, sections, inputs).
* **Role in B&B Shoes**: Used implicitly inside React components through **JSX/TSX** syntax to structure the layout of the storefront.

### CSS & Tailwind CSS (`.css`)
* **Definition**: CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation and layout of a document. **Tailwind CSS** is a utility-first CSS framework that provides low-level utility classes to build custom designs directly in HTML.
* **Role in B&B Shoes**: Vanilla CSS handles global variables, ambient layouts, and background shadows (in `src/app/globals.css`). Tailwind CSS classes style interactive buttons, grids, hover highlights, margins, and the luxury-brand appearance.

### JSON (JavaScript Object Notation)
* **Definition**: JSON is a lightweight, text-based data-interchange format. It is easy for humans to read and write, and easy for machines to parse.
* **Role in B&B Shoes**: Used for configurations (e.g., `package.json`, `tsconfig.json`) and standard API data transmissions between the Next.js frontend and backend.

---

## 2. Core Runtimes & Frameworks

### Node.js (v20.x+)
* **Definition**: Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside of a web browser (on the server).
* **Role in B&B Shoes**: Serves as the server-side runtime environment for compiling, building, and running the Next.js server, loading environment configurations, and executing local scripts.

### Next.js 14+ (App Router)
* **Definition**: Next.js is a powerful React meta-framework created by Vercel that enables server-side rendering (SSR), static site generation (SSG), and incremental static regeneration (ISR) for React applications. It features file-system routing.
* **Role in B&B Shoes**: Serves as the primary framework of the project. It hosts the page routes (using Next.js App Router under `/src/app`) and serverless backend API endpoints (under `/src/app/api`).

### React 18
* **Definition**: React is a popular open-source JavaScript library created by Meta for building user interfaces based on reusable UI components.
* **Role in B&B Shoes**: Powers the entire storefront interface, managing client states (like cart additions, checkout forms, and user profile sessions) through React Hooks (`useState`, `useEffect`, `useMemo`, `useContext`).

---

## 3. Database & Object Data Modeling (ODM)

### MongoDB & MongoDB Atlas
* **Definition**: MongoDB is a document-oriented NoSQL database that stores data in JSON-like documents with dynamic schemas. MongoDB Atlas is a fully managed cloud database service hosting MongoDB clusters.
* **Role in B&B Shoes**: Serves as the primary database storing the B&B Shoes datasets:
  - Users, Products, Categories, and Brands.
  - Customer Orders, Address books, Carts, and Wishlists.
  - Verification OTPs, Support tickets, Faqs, and Newsletter subscribers.

### Mongoose
* **Definition**: Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model application data, handles type casting, schema validations, and queries.
* **Role in B&B Shoes**: Located in `src/models/`, Mongoose defines the schemas and structures for database documents (like validating that review comments do not exceed 200 characters and orders include correct product sub-items).

---

## 4. Key Integrations & APIs

### NextAuth.js
* **Definition**: NextAuth.js is a complete open-source authentication solution for Next.js applications, supporting passwords, email/credentials authentication, and OAuth login providers.
* **Role in B&B Shoes**: Manages user authentication sessions. It supports standard username/password logins and Google OAuth login (Google Sign-In) with secure session storage.

### Nodemailer & SMTP Mailer
* **Definition**: Nodemailer is a module for Node.js applications to allow easy email sending using SMTP (Simple Mail Transfer Protocol) servers.
* **Role in B&B Shoes**: Handles email dispatch for the OTP verification system (`src/lib/email-service.ts`). It connects securely to Gmail SMTP with App Passwords to email customers their registration and login OTPs.

### Cloudinary & Next-Cloudinary
* **Definition**: Cloudinary is a cloud-based service that provides an end-to-end image and video management solution including uploads, storage, manipulations, and optimization.
* **Role in B&B Shoes**: Hosts product images. The admin portal uploads shoe images to Cloudinary via serverless endpoints, and the storefront fetches these optimized images dynamically.

### Meta WhatsApp Cloud API
* **Definition**: The Meta WhatsApp API allows businesses to programmaticly send text templates, media, and interactive notifications to customers over WhatsApp.
* **Role in B&B Shoes**: Located in `src/app/api/whatsapp/route.ts` and `src/lib/whatsapp.ts`, it automatically triggers real-time WhatsApp alert templates to the store manager or customer upon successful order placement.

### Leaflet.js
* **Definition**: Leaflet is a leading open-source JavaScript library for mobile-friendly interactive maps.
* **Role in B&B Shoes**: Powering the Order Tracking screen (`/track-order/[id]`), Leaflet.js renders a premium dark map (`CartoDB Dark Matter`), geolocates shipping coordinates based on the customer's delivery city, and animates a cargo delivery vehicle moving along the route.

---

## 5. Main Libraries & Utility Packages

### Framer Motion
* **Definition**: Framer Motion is a production-ready motion and animation library for React that simplifies building complex spring-physics animations and layout transitions.
* **Role in B&B Shoes**: Powers the luxury storefront experience, including:
  - Slide-in animations for the mobile sidebar navigation.
  - Hover glow transitions for products and banner buttons.
  - Soft tooltips and popup cards for the floating socials widget.

### Lucide React
* **Definition**: Lucide is a community-run fork of Feather Icons, offering a rich collection of clean, pixel-perfect minimalist vector SVG icons for React.
* **Role in B&B Shoes**: Used for storefront iconography (like the shopping bag icon, rating stars, search bars, user profiles, and heart-shaped wishlist buttons).

### Bcryptjs
* **Definition**: A library used to securely hash and salt passwords, protecting user credentials in the database against security breaches.
* **Role in B&B Shoes**: Hashes password entries before saving them in the `User` schema database collection.

### JSON Web Tokens (`jsonwebtoken`)
* **Definition**: An open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.
* **Role in B&B Shoes**: Generates tokens for secure operations (like password resets and account actions).
