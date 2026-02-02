"use client";

import { useEffect, useState } from "react";
import { MessageSquare, ThumbsUp, ThumbsDown, User, Info, Calendar } from "lucide-react";

export default function AIChatLogsAdmin() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/admin/ai/logs");
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-emerald-500" />
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Conversation Audit</h1>
                    <p className="text-sm text-gray-500">Transcripts of AI interactions</p>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 text-center animate-pulse text-gray-500">Loading Audit Logs...</div>
                ) : logs.map((log) => (
                    <div key={log.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col md:flex-row">
                        {/* Metadata Sidebar */}
                        <div className="w-full md:w-64 bg-gray-50 dark:bg-zinc-800/50 p-6 border-r border-gray-100 dark:border-zinc-800 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 uppercase font-black font-bold">User</p>
                                <div className="flex items-center gap-2 text-xs font-bold dark:text-zinc-200">
                                    <User className="w-3 h-3 text-emerald-500" />
                                    {log.user.fullName}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 uppercase font-black font-bold">Feedback</p>
                                <div className="flex items-center gap-2">
                                    {log.feedback === 1 ? <ThumbsUp className="w-4 h-4 text-emerald-500" /> : log.feedback === -1 ? <ThumbsDown className="w-4 h-4 text-red-500" /> : <p className="text-xs italic text-gray-400">None</p>}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 uppercase font-black font-bold">Date</p>
                                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(log.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 space-y-6">
                            <div className="space-y-2">
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">Question</span>
                                <p className="text-sm font-bold dark:text-white leading-relaxed">{log.question}</p>
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase">AI Answer</span>
                                <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed italic">"{log.answer}"</p>
                            </div>

                            {log.sourcesJson && log.sourcesJson.length > 0 && (
                                <div className="pt-4 border-t border-gray-50 dark:border-zinc-800 flex flex-wrap gap-2">
                                    {log.sourcesJson.map((s: any) => (
                                        <div key={s.id} className="flex items-center gap-1 text-[9px] bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 px-2 py-1 rounded-lg">
                                            <Info className="w-2.5 h-2.5" />
                                            {s.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
