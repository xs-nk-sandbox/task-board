"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <Link href="/boards" className="text-xl font-bold text-blue-600">
        TaskBoard
      </Link>
      {session?.user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{session.user.name}</span>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            ログアウト
          </Button>
        </div>
      )}
    </header>
  );
}
