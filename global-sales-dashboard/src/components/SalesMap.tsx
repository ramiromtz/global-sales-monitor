import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Zap, X } from 'lucide-react';
import { HeatmapLayer } from './HeatmapLayer';
import { customIcon } from '../lib/socket';
import type { Order } from '../types';

interface SalesMapProps {
    orders: Order[];
    lastWhale: Order | null;
    onCloseWhale: () => void;
}

export function SalesMap({ orders, lastWhale, onCloseWhale }: SalesMapProps) {
    const heatPoints = useMemo(() => {
        return orders.map(o => [o.store.lat, o.store.lng, o.amount / 500] as [number, number, number]);
    }, [orders]);

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden h-105 relative shadow-2xl">
            <div className="absolute top-4 left-4 z-1000 bg-slate-900/90 p-2 px-4 rounded-full border border-slate-700 backdrop-blur-md shadow-lg">
                <p className="text-[10px] font-black flex items-center gap-2 tracking-widest">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    MAPA DE INTENSIDAD (MÉXICO)
                </p>
            </div>

            <MapContainer
                center={[23.6345, -102.5528]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                />
                <HeatmapLayer points={heatPoints} />
                {orders.map((order) => (
                    <Marker key={order.id} position={[order.store.lat, order.store.lng]} icon={customIcon}>
                        <Popup>
                            <div className="p-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                <p className="font-bold border-b border-slate-200 pb-1 mb-1 text-slate-900">{order.store.name}</p>
                                <p className="text-xs text-slate-500 mb-1">{order.store.city}</p>
                                <p className="text-base font-mono font-bold text-emerald-600">${order.amount.toFixed(2)}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {lastWhale && (
                <div
                    className="absolute bottom-5 right-5 z-1000 bg-slate-900/95 border border-orange-500/40 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3"
                    style={{ animation: 'slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
                >
                    <div className="p-2 bg-orange-500/15 rounded-xl shrink-0">
                        <Zap size={20} className="text-orange-400 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-wider text-orange-400 mb-0.5">Venta Mayor</p>
                        <p className="text-xl font-black leading-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            ${lastWhale.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{lastWhale.store.name} · {lastWhale.store.city}</p>
                    </div>
                    <button
                        onClick={onCloseWhale}
                        className="ml-1 p-1.5 text-slate-600 hover:text-white hover:bg-slate-700 rounded-lg transition-colors shrink-0"
                        aria-label="Cerrar alerta"
                    >
                        <X size={13} />
                    </button>
                </div>
            )}
        </div>
    );
}
