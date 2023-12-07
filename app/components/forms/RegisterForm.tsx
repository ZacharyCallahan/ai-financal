"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
type FormValues = {
    name: string;
    email: string;
    password: string;
};

export const RegisterForm = () => {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState<FormValues>({
        name: "",
        email:  "",
        password: "",
    });
    const [error, setError] = useState("");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setFormValues({ name: "", email: "", password: "" });

        try {
            await axios.post(
                "/api/register",
                formValues
            ); 
            setLoading(false)
            signIn(undefined, { callbackUrl: "/" });
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                // Handle Axios-specific error
                setError(
                    error.response?.data.message ||
                        "An error occurred during registration"
                );
            } else if (error instanceof Error) {
                // Handle generic errors
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    return (
        <form onSubmit={onSubmit}>
            {error && (
                <p className="text-center bg-red-300 py-4 mb-6 rounded">
                    {error}
                </p>
            )}
            <div className="mb-6">
                <input
                    required
                    type="name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    placeholder="Name"
                />
            </div>
            <div className="mb-6">
                <input
                    required
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    placeholder="Email address"
                />
            </div>
            <div className="mb-6">
                <input
                    required
                    type="password"
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
            </div>
            <button
                type="submit"
                style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }}
                disabled={loading}>
                {loading ? "loading..." : "Sign Up"}
            </button>
            <span>
                Already have an account?{" "}
                <Link className="text-blue-300" href={"/login"}>
                    Login
                </Link>
            </span>
        </form>
    );
};
