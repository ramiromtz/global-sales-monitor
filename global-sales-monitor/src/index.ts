import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" }
});

// Configuración del nuevo motor WASM de Prisma 7
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

app.use(express.json());
app.use(cors());

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Endpoint para recibir ventas
app.post('/api/orders', async (req, res) => {
    const { storeId, amount } = req.body;

    try {
        const newOrder = await prisma.order.create({
            data: {
                storeId: Number(storeId),
                amount: Number(amount)
            },
            include: { store: true }
        });

        // Emitir a todos los dashboards conectados
        io.emit('new-order-received', newOrder);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo procesar la venta" });
    }
});

// Endpoint para obtener las últimas 20 ventas
app.get("/api/orders", async (req, res) => {
    try {
        const lastOrders = await prisma.order.findMany({
            take: 20,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                store: true
            }
        });
        res.json(lastOrders);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener pedidos" });
    }
})

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Monitor de Ventas Globales corriendo en puerto ${PORT}`);
});