import Link from "next/link";
import { getUsersSession } from "../libs/database/User";
import Logout from "./buttons/Logout";

const Nav = async () => {
    const { user } = await getUsersSession();

    return (
        <nav className="bg-gray-200 fixed top-0 w-full">
            <ul className="flex m-auto container justify-between items-center text-xl text-gray-800 p-6">
                <li className="hover:scale-105 transition-all">
                    <Link
                        className="bg-blue-200 rounded-md p-2 shadow-md"
                        href="/">
                        Home
                    </Link>
                </li>
                <li className="hover:scale-105 transition-all">
                    <Link
                        className="bg-blue-200 rounded-md p-2 shadow-md "
                        href="/budget">
                        Budget
                    </Link>
                </li>
                <li className="hover:scale-105 transition-all">
                    {user ? (
                        <Logout />
                    ) : (
                        <Link
                            className="bg-blue-200 rounded-md p-2 shadow-md"
                            href="/login">
                            Login
                        </Link>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
