import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { prisma } from "../prisma";

export const getUsersSession = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user)
            return { success: false, message: "User not found" };

        return { success: true, user: session.user };
    } catch (error) {
        console.error("Error from getting users session:", error);
        return {
            success: false,
            message: "An error occured while getting the users sesson",
        };
    }
};

const getUserFromDB = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user
            ? { success: true, user }
            : { success: false, message: "User not found" };
    } catch (error) {
        console.error("Error from getting user from DB:", error);
        return {
            success: false,
            message:
                "An error occured while getting the user from the database",
        };
    }
};

export const getUser = async () => {
    const session = await getUsersSession();
    if (!session.success || !session.user || !session.user.email)
        return { user: null, error: session.message };
    const userFromDB = await getUserFromDB(session.user.email);
    return userFromDB.success
        ? { user: userFromDB.user, error: null }
        : { user: null, error: userFromDB.message };
};

export const saveUsersAssistant = async (assistantId: string, id: string) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                assistantId: assistantId,
            },
        });

        return {
            success: true,
            user: updatedUser,
            message: "Assistant created successfully",
        };
    } catch (error) {
        console.error("Error from saving users assistant:", error);
        return { success: false, message: "An error occured" };
    }
};
