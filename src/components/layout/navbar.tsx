// src/components/layout/navbar.tsx
import AuthButton from "../user/user-button";
import Link from "next/link";

export function Header() {
  return (
    <header className="top-0 z-20 mx-auto flex w-full items-center justify-between p-5 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          className="flex items-center rounded-full p-1 my-2 justify-start gap-2 group/sidebar transition-all"
          href="/"
        >
          <img src="/logo.png" className="rounded-lg w-6 h-6" alt="Logo" />
          <p className="text-sm font-bold transition duration-150 whitespace-pre inline-block !p-0 !m-0">
            Cash Clips
          </p>
        </Link>
        <div className="z-[10]">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
