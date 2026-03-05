"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateBoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (board: { id: string; title: string; createdAt: string }) => void;
}

export function CreateBoardDialog({ isOpen, onClose, onCreated }: CreateBoardDialogProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() }),
    });

    if (res.ok) {
      const board = await res.json();
      onCreated(board);
      setTitle("");
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">新しいボードを作成</h2>
        <Input
          placeholder="ボード名"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="submit" disabled={loading || !title.trim()}>
            {loading ? "作成中..." : "作成"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
