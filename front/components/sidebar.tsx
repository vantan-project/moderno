import Image from "next/image";
import Link from "next/link";

export function Sidebar() {
    return (
        <header className="w-60 fixed top-0 left-0 h-screen flex flex-col items-center py-6">
            <Link href="/">
                <Image src="/logo.svg" alt="logo" width={200} height={0} />
            </Link>
        </header>
    )
}
