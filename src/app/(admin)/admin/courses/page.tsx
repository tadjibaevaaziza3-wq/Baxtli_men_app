"use client";

import { useEffect, useState } from "react";
import { Plus, Book, FileText, Video, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui-bm/button";
import { Badge } from "@/components/ui-bm/badge";
import { Card } from "@/components/ui-bm/card";

export default function CoursesAdmin() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/admin/courses");
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <Badge variant="beige">Content Management</Badge>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-bm-fg">Courses & Products</h1>
                </div>
                <Button variant="primary" className="shadow-lg shadow-bm-fg/10 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Course
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((p) => (
                    <Card key={p.id} className="group overflow-hidden flex flex-col hover:border-bm-fg/30 transition-all border-bm-border shadow-soft">
                        <div className="h-44 bg-bm-surface relative overflow-hidden">
                            {p.course?.coverImageUrl ? (
                                <img src={p.course.coverImageUrl} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-bm-border">
                                    <Book className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button className="p-2 bg-white/90 backdrop-blur-md rounded-bm text-bm-danger hover:bg-bm-danger hover:text-white transition-all shadow-soft border border-bm-border">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col space-y-4">
                            <div>
                                <Badge variant="outline" className="mb-2">{p.type}</Badge>
                                <h3 className="text-lg font-black uppercase tracking-tight text-bm-fg">{p.title}</h3>
                                <p className="text-xs font-bold text-bm-muted mt-1 tracking-widest uppercase">{p.priceUzs.toLocaleString()} UZS</p>
                            </div>

                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-bm-muted">
                                <div className="flex items-center gap-1.5">
                                    <Video className="w-3 h-3" />
                                    {p.course?.modules?.reduce((acc: any, m: any) => acc + m.lessons.length, 0) || 0} Lessons
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FileText className="w-3 h-3" />
                                    0 Docs
                                </div>
                            </div>

                            <div className="pt-4 mt-auto border-t border-bm-border flex justify-between items-center">
                                <button className="text-xs font-black uppercase tracking-widest text-bm-fg hover:underline">Manage Content</button>
                                <button className="p-2 text-bm-muted hover:text-bm-fg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
