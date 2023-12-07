import { PrismaClient } from "@prisma/client";

// Define a type for the custom global
type CustomNodeJsGlobal = typeof globalThis & {
    prisma?: PrismaClient;
};

// Declare your custom global variable
declare const global: CustomNodeJsGlobal;

export const prisma =
    global.prisma ||
    new PrismaClient({
        log: ["query", "error", "warn", "info"],
    });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
