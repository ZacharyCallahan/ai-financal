import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import { authOptions } from "../../libs/auth";

const client = new PlaidApi(new Configuration({
    basePath: PlaidEnvironments.development, // Change to production as needed
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
}));

export async function POST(req) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    
    try {

        const createTokenResponse = await client.linkTokenCreate({
            user: {
                client_user_id: userId, 
            },
            client_name: 'Ai-Financial',
            products: [Products.Auth],
            country_codes: [CountryCode.Us], 
            language: 'en',
        });

        return NextResponse.json(createTokenResponse.data);
    } catch (error) {
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
