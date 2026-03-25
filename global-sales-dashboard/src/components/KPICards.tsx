import { DollarSign, TrendingUp, Trophy, Zap } from 'lucide-react';
import type { Order } from '../types';

interface Stats {
    avg: number;
    topCity: string;
    topStore: string;
    maxOrder: number;
}

interface KPICardsProps {
    orders: Order[];
    stats: Stats;
    selectedCity: string;
}

export function KPICards({ orders, stats, selectedCity }: KPICardsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            <div className="bg-slate-800/40 border border-slate-700 hover:border-emerald-500/40 p-5 rounded-2xl backdrop-blur-sm transition-colors duration-200 group">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                        <DollarSign size={13} className="text-emerald-400" />
                    </div>
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Ingresos</p>
                </div>
                <p className="text-2xl text-emerald-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    ${orders.reduce((acc, o) => acc + o.amount, 0).toFixed(2)}
                </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700 hover:border-sky-500/40 p-5 rounded-2xl backdrop-blur-sm transition-colors duration-200 group">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-sky-500/10 rounded-lg group-hover:bg-sky-500/20 transition-colors">
                        <TrendingUp size={13} className="text-sky-400" />
                    </div>
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Ticket Prom.</p>
                </div>
                <p className="text-2xl text-sky-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    ${stats.avg.toFixed(2)}
                </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700 hover:border-orange-500/40 p-5 rounded-2xl backdrop-blur-sm transition-colors duration-200 group">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                        <Trophy size={13} className="text-orange-400" />
                    </div>
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">
                        {selectedCity === "Todas" ? "Ciudad Líder" : "Tienda Líder"}
                    </p>
                </div>
                <p className="text-base font-bold text-orange-400 truncate leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {selectedCity === "Todas" ? stats.topCity : stats.topStore}
                </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700 hover:border-purple-500/40 p-5 rounded-2xl backdrop-blur-sm transition-colors duration-200 group">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                        <Zap size={13} className="text-purple-400" />
                    </div>
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Venta Máxima</p>
                </div>
                <p className="text-2xl text-purple-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    ${stats.maxOrder.toFixed(2)}
                </p>
            </div>

        </div>
    );
}
