import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, UserSource, ProductType } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Start seeding...");

    // 1. Create Trainer Profile (Sabina Polatova)
    const sabina = await prisma.user.upsert({
        where: { username: "sabina_yoga" },
        update: {},
        create: {
            username: "sabina_yoga",
            fullName: "Sabina Polatova",
            role: Role.TRAINER,
            source: UserSource.WEB,
            trainerProfile: {
                create: {
                    bio: "Йога терапевти, психолог. Сизга соғлом тана ва бахтли ҳаёт сари йўл кўрсатаман.",
                    avatarUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uploaded_media_1770008999382-7YOn0e6N3X9hQ7N4S5U1R2E3T.png",
                    socials: { telegram: "@Sabina_Polatova" }
                }
            }
        }
    });

    // 2. Online Course: Tana Yogaterapiyasi (Men)
    await prisma.product.create({
        data: {
            title: "Тана йогатерапияси — Стандарт (Эркаклар учун)",
            description: "Эркаклар касалликларига даъво, либидо кўтарилади, нерв тизимини тиклайди...",
            priceUzs: 300000,
            type: ProductType.ONLINE_COURSE,
            durationDays: 30,
            isPublished: true,
            course: {
                create: {
                    title: "Тана йогатерапияси",
                    description: "5 та йога машқлар ва нафас олиш усуллари",
                    chatRoom: { create: {} }
                }
            }
        }
    });

    // 3. Subscription: Baxtli Ayollar Klubi - Standart
    await prisma.product.create({
        data: {
            title: "Бахтли аёллар клуби — Стандарт пакет",
            description: "Гормонал йога, аёллик энергиясини оширувчи, хайз куни йогаси...",
            priceUzs: 100000,
            type: ProductType.ONLINE_SUBSCRIPTION,
            durationDays: 30,
            isPublished: true
        }
    });

    // 4. Subscription: Baxtli Ayollar Klubi - Premium
    await prisma.product.create({
        data: {
            title: "Бахтли аёллар клуби — Премиум пакет",
            description: "Ҳар кун йога, янги дарслар, чатда индивидуал консультация...",
            priceUzs: 200000,
            type: ProductType.ONLINE_SUBSCRIPTION,
            durationDays: 30,
            isPublished: true
        }
    });

    // 5. Course: Tabiiy Yosharish (Yuz Yogasi)
    await prisma.product.create({
        data: {
            title: "ТАБИЙ ЁШАРИШ (ЮЗ ЙОГАСИ) — 3в1",
            description: "15 дарс юз машқлари, 30та машқ осанка ва тос учун, тейпирование...",
            priceUzs: 300000,
            type: ProductType.ONLINE_COURSE,
            durationDays: 90,
            isPublished: true,
            course: {
                create: {
                    title: "Табиий Ёшариш",
                    description: "Юз машқлари ва гўзаллик сирлари",
                    chatRoom: { create: {} }
                }
            }
        }
    });

    // 6. Consultation: Online
    await prisma.product.create({
        data: {
            title: "Психологик консультация (аёллар учун) — онлайн 1 сессия",
            description: "90% психологик техника, анализ ситуации, 1 практика + домашние практики...",
            priceUzs: 1000000,
            type: ProductType.CONSULTATION,
            isPublished: true
        }
    });

    // 7. Offline: Sophie Fit Zone
    await prisma.product.create({
        data: {
            title: "Sophie Fit Zone: 12 уроков (аёллар учун)",
            description: "Сешанба • Пайшанба • Шанба. ЧОРСУ, Беруний 12В...",
            priceUzs: 800000,
            type: ProductType.OFFLINE_PACKAGE,
            isPublished: true
        }
    });

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
