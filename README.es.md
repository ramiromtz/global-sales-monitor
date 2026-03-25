# 🌍 Monitor Global de Ventas - Dashboard en Tiempo Real
[🇺🇸 Read in English](./README.md)

Un dashboard de alto rendimiento para el monitoreo de ventas en tiempo real, diseñado para rastrear transacciones en múltiples sucursales. Este proyecto demuestra una arquitectura Full-Stack moderna, utilizando WebSockets para actualizaciones sin latencia y WebAssembly (WASM) para conexiones optimizadas a la base de datos.

## ✨ Características Principales
* **Flujo de Datos en Tiempo Real:** Integración fluida con Socket.io para enviar nuevos datos de ventas al cliente al instante.
* **Mapa de Calor Geoespacial:** Mapa interactivo usando Leaflet para visualizar la densidad de ventas y "zonas calientes" en todo México.
* **KPIs Dinámicos:** Cálculo en tiempo real del Ticket Promedio, Ciudad Estrella y Velocidad de Ventas (RPM).
* **Interfaz Moderna:** Estilizado completamente con el nuevo motor CSS-first de Tailwind CSS v4.

## 🛠️ Tecnologías Utilizadas

**Frontend (Cliente)**
* React 18 + TypeScript
* Vite
* Tailwind CSS v4
* Socket.io-client
* React-Leaflet & Recharts

**Backend (Servidor)**
* Node.js (v22) + Express
* Socket.io
* Prisma ORM v7 (Motor WASM)
* `@prisma/adapter-mariadb`
* MySQL / MariaDB

## 🚀 Notas de Arquitectura: Prisma 7 y WASM
Este proyecto resuelve el cambio de paradigma introducido en Prisma v7. Dado que el motor binario nativo fue reemplazado por un cliente WASM, las conexiones TCP directas ya no están soportadas por defecto.

**La Solución:** Se implementó `@prisma/adapter-mariadb` como adaptador de base de datos para manejar la capa de conexión, permitiendo que el motor ligero WASM se ejecute de manera eficiente en Node v22.

## 💻 Instalación y Uso

### Requisitos
* Node.js v22+
* Base de datos MySQL activa

### 1. Configuración del Backend
```bash
cd global-sales-monitor
npm install
# Configura tu .env con la variable DATABASE_URL
npx prisma db push
npx tsx ./prisma/seed.ts # Crea 34 sucursales en México
npx tsx src/index.ts # Inicia el servidor en el puerto 3000
```

### 2. Configuración del Frontend
```bash
cd global-sales-dashboard
npm install
npm run dev # Inicia el servidor de desarrollo de Vite
```

### 🔐 Variables de Entorno

Para que el cliente frontend se conecte correctamente al servidor de WebSockets, es indispensable configurar las variables de entorno.
Crea un archivo `.env` en la raíz del directorio `global-sales-dashboard`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

## 🗄️ Esquema de Base de Datos
La base de datos está modelada utilizando una relación de uno-a-muchos simple pero efectiva, optimizada para consultas geoespaciales rápidas y registro de eventos en tiempo real.

```prisma
model Store {
  id      Int     @id @default(autoincrement())
  name    String
  city    String
  lat     Float   // Coordenadas para el mapa de Leaflet
  lng     Float
  orders  Order[]
}

model Order {
  id        Int      @id @default(autoincrement())
  amount    Float    // Total de la venta
  createdAt DateTime @default(now())
  storeId   Int
  store     Store    @relation(fields: [storeId], references: [id])
}
```