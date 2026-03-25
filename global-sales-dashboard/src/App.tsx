import { useEffect, useState, useMemo } from 'react';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import { socket, notificationSound } from './lib/socket';
import type { Order } from './types';
import { KPICards } from './components/KPICards';
import { OrderList } from './components/OrderList';
import { SalesMap } from './components/SalesMap';
import { RevenueChart } from './components/RevenueChart';

const HOST = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("Todas");
  const [lastWhale, setLastWhale] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const cities = useMemo(() => {
    const allCities = orders.map(o => o.store.city);
    return ["Todas", ...new Set(allCities)];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (selectedCity === "Todas") return orders;
    return orders.filter(o => o.store.city === selectedCity);
  }, [orders, selectedCity]);

  const chartData = useMemo(() => [...filteredOrders].reverse(), [filteredOrders]);

  const stats = useMemo(() => {
    if (filteredOrders.length === 0) return { avg: 0, topCity: "—", topStore: "—", maxOrder: 0 };

    const total = filteredOrders.reduce((acc, o) => acc + o.amount, 0);
    const avg = total / filteredOrders.length;

    const cityTotals: { [key: string]: number } = {};
    filteredOrders.forEach(o => {
      cityTotals[o.store.city] = (cityTotals[o.store.city] || 0) + o.amount;
    });
    const topCity = Object.entries(cityTotals).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    const storeTotals: { [key: string]: number } = {};
    filteredOrders.forEach(o => {
      storeTotals[o.store.name] = (storeTotals[o.store.name] || 0) + o.amount;
    });
    const topStore = Object.entries(storeTotals).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    const maxOrder = Math.max(...filteredOrders.map(o => o.amount));

    return { avg, topCity, topStore, maxOrder };
  }, [filteredOrders]);

  useEffect(() => {
    const fetchInitialOrders = async () => {
      try {
        const response = await fetch(`${HOST}/api/orders`);
        if (!response.ok) throw new Error("Error en la red");
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (e) {
        console.error("Error al cargar pedidos iniciales:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialOrders();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    socket.on('new-order-received', (order: Order) => {
      notificationSound.play().catch(() => { });
      if (order.amount > 400) {
        setLastWhale(order);
        setTimeout(() => setLastWhale(null), 5000);
      }
      setOrders((prev) => [order, ...prev].slice(0, 20));
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new-order-received');
    };
  }, []);

  return (
    <div id="dashboard-content" className="min-h-screen bg-slate-900 text-white p-4 md:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-9999 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-[3px] border-slate-700 border-t-emerald-500 animate-spin" />
            <p className="text-slate-400 text-xs tracking-widest uppercase font-bold">Cargando datos...</p>
          </div>
        </div>
      )}

      <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            <Activity className="text-emerald-400" size={26} />
            Monitor Global de Ventas
          </h1>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <p className="text-slate-400 text-sm">{filteredOrders.length} registros en pantalla</p>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${isConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              {isConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
              {isConnected ? 'Conectado' : 'Sin señal'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 w-full lg:w-auto">
          <div className="flex flex-col w-full sm:w-48">
            <label className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">
              Filtrar Región
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-emerald-400 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer appearance-none"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <KPICards orders={filteredOrders} stats={stats} selectedCity={selectedCity} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OrderList orders={filteredOrders} />
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <SalesMap orders={filteredOrders} lastWhale={lastWhale} onCloseWhale={() => setLastWhale(null)} />
          <RevenueChart data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default App;