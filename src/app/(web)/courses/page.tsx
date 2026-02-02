import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui-bm/card";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
    const products = await prisma.product.findMany({
        where: { isPublished: true, isDeleted: false },
        include: { course: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-black uppercase text-bm-fg mb-2 tracking-tighter">
                Available Courses
            </h1>
            <p className="text-bm-muted mb-12 max-w-2xl text-lg">
                Explore our exclusive programs designed for your physical and mental well-being.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <Card key={product.id} className="p-6 flex flex-col hover:shadow-lg transition-all group border-2 border-transparent hover:border-bm-fg/10">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-bm-fg mb-2 line-clamp-2">
                                {product.title}
                            </h3>
                            <p className="text-bm-muted text-sm line-clamp-3 mb-4">
                                {product.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs font-bold text-bm-muted uppercase tracking-widest mb-6">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {product.durationDays} Days
                                </span>
                                <span className="w-px h-3 bg-bm-border"></span>
                                <span>{product.type.replace("ONLINE_", "").replace("_package", "")}</span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-black text-bm-fg">
                                    {new Intl.NumberFormat('uz-UZ').format(product.priceUzs)} UZS
                                </span>
                                <Link
                                    href={`/courses/${product.id}`}
                                    className="w-10 h-10 rounded-full bg-bm-accent text-white flex items-center justify-center group-hover:scale-110 transition-transform"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20 bg-bm-surface rounded-bm border border-bm-border">
                    <p className="text-bm-muted font-medium">No courses available at the moment.</p>
                </div>
            )}
        </div>
    );
}
