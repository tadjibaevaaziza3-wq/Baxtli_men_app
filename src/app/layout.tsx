import type { Metadata } from "next";
import { Inter, Allura } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/analytics/google-analytics";
import YandexMetrica from "@/components/analytics/yandex-metrica";
import MetaPixel from "@/components/analytics/meta-pixel";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const allura = Allura({ subsets: ["latin"], weight: "400", variable: "--font-allura" });

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://baxtli-men.uz'),
    title: {
        default: "Baxtli Men — Yoga & Yogaterapiya | Sabina Polatova",
        template: "%s | Baxtli Men"
    },
    description: "Online va Offline yoga kurslari, sog'lom tana va baxtli hayot sari yo'lingiz. Sabina Polatova bilan professional yogaterapiya.",
    keywords: ["yoga", "yogaterapiya", "Sabina Polatova", "Baxtli Men", "sog'lom hayot", "ayollar yogasi"],
    authors: [{ name: "Sabina Polatova" }],
    creator: "Sabina Polatova",
    publisher: "Baxtli Men",
    alternates: {
        canonical: '/',
        languages: {
            'uz-UZ': '/uz',
            'ru-RU': '/ru',
        },
    },
    openGraph: {
        type: "website",
        locale: "uz_UZ",
        url: "https://baxtli-men.uz",
        siteName: "Baxtli Men",
        images: [
            {
                url: "/brand/logo-original.png", // Need to ensure this exists or use a generic OG image
                width: 1200,
                height: 630,
                alt: "Baxtli Men Branding",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Baxtli Men — Yoga & Yogaterapiya",
        description: "Sog'lom tana va baxtli hayot sari yo'lingiz.",
        images: ["/brand/logo-original.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uz">
            <body className={`${inter.className} ${allura.variable}`}>
                {children}
                <GoogleAnalytics />
                <YandexMetrica />
                <MetaPixel />
            </body>
        </html>
    );
}
