import axios from 'axios';

const HOST = process.env.API_URL || 'http://localhost:3000';

const stores = Array.from({ length: 34 }, (_, i) => i + 1);

console.log("Iniciando simulador de ventas...");

setInterval(async () => {
  const randomStore = stores[Math.floor(Math.random() * stores.length)];
  const randomAmount = parseFloat((Math.random() * (500 - 10) + 10).toFixed(2));

  try {
    await axios.post(`${HOST}/api/orders`, {
      storeId: randomStore,
      amount: randomAmount
    });
    console.log(`✔ Venta simulada: $${randomAmount} en tienda #${randomStore}`);
  } catch (error) {
    console.error("Error en el simulador");
  }
}, 5000); // Una venta cada 3 segundos