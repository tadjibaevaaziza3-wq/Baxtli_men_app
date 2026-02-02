import Script from "next/script";

export default function TMALayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-md mx-auto shadow-2xl min-h-screen relative overflow-hidden bg-bm-bg">
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="beforeInteractive"
            />
            {children}
        </div>
    );
}
