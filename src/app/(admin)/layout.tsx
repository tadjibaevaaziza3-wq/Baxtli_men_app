"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CreditCard,
    LogOut,
    Bell,
    ShieldCheck,
    Database,
    MessageSquare
} from "lucide-react";
import { Logo } from "@/components/ui-bm/logo";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/courses", label: "Courses", icon: BookOpen },
        { href: "/admin/payments", label: "Payments", icon: CreditCard },
        { href: "/admin/ai/knowledge", label: "Knowledge Base", icon: Database },
        { href: "/admin/ai/logs", label: "AI Logs", icon: MessageSquare },
        { href: "/admin/audit", label: "Audit Logs", icon: ShieldCheck },
    ];

    return (
        <div className="flex h-screen bg-bm-surface">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-bm-border flex flex-col">
                <div className="p-8">
                    <Logo />
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-5 py-3 rounded-bm transition-all font-bold uppercase tracking-tighter text-[11px] ${isActive
                                    ? "bg-bm-fg text-white shadow-lg shadow-bm-fg/10"
                                    : "text-bm-muted hover:bg-bm-surface hover:text-bm-fg"
                                    }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-bm-border">
                    <button className="flex items-center gap-3 w-full px-5 py-3 text-bm-danger hover:bg-bm-danger/5 rounded-bm transition-all font-bold uppercase tracking-widest text-[10px]">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-bm-border flex items-center justify-between px-10 sticky top-0 z-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-bm-muted">Administration</span>
                        <h2 className="text-xl font-black text-bm-fg uppercase tracking-tighter leading-none">
                            {navItems.find(i => i.href === pathname)?.label || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-2 text-bm-muted hover:text-bm-fg transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-bm-danger rounded-full border-2 border-white" />
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-bm-border">
                            <div className="w-10 h-10 rounded-full bg-bm-surface border border-bm-border flex items-center justify-center text-bm-fg font-black text-xs shadow-soft">
                                SP
                            </div>
                            <div className="hidden lg:flex flex-col">
                                <span className="text-xs font-black uppercase tracking-widest leading-none">Admin</span>
                                <span className="text-[10px] text-bm-muted font-bold mt-1">Sabina Polatova</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
