"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ListHeaderProps {
  listId: string;
  boardId: string;
  title: string;
  onUpdated: (title: string) => void;
  onDeleted: () => void;
}

export function ListHeader({ listId, boardId, title, onUpdated, onDeleted }: ListHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleSave = async () => {
    if (!editTitle.trim() || editTitle.trim() === title) {
      setIsEditing(false);
      setEditTitle(title);
      return;
    }

    const res = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle.trim() }),
    });

    if (res.ok) {
      onUpdated(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("このリストを削除しますか？")) return;

    const res = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onDeleted();
    }
  };

  return (
    <div className="flex items-center justify-between px-1 pb-2">
      {isEditing ? (
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setIsEditing(false);
              setEditTitle(title);
            }
          }}
          autoFocus
          className="h-8 font-semibold"
        />
      ) : (
        <h3
          className="cursor-pointer font-semibold text-gray-800 truncate"
          onClick={() => setIsEditing(true)}
        >
          {title}
        </h3>
      )}
      <Button variant="ghost" size="sm" onClick={handleDelete} className="text-gray-400 hover:text-red-600 shrink-0">
        ✕
      </Button>
    </div>
  );
}
