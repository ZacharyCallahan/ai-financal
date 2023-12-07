import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../libs/prisma";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();
        const hashed_password = await hash(password, 12);


        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: hashed_password,
            },
        });
        console.log(user);

        return NextResponse.json({
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error: any) {
        console.error("Error from register route:", error);
        // Check for unique constraint error
        if (error.code === "P2002") {
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: "A user with that email already exists.",
                }),
                { status: 400 }
            );
        }
        // Handle other types of errors
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: "An error occurred while processing your request.",
            }),
            { status: 500 }
        );
    }
}
