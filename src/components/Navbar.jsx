"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">Villain Hub</div>
      <ul className="nav-links">
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <Link href="/leaderboard">Leaderboard</Link>
        </li>
        <li>
          <Link href="/deeds">Deed Log</Link>
        </li>
      </ul>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  );
}
