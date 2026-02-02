
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

    console.log("Trainer profile ensured.");

    const products = [
        // 1. Online Course: Tana Yogaterapiyasi (Men)
        {
            title: "Тана йогатерапияси — Стандарт (для мужчин)",
            description: "Эркаклар учун махсус курс: 5 та йога машқлар, нафас олиш усуллари. Эндокрин тизим, простата ва бел оғриқлари учун.",
            priceUzs: 300000,
            type: ProductType.ONLINE_COURSE,
            durationDays: 30, // Assuming 1 month access based on context
            course: {
                create: {
                    title: "Тана йогатерапияси (Эркаклар)",
                    description: "Эркаклар саломатлиги учун махсус дастур.",
                    chatRoom: { create: {} }
                }
            }
        },
        // 2. Subscription: Baxtli Ayollar Klubi - Standart
        {
            title: "Бахтли аёллар клуби — Стандарт пакет (для женщин)",
            description: "1380+ дарсликлар. Гормонал йога, аёллик энергияси, лимфодренаж, бўғимлар учун.",
            priceUzs: 100000,
            type: ProductType.ONLINE_SUBSCRIPTION,
            durationDays: 30,
        },
        // 3. Subscription: Baxtli Ayollar Klubi - Premium
        {
            title: "Бахтли аёллар клуби — Премиум пакет (для женщин)",
            description: "Барча Стандарт имкониятлари + 24/7 кураторлик, индивидуал консультация, ҳар ой видеочат.",
            priceUzs: 200000,
            type: ProductType.ONLINE_SUBSCRIPTION,
            durationDays: 30,
        },
        // 4. Course: Tabiiy Yosharish (Face Yoga)
        {
            title: "ТАБИЙ ЁШАРИШ (ЮЗ ЙОГАСИ) — 3в1 (для женщин)",
            description: "Юз машқлари (15 дарс), Осанка (30 машқ), Тейпирование. 1 Zoom учрашув.",
            priceUzs: 300000,
            type: ProductType.ONLINE_COURSE,
            durationDays: 90, // Lifetime access imply long duration, setting 90 for now or handling logic elsewhere
            course: {
                create: {
                    title: "Табиий Ёшариш",
                    description: "Юз ва тана гўзаллиги учун комплекс.",
                    chatRoom: { create: {} }
                }
            }
        },
        // 5. Consultation: Online 1 Session
        {
            title: "Психологик консультация (аёллар учун) — 1 онлайн сессия",
            description: "90% амалиёт. Вазиятни таҳлил қилиш, онг ости билан ишлаш. 1 соат (биринчиси 1.5 соат).",
            priceUzs: 1000000,
            type: ProductType.CONSULTATION,
            durationDays: 1, // Consumed immediately
        },
        // 6. Consultation: Offline 1 Session
        {
            title: "Психологик консультация (аёллар учун) — 1 жонли офлайн сессия",
            description: "Жонли учрашув. 90% амалиёт. Вазиятни таҳлил қилиш. 1 соат (биринчиси 1.5 соат).",
            priceUzs: 2000000,
            type: ProductType.CONSULTATION,
            durationDays: 1,
        },
        // 7. Offline: Sophie Fit Zone
        {
            title: "Sophie Fit Zone: 12 уроков (для женщин)",
            description: "Офлайн машғулотлар. Чорсу, Беруний 12В. Сешанба, Пайшанба, Шанба (10:00, 11:15).",
            priceUzs: 800000,
            type: ProductType.OFFLINE_PACKAGE,
            durationDays: 30, // 12 lessons usually for a month
        },
        // 8. Offline: Fit-Dance
        {
            title: "Fit-Dance: 12 уроков (для женщин)",
            description: "Офлайн рақс-фитнес. Дархон, Аккурган 18А. Сешанба, Пайшанба, Шанба (13:00).",
            priceUzs: 1500000,
            type: ProductType.OFFLINE_PACKAGE,
            durationDays: 30,
        },
        // 9. Offline: DoYogaStudios
        {
            title: "DoYogaStudios: 8 уроков (для женщин)",
            description: "Махтумкули к-си, 45. Душанба, Чоршанба, Жума (10:00, 11:30).",
            priceUzs: 1600000,
            type: ProductType.OFFLINE_PACKAGE,
            durationDays: 30,
        }
    ];

    for (const p of products) {
        // Upsert based on title to avoid duplicates
        const existing = await prisma.product.findFirst({
            where: { title: p.title }
        });

        if (existing) {
            console.log(`Updating ${p.title}...`);
            await prisma.product.update({
                where: { id: existing.id },
                data: {
                    description: p.description,
                    priceUzs: p.priceUzs,
                    type: p.type,
                    durationDays: p.durationDays,
                    isPublished: true
                }
            });
        } else {
            console.log(`Creating ${p.title}...`);
            const { course, ...productData } = p;

            await prisma.product.create({
                data: {
                    ...productData,
                    isPublished: true,
                    course: course ? { create: course.create } : undefined
                }
            });
        }
    }

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
