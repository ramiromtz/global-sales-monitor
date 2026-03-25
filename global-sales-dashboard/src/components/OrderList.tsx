import { ShoppingCart, MapPin } from 'lucide-react';
import type { Order } from '../types';
import { formatTime } from '../utils/format';

interface OrderListProps {
    orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-175 flex flex-col">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2 shrink-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                <ShoppingCart size={17} className="text-emerald-400" /> Actividad Reciente
            </h2>
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                {orders.map((order) => {
                    const isWhale = order.amount > 400;
                    return (
                        <div
                            key={order.id}
                            className={`p-3 rounded-xl border-l-4 animate-in fade-in slide-in-from-left duration-500 transition-colors cursor-default
                ${isWhale
                                    ? 'bg-orange-500/10 border-orange-500 hover:bg-orange-500/15'
                                    : 'bg-slate-700/30 border-emerald-500 hover:bg-slate-700/50'}`}
                        >
                            <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0">
                                    <p className="font-bold text-sm truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
                                        {order.store.name}
                                    </p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                        <MapPin size={10} className="shrink-0" /> {order.store.city}
                                    </p>
                                    <p className="text-[10px] text-slate-600 mt-0.5">{formatTime(order.createdAt)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <p
                                        className={`font-bold text-sm ${isWhale ? 'text-orange-400' : 'text-white'}`}
                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                    >
                                        ${order.amount.toFixed(2)}
                                    </p>
                                    {isWhale
                                        ? <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-black tracking-tight">🐋 Whale</span>
                                        : <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-black tracking-tight uppercase">Live</span>
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}
                {orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="h-7 w-7 rounded-full border-[3px] border-slate-700 border-t-emerald-500 animate-spin" />
                        <p className="text-slate-500 text-sm">Esperando datos...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
