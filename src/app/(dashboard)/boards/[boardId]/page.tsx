"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ListContainer } from "@/components/list/list-container";
import Link from "next/link";

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  const [boardTitle, setBoardTitle] = useState("");

  useEffect(() => {
    const fetchBoard = async () => {
      const res = await fetch(`/api/boards/${boardId}`);
      if (res.ok) {
        const board = await res.json();
        setBoardTitle(board.title);
      }
    };
    fetchBoard();
  }, [boardId]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/boards"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← ボード一覧
        </Link>
        <h1 className="text-xl font-bold">{boardTitle}</h1>
      </div>
      <ListContainer boardId={boardId} />
    </div>
  );
}
