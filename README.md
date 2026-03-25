# 🌍 Global Sales Monitor - Real-Time Dashboard
[🇪🇸 Leer en Español](./README.es.md)

A high-performance, real-time sales monitoring dashboard built to track transactions across multiple branches. This project demonstrates a modern full-stack architecture, leveraging WebSockets for zero-latency updates and WebAssembly (WASM) for optimized database connections.

## ✨ Key Features
* **Real-Time Data Flow:** Seamless integration with Socket.io to push new sales data to the client instantly.
* **Geospatial Heatmap:** Interactive map using Leaflet and `leaflet.heat` to visualize sales density and "hot zones" across Mexico.
* **Dynamic KPIs:** Real-time calculation of Average Ticket, Top-Performing City, and Sales Velocity (RPM).
* **Modern UI:** Styled entirely with the new CSS-first engine of Tailwind CSS v4.

## 🛠️ Tech Stack

**Frontend (Client)**
* React 18 + TypeScript
* Vite (Bundler)
* Tailwind CSS v4
* Socket.io-client
* React-Leaflet & Recharts

**Backend (Server)**
* Node.js (v22) + Express
* Socket.io (WebSocket Server)
* Prisma ORM v7 (WASM Engine)
* `@prisma/adapter-mariadb` (TCP Driver Adapter)
* MySQL / MariaDB

## 🚀 Architecture Insights: Prisma 7 & WASM
Under the hood, this project addresses the architectural shift introduced in Prisma v7. Since the native binary engine was replaced by a WASM client, direct TCP connections are no longer supported out-of-the-box. 

**The Workaround:** Implemented `@prisma/adapter-mariadb` as the driver adapter to handle the database connection layer, allowing the lightweight WASM engine to run efficiently on Node v22.

## 💻 Getting Started

### Prerequisites
* Node.js v22+
* MySQL database running

### 1. Backend Setup
```bash
cd global-sales-monitor
npm install
# Configure your .env with DATABASE_URL
npx prisma db push
npx tsx ./prisma/seed.ts # Seeds 34 branches across Mexico
npx tsx src/index.ts # Starts the server on port 3000
```

### 2. Frontend Setup
```bash
cd global-sales-dashboard
npm install
npm run dev # Starts the Vite dev server
```

### 🔐 Environment Variables

For the frontend client to successfully connect to the WebSocket server, you must configure the local environment variables.
Create a `.env` file in the root of the `global-sales-dashboard` directory:

```env
VITE_BACKEND_URL=http://localhost:3000
```

## 🗄️ Database Schema
The database is modeled using a simple but effective one-to-many relationship, optimized for fast geospatial querying and real-time event logging.

```prisma
model Store {
  id      Int     @id @default(autoincrement())
  name    String
  city    String
  lat     Float   // Geospatial data for Leaflet heatmap
  lng     Float
  orders  Order[]
}

model Order {
  id        Int      @id @default(autoincrement())
  amount    Float    // Order total
  createdAt DateTime @default(now())
  storeId   Int
  store     Store    @relation(fields: [storeId], references: [id])
}
```