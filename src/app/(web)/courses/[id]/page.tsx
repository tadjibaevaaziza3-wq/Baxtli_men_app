import { Metadata, ResolvingMetadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';
// We will create a shared detail component or just implement a clean public view here
import { Logo } from '@/components/ui-bm/logo';
import { Badge } from '@/components/ui-bm/badge';
import { Button } from '@/components/ui-bm/button';
import { Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const product = await (prisma as any).product.findUnique({
        where: { id },
        include: { course: true }
    });

    if (!product) return { title: 'Product Not Found' };

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${product.title} — ${product.type.replace('_', ' ')} | Baxtli Men`,
        description: product.description.substring(0, 160),
        openGraph: {
            title: product.title,
            description: product.description.substring(0, 160),
            url: `https://baxtli-men.uz/courses/${product.id}`,
            images: product.course?.coverImageUrl
                ? [product.course.coverImageUrl, ...previousImages]
                : previousImages,
        },
    };
}

export default async function PublicCoursePage({ params }: Props) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            course: {
                include: {
                    modules: {
                        include: { lessons: true }
                    }
                }
            }
        }
    });

    if (!product) notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: product.title,
        description: product.description,
        provider: {
            '@type': 'Organization',
            name: 'Baxtli Men',
            sameAs: 'https://baxtli-men.uz',
        },
        offers: {
            '@type': 'Offer',
            price: product.priceUzs,
            priceCurrency: 'UZS',
            availability: 'https://schema.org/InStock',
        },
        educationalLevel: 'Beginner/Intermediate',
    };

    return (
        <div className="min-h-screen bg-white text-bm-fg">
            <JsonLd data={jsonLd} />

            {/* Mini Nav */}
            <nav className="px-10 py-6 border-b border-bm-border flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <Link href="/"><Logo /></Link>
                <Link href="/"><Button variant="outline" size="sm">Barcha kurslar</Button></Link>
            </nav>

            <main className="max-w-7xl mx-auto px-10 py-20 flex flex-col md:flex-row gap-20">
                {/* Left: Info */}
                <div className="flex-[3] space-y-10">
                    <div className="space-y-6">
                        <Badge variant="beige">{product.type.replace('_', ' ')}</Badge>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight">
                            {product.title}
                        </h1>
                        <p className="bm-signature text-3xl text-bm-muted -mt-4">by Sabina Polatova</p>
                    </div>

                    <div className="prose prose-lg text-bm-muted font-light leading-relaxed max-w-2xl">
                        {product.description}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-bm-border">
                        <StatItem icon={<Clock className="w-5 h-5" />} label="Davomiyligi" value={`${product.durationDays} Kun`} />
                        <StatItem icon={<Users className="w-5 h-5" />} label="O'quvchilar" value="1,200+" />
                        <StatItem icon={<CheckCircle className="w-5 h-5" />} label="Kirish" value="Umrbod" />
                        <StatItem icon={<ArrowRight className="w-5 h-5" />} label="Format" value="Online/Video" />
                    </div>

                    {/* Curriculum Preview (Locked for Public SEO) */}
                    <div className="pt-20 space-y-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Kurs dasturi</h2>
                        <div className="space-y-4">
                            {product.course?.modules.map((module: any, i: number) => (
                                <div key={module.id} className="p-6 bg-bm-surface rounded-bm border border-bm-border flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-black text-bm-muted">{i + 1}</span>
                                        <span className="font-bold uppercase tracking-tight">{module.title}</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-bm-muted">
                                        {module.lessons.length} Dars
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar / CTA */}
                <div className="flex-[2] md:sticky md:top-32 h-fit space-y-8">
                    <div className="p-10 bg-bm-surface rounded-bm border border-bm-border shadow-soft flex flex-col gap-8">
                        <div className="text-center space-y-2">
                            <p className="text-xs font-black uppercase tracking-widest text-bm-muted">Kurs Narxi</p>
                            <h2 className="text-4xl font-black tracking-tighter">
                                {product.priceUzs.toLocaleString()} <span className="text-lg font-normal text-bm-muted uppercase">UZS</span>
                            </h2>
                        </div>
                        <Button variant="primary" size="lg" className="w-full shadow-2xl shadow-bm-fg/20 px-10">
                            Kursni Boshlash
                        </Button>
                        <p className="text-[10px] text-bm-muted text-center italic font-bold uppercase tracking-widest leading-relaxed">
                            * To'lovdan so'ng darhol Telegram Mini App'da kursga kirish huquqiga ega bo'lasiz.
                        </p>
                    </div>

                    <div className="p-8 border border-bm-border rounded-bm flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden grayscale border border-bm-border">
                            <img src="/brand/logo-original.png" className="w-full h-auto" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest">Sabina Polatova</p>
                            <p className="text-[10px] text-bm-muted font-bold uppercase tracking-widest">Yogaterapevt & Mentor</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatItem({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-bm-muted">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-xl font-black uppercase tracking-tight">{value}</p>
        </div>
    );
}
