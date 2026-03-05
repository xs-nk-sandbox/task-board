"use client";

import { useState, useEffect } from "react";
import { BoardCard } from "./board-card";
import { CreateBoardDialog } from "./create-board-dialog";
import { Button } from "@/components/ui/button";

interface Board {
  id: string;
  title: string;
  createdAt: string;
}

export function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const fetchBoards = async () => {
    const res = await fetch("/api/boards");
    if (res.ok) {
      const data = await res.json();
      setBoards(data);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/boards/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBoards((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">ボード一覧</h1>
        <Button onClick={() => setShowCreate(true)}>新規ボード</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} onDelete={handleDelete} />
        ))}
        {boards.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-12">
            ボードがありません。新規ボードを作成してください。
          </p>
        )}
      </div>
      <CreateBoardDialog
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(board) => {
          setBoards((prev) => [board, ...prev]);
          setShowCreate(false);
        }}
      />
    </div>
  );
}
