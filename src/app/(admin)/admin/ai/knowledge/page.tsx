"use client";

import { useEffect, useState } from "react";
import {
    Database,
    Search,
    Plus,
    CheckCircle,
    Clock,
    Star,
    Filter,
    Edit3,
    Trash2,
    Languages
} from "lucide-react";

export default function AIKnowledgeAdmin() {
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDocs = async () => {
        try {
            const res = await fetch("/api/admin/ai/knowledge");
            const data = await res.json();
            setDocs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const filteredDocs = docs.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.contentText.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "GOLD": return <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold"><Star className="w-3 h-3" /> GOLD</div>;
            case "APPROVED": return <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold"><CheckCircle className="w-3 h-3" /> APPROVED</div>;
            default: return <div className="flex items-center gap-1 text-gray-400 bg-gray-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold"><Clock className="w-3 h-3" /> DRAFT</div>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Database className="w-8 h-8 text-emerald-500" />
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white">AI Knowledge Base</h1>
                        <p className="text-sm text-gray-500">{docs.length} documents total</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search KB..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95">
                        <Plus className="w-4 h-4" />
                        New Doc
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 text-center animate-pulse text-gray-500">Loading Base...</div>
                ) : filteredDocs.map((doc) => (
                    <div key={doc.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 hover:shadow-md transition-shadow group flex gap-6">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                {getStatusBadge(doc.status)}
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{doc.sourceType}</span>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <Languages className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase">{doc.language}</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-lg dark:text-zinc-100">{doc.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-3 italic leading-relaxed">
                                "{doc.contentText}"
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {doc.tags.map((t: string) => (
                                    <span key={t} className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-500 px-2 py-0.5 rounded-lg">#{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity border-l border-gray-100 dark:border-zinc-800 pl-6">
                            <button className="p-3 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-2xl hover:brightness-110 active:scale-90 transition-all">
                                <Edit3 className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 rounded-2xl hover:brightness-110 active:scale-90 transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
                {filteredDocs.length === 0 && !loading && (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-3xl text-gray-400">
                        No knowledge matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
