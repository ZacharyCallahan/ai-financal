import { getUser } from "@/app/libs/database/User";
import { NextRequest, NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { encrypt } from "../../libs/cryptoUtils";
import { prisma } from "../../libs/prisma";

const client = new PlaidApi(
    new Configuration({
        basePath: PlaidEnvironments.development, // Change to development
        baseOptions: {
            headers: {
                "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
                "PLAID-SECRET": process.env.PLAID_SECRET,
            },
        },
    })
);

export async function POST(req: NextRequest) {
    const { user } = await getUser();
    try {
        if (!user)
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 401 }
            );

        const body = await req.text();
        const { publicToken } = JSON.parse(body);
        const response = await client.itemPublicTokenExchange({
            public_token: publicToken,
        });
        const { access_token } = response.data;
        const encryptedAccessToken = encrypt(access_token);
        const updatedUser = await prisma.user.update({
            where: {
                email: user.email,
            },
            data: {
                accessToken: encryptedAccessToken,
            },
        });
        return NextResponse.json({
            access_token,
            user: updatedUser,
        });
    } catch (error) {
        // Handle other types of errors
        console.error("Error from plaid route:", error);

        return NextResponse.json(
            {
                success: false,
                message: "An error occurred while processing your request.",
            },
            { status: 500 }
        );
    }
}
