"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { ListHeader } from "./list-header";
import { CreateListForm } from "./create-list-form";
import { CardItem } from "@/components/card/card-item";
import { CreateCardForm } from "@/components/card/create-card-form";
import { CardDetailModal } from "@/components/card/card-detail-modal";

interface CardData {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  position: number;
  listId: string;
}

interface ListData {
  id: string;
  title: string;
  position: number;
  boardId: string;
  cards: CardData[];
}

interface ListContainerProps {
  boardId: string;
}

export function ListContainer({ boardId }: ListContainerProps) {
  const [lists, setLists] = useState<ListData[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      const res = await fetch(`/api/boards/${boardId}`);
      if (res.ok) {
        const board = await res.json();
        setLists(board.lists);
      }
      setLoading(false);
    };
    fetchBoard();
  }, [boardId]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "list") {
      const reordered = Array.from(lists);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);

      const updated = reordered.map((list, i) => ({ ...list, position: i }));
      setLists(updated);

      await fetch(`/api/boards/${boardId}/lists/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: updated.map((l) => l.id) }),
      });
      return;
    }

    // Card drag
    const sourceListIndex = lists.findIndex(
      (l) => l.id === source.droppableId
    );
    const destListIndex = lists.findIndex(
      (l) => l.id === destination.droppableId
    );

    const newLists = lists.map((l) => ({
      ...l,
      cards: [...l.cards],
    }));

    const [movedCard] = newLists[sourceListIndex].cards.splice(source.index, 1);
    movedCard.listId = newLists[destListIndex].id;
    newLists[destListIndex].cards.splice(destination.index, 0, movedCard);

    // Update positions
    const affectedCards: { id: string; listId: string; position: number }[] = [];

    newLists[sourceListIndex].cards.forEach((card, i) => {
      card.position = i;
      affectedCards.push({ id: card.id, listId: card.listId, position: i });
    });

    if (sourceListIndex !== destListIndex) {
      newLists[destListIndex].cards.forEach((card, i) => {
        card.position = i;
        affectedCards.push({ id: card.id, listId: card.listId, position: i });
      });
    }

    setLists(newLists);

    await fetch(`/api/boards/${boardId}/cards/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cards: affectedCards }),
    });
  };

  const handleCardCreated = (card: CardData) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === card.listId
          ? { ...list, cards: [...list.cards, card] }
          : list
      )
    );
  };

  const handleCardUpdated = (updatedCard: CardData) => {
    setLists((prev) =>
      prev.map((list) => ({
        ...list,
        cards: list.cards.map((c) =>
          c.id === updatedCard.id ? { ...updatedCard, listId: c.listId } : c
        ),
      }))
    );
    setSelectedCard(null);
  };

  const handleCardDeleted = (cardId: string) => {
    setLists((prev) =>
      prev.map((list) => ({
        ...list,
        cards: list.cards.filter((c) => c.id !== cardId),
      }))
    );
  };

  const handleListCreated = (list: ListData) => {
    setLists((prev) => [...prev, list]);
  };

  const handleListUpdated = (listId: string, title: string) => {
    setLists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, title } : l))
    );
  };

  const handleListDeleted = (listId: string) => {
    setLists((prev) => prev.filter((l) => l.id !== listId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex items-start gap-4 overflow-x-auto pb-4"
            >
              {lists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`w-72 shrink-0 rounded-xl bg-gray-100 p-3 ${
                        snapshot.isDragging ? "shadow-lg ring-2 ring-blue-400" : ""
                      }`}
                    >
                      <div {...provided.dragHandleProps}>
                        <ListHeader
                          listId={list.id}
                          boardId={boardId}
                          title={list.title}
                          onUpdated={(title) => handleListUpdated(list.id, title)}
                          onDeleted={() => handleListDeleted(list.id)}
                        />
                      </div>
                      <Droppable droppableId={list.id} type="card">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[2px] space-y-2 rounded-lg p-1 transition-colors ${
                              snapshot.isDraggingOver ? "bg-blue-50" : ""
                            }`}
                          >
                            {list.cards.map((card, cardIndex) => (
                              <CardItem
                                key={card.id}
                                card={card}
                                index={cardIndex}
                                onClick={() => setSelectedCard(card)}
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <div className="mt-2">
                        <CreateCardForm
                          boardId={boardId}
                          listId={list.id}
                          onCreated={handleCardCreated}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <CreateListForm boardId={boardId} onCreated={handleListCreated} />
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <CardDetailModal
        card={selectedCard}
        boardId={boardId}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdated={handleCardUpdated}
        onDeleted={handleCardDeleted}
      />
    </>
  );
}
