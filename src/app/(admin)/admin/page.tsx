"use client";

import { useEffect, useState } from "react";
import {
    Users,
    TrendingUp,
    CreditCard,
    AlertTriangle,
    Clock,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownRight,
    TrendingDown
} from "lucide-react";
import { Card } from "@/components/ui-bm/card";
import { Badge } from "@/components/ui-bm/badge";
import { Button } from "@/components/ui-bm/button";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch admin stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleAction = async (subId: string, action: 'extend' | 'revoke') => {
        if (!confirm(`Are you sure you want to ${action} this subscription?`)) return;

        try {
            const res = await fetch(`/api/admin/subscriptions/${subId}/action`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            if (res.ok) {
                alert("Action successful!");
                fetchStats();
            }
        } catch (err) {
            console.error("Action failed:", err);
            alert("Something went wrong.");
        }
    };

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10 animate-pulse">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-white rounded-bm border border-bm-border shadow-soft" />
            ))}
        </div>
    );

    return (
        <div className="space-y-10">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={<Users className="w-5 h-5" />}
                    trend="+5%"
                    trendType="up"
                />
                <KpiCard
                    title="Active Subscriptions"
                    value={stats?.activeSubs || 0}
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    trend={`${stats?.expiring3d} expiring`}
                    trendType="neutral"
                />
                <KpiCard
                    title="Revenue (30d)"
                    value={`${(stats?.revenue30d || 0).toLocaleString()} UZS`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    trend={`from ${stats?.paymentsCount30d} sales`}
                    trendType="up"
                />
                <KpiCard
                    title="Expired Recently"
                    value={stats?.expiredToday || 0}
                    icon={<Clock className="w-5 h-5" />}
                    trend="Last 24h"
                    trendType="down"
                />
            </div>

            {/* Main Stats Table Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Expiring Soon */}
                <Card className="overflow-hidden">
                    <div className="p-6 border-b border-bm-border flex justify-between items-center bg-bm-surface/50">
                        <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-bm-danger" />
                            Expiring Soon (≤3 Days)
                        </h3>
                        <button className="text-[10px] text-bm-muted hover:text-bm-fg font-black uppercase tracking-widest transition-colors">View All</button>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="text-bm-muted uppercase text-[9px] tracking-widest font-black border-b border-bm-border">
                                    <th className="pb-4 px-2">User</th>
                                    <th className="pb-4 px-2">Course</th>
                                    <th className="pb-4 px-2">End Date</th>
                                    <th className="pb-4 text-right px-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-bm-border">
                                {stats?.expiringSoon?.map((sub: any) => (
                                    <tr key={sub.id} className="group hover:bg-bm-surface transition-colors">
                                        <td className="py-4 px-2">
                                            <div className="font-bold text-bm-fg">{sub.user.fullName}</div>
                                            <div className="text-[9px] text-bm-muted font-bold tracking-tighter mt-0.5">ID: {String(sub.user.telegramId)}</div>
                                        </td>
                                        <td className="py-4 px-2 text-bm-muted font-medium">{sub.product.title}</td>
                                        <td className="py-4 px-2">
                                            <Badge variant="beige" className="text-[9px]">
                                                {new Date(sub.endDate).toLocaleDateString()}
                                            </Badge>
                                        </td>
                                        <td className="py-4 text-right px-2">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    onClick={() => handleAction(sub.id, 'extend')}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-3 text-[9px] font-black uppercase"
                                                >
                                                    Extend
                                                </Button>
                                                <button
                                                    onClick={() => handleAction(sub.id, 'revoke')}
                                                    className="px-3 h-8 rounded-bm border border-bm-danger/20 text-bm-danger hover:bg-bm-danger hover:text-white text-[9px] font-black uppercase transition-all"
                                                >
                                                    Revoke
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.expiringSoon || stats.expiringSoon.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-bm-muted italic font-medium uppercase tracking-widest text-[10px]">No subscriptions expiring soon.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Recent Payments */}
                <Card className="overflow-hidden">
                    <div className="p-6 border-b border-bm-border flex justify-between items-center bg-bm-surface/50">
                        <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-bm-fg" />
                            Recent Payments
                        </h3>
                        <button className="text-[10px] text-bm-muted hover:text-bm-fg font-black uppercase tracking-widest transition-colors">View All</button>
                    </div>
                    <div className="p-6 flex items-center justify-center min-h-[300px]">
                        <p className="text-bm-muted italic font-medium uppercase tracking-widest text-[10px]">No recent transactions shown in preview.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function KpiCard({ title, value, icon, trend, trendType }: any) {
    return (
        <Card className="p-6 hover:border-bm-fg/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                {icon}
            </div>
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-bm-surface rounded-bm border border-bm-border text-bm-fg shadow-soft">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${trendType === 'up' ? 'text-bm-success' : trendType === 'down' ? 'text-bm-danger' : 'text-bm-muted'
                    }`}>
                    {trendType === 'up' && <ArrowUpRight className="w-3 h-3" />}
                    {trendType === 'down' && <TrendingDown className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-bm-muted text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
                <p className="text-2xl font-black text-bm-fg tracking-tighter">{value}</p>
            </div>
        </Card>
    );
}
