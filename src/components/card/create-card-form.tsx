"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CardData {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  position: number;
  listId: string;
}

interface CreateCardFormProps {
  boardId: string;
  listId: string;
  onCreated: (card: CardData) => void;
}

export function CreateCardForm({ boardId, listId, onCreated }: CreateCardFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/boards/${boardId}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), listId }),
    });

    if (res.ok) {
      const card = await res.json();
      onCreated({ ...card, listId });
      setTitle("");
      setIsOpen(false);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-lg p-2 text-left text-sm text-gray-500 hover:bg-gray-100 transition-colors"
      >
        + カードを追加
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        placeholder="カードのタイトル"
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
  );
}
