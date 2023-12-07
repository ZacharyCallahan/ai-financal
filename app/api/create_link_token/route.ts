import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {
    Configuration,
    PlaidApi,
    PlaidEnvironments,
    Products,
    CountryCode,
} from "plaid";
import { authOptions } from "../../libs/auth";
import { getUser } from "@/app/libs/database/User";

const client = new PlaidApi(
    new Configuration({
        basePath: PlaidEnvironments.development, // Change to production as needed
        baseOptions: {
            headers: {
                "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
                "PLAID-SECRET": process.env.PLAID_SECRET!,
            },
        },
    })
);

export async function POST() {
    const { user } = await getUser();
    if (!user) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "User not found",
            }),
            { status: 401 }
        );
    }

    try {
        const createTokenResponse = await client.linkTokenCreate({
            user: {
                    client_user_id: user?.id,
            },
            client_name: "Ai-Financial",
            products: [Products.Auth],
            country_codes: [CountryCode.Us],
            language: "en",
        });

        return new NextResponse(JSON.stringify(createTokenResponse.data), {
            status: 200,
        });
    } catch (error) {
        console.error("Error creating Plaid link token:", error);
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "An error occurred while processing your request.",
            }),
            { status: 500 }
        );
        
    }
}
