"use client";

import { Draggable } from "@hello-pangea/dnd";

interface CardData {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  position: number;
}

interface CardItemProps {
  card: CardData;
  index: number;
  onClick: () => void;
}

export function CardItem({ card, index, onClick }: CardItemProps) {
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`rounded-lg border bg-white p-3 shadow-sm cursor-pointer hover:border-blue-300 transition-colors ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-blue-400" : ""
          }`}
          onClick={onClick}
        >
          <p className="text-sm font-medium text-gray-800">{card.title}</p>
          {card.dueDate && (
            <p
              className={`mt-1.5 text-xs ${
                isOverdue ? "text-red-500" : "text-gray-400"
              }`}
            >
              {new Date(card.dueDate).toLocaleDateString("ja-JP")}
            </p>
          )}
        </div>
      )}
    </Draggable>
  );
}
