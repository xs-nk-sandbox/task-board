"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ListData {
  id: string;
  title: string;
  position: number;
  boardId: string;
  cards: CardData[];
}

interface CardData {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  position: number;
  listId: string;
}

interface CreateListFormProps {
  boardId: string;
  onCreated: (list: ListData) => void;
}

export function CreateListForm({ boardId, onCreated }: CreateListFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/boards/${boardId}/lists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() }),
    });

    if (res.ok) {
      const list = await res.json();
      onCreated(list);
      setTitle("");
      setIsOpen(false);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="h-fit w-72 shrink-0 rounded-xl border-2 border-dashed border-gray-300 p-4 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
      >
        + リストを追加
      </button>
    );
  }

  return (
    <div className="h-fit w-72 shrink-0 rounded-xl bg-gray-100 p-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          placeholder="リスト名"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2">
          <Button size="sm" type="submit" disabled={loading || !title.trim()}>
            追加
          </Button>
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => {
              setIsOpen(false);
              setTitle("");
            }}
          >
            ✕
          </Button>
        </div>
      </form>
    </div>
  );
}
