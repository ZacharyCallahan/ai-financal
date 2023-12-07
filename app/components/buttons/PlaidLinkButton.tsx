'use client'
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import {
    usePlaidLink,
    PlaidLinkOptions,
    PlaidLinkOnSuccess,
} from "react-plaid-link";

const PlaidLinkButton = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const createLinkToken = async () => {
            const response = await fetch("/api/create_link_token", {
                method: "POST",
            });
            const data = await response.json();
            setToken(data.link_token);
        };

        createLinkToken();
    }, []);

    const onSuccess: PlaidLinkOnSuccess = useCallback(
        async (publicToken, metadata) => {
            // Send the publicToken to your server to exchange it for an access token
            try {
                const response = await axios.post("/api/plaid", {
                    publicToken,
                });
                // Handle success scenario
                console.log("Success:", response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Error:", error.response?.data);
                } else {
                    console.error("Error:", error);
                }
            }
        },
        []
    );

    const config: PlaidLinkOptions = {
        token: token ?? "", // Replace with the link_token you receive from your server
        onSuccess,
        // Add other configurations as needed
    };

    const { open, ready } = usePlaidLink(config);

    return (
        <button className="bg-green-200 rounded-md p-4 shadow-md hover:scale-105 transition-all" onClick={() => open()} disabled={!ready || !token}>
            Connect a bank account
        </button>
    );
};

export default PlaidLinkButton;
