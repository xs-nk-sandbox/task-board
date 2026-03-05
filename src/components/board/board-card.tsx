"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Board {
  id: string;
  title: string;
  createdAt: string;
}

interface BoardCardProps {
  board: Board;
  onDelete: (id: string) => void;
}

export function BoardCard({ board, onDelete }: BoardCardProps) {
  return (
    <div className="group relative rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/boards/${board.id}`} className="block">
        <h3 className="font-semibold text-gray-900 truncate">{board.title}</h3>
        <p className="mt-1 text-xs text-gray-400">
          {new Date(board.createdAt).toLocaleDateString("ja-JP")}
        </p>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600"
        onClick={(e) => {
          e.preventDefault();
          if (confirm("このボードを削除しますか？")) {
            onDelete(board.id);
          }
        }}
      >
        ✕
      </Button>
    </div>
  );
}
