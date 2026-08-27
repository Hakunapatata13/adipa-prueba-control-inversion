"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Control de Gasto" },
  { href: "/latam", label: "Inversión LATAM" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white border-b border-lila-claro">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <span className="text-2xl font-extrabold tracking-tight">
          <span className="text-morado">ADI</span>
          <span className="text-celeste">PA</span>
        </span>
        <nav className="flex gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active
                    ? "bg-morado text-white"
                    : "bg-lila-claro/60 text-marino hover:bg-lila-claro"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
