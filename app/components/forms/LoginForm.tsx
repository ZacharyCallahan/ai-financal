"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

type FormValues = {
    email: string;
    password: string;
};

type SignInResponse = {
    error?: string;
    url?: string;
    status?: number;
    ok?: boolean;
}

export const LoginForm = () => {
    const router = useRouter();
    const [formValues, setFormValues] = useState<FormValues>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            setFormValues({ email: "", password: "" });

            const res = (await signIn("credentials", {
                redirect: false,
                email: formValues.email,
                password: formValues.password,
                callbackUrl,
            })) as SignInResponse;

            setLoading(false);

            if (!res?.error) {
                router.push(callbackUrl);
            } else {
                setError("Invalid email or password");
            }
        } catch (error) {
            setLoading(false);
            if (error instanceof Error) {
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
            <button type="submit" disabled={loading}>
                {loading ? "loading..." : "Sign In"}
            </button>

            <p className="text-center font-semibold mx-4 mb-0">OR</p>

            <span>
                Don{"'"}t have an account?{" "}
                <Link className="text-blue-300" href={"/register"}>
                    Register
                </Link>
            </span>
        </form>
    );
};
