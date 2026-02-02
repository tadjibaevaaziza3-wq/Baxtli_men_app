import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change"
);

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        // Fetch user's enrolled courses that have chat rooms
        const enrollments = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                orders: {
                    where: { status: "PAID" },
                    include: {
                        product: {
                            include: {
                                course: {
                                    include: {
                                        chatRoom: true
                                    }
                                }
                            }
                        }
                    }
                },
                subscriptions: {
                    where: { status: "ACTIVE" },
                    include: {
                        product: {
                            include: {
                                course: {
                                    include: {
                                        chatRoom: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!enrollments) return NextResponse.json({ rooms: [] });

        // Collect rooms from orders and subscriptions
        const roomsMap = new Map();

        // Admin/Trainer can see all rooms (simplified logic for now)
        if (payload.role === "ADMIN" || payload.role === "TRAINER") {
            const allRooms = await prisma.courseChatRoom.findMany({
                include: { course: true }
            });
            return NextResponse.json({
                rooms: allRooms.map(r => ({
                    id: r.id,
                    title: r.course.title,
                    type: "COURSE"
                }))
            });
        }

        enrollments.orders.forEach(order => {
            const room = order.product.course?.chatRoom;
            if (room) {
                roomsMap.set(room.id, {
                    id: room.id,
                    title: order.product.title,
                    type: "COURSE"
                });
            }
        });

        enrollments.subscriptions.forEach(sub => {
            const room = sub.product.course?.chatRoom;
            if (room) {
                roomsMap.set(room.id, {
                    id: room.id,
                    title: sub.product.title,
                    type: "COURSE"
                });
            }
        });

        return NextResponse.json({ rooms: Array.from(roomsMap.values()) });
    } catch (error) {
        console.error("Fetch rooms error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
