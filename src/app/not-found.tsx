import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-bm-bg flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-[120px] font-black text-bm-fg/5 leading-none select-none">
                404
            </h1>
            <h2 className="text-2xl font-bold text-bm-fg uppercase tracking-tight -mt-4 mb-4">
                Page Not Found
            </h2>
            <p className="text-bm-muted mb-8 max-w-md">
                The page you are looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-bm-accent text-white font-bold uppercase tracking-wider rounded-bm hover:bg-bm-fg transition-colors"
            >
                Return Home
            </Link>
        </div>
    );
}
