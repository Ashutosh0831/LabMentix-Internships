import Link from "next/link";


export default function Navbar() {
return (
<nav className="w-full p-4 bg-black text-white flex justify-between">
<h1 className="text-xl font-bold">Yatree</h1>
<div className="flex gap-4">
<Link href="/login">Login</Link>
<Link href="/register">Register</Link>
</div>
</nav>
);
}