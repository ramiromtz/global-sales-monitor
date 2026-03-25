import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Order } from '../types';

interface RevenueChartProps {
    data: Order[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl flex flex-col" style={{ height: '260px' }}>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2 shrink-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                <TrendingUp size={14} className="text-emerald-400" /> Tendencia de Ingresos
            </h2>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="id" hide />
                        <YAxis
                            tickFormatter={(v) => `$${v}`}
                            tick={{ fill: '#475569', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                            axisLine={false}
                            tickLine={false}
                            width={56}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontFamily: "'DM Sans', sans-serif" }}
                            itemStyle={{ color: '#10b981' }}
                            labelStyle={{ display: 'none' }}
                            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Venta']}
                        />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            dot={false}
                            animationDuration={800}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
