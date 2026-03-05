"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
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

interface CardDetailModalProps {
  card: CardData | null;
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (card: CardData) => void;
  onDeleted: (cardId: string) => void;
}

export function CardDetailModal({
  card,
  boardId,
  isOpen,
  onClose,
  onUpdated,
  onDeleted,
}: CardDetailModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || "");
      setDueDate(card.dueDate ? card.dueDate.split("T")[0] : "");
    }
  }, [card]);

  if (!card) return null;

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/boards/${boardId}/cards/${card.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || null,
        dueDate: dueDate || null,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      onUpdated(updated);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("このカードを削除しますか？")) return;

    const res = await fetch(`/api/boards/${boardId}/cards/${card.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onDeleted(card.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タイトル
          </label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            説明
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="カードの説明を入力..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            期限日
          </label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="flex justify-between pt-2">
          <Button variant="danger" size="sm" onClick={handleDelete}>
            削除
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSave} disabled={saving || !title.trim()}>
              {saving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
