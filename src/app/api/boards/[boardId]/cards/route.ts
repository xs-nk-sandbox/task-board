import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCardSchema } from "@/lib/validations/card";

export async function POST(
  request: Request,
  { params }: { params: { boardId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const board = await prisma.board.findFirst({
    where: { id: params.boardId, userId: session.user.id },
  });
  if (!board) {
    return NextResponse.json({ error: "ボードが見つかりません" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { title, listId } = createCardSchema.parse(body);

    const list = await prisma.list.findFirst({
      where: { id: listId, boardId: params.boardId },
    });
    if (!list) {
      return NextResponse.json({ error: "リストが見つかりません" }, { status: 404 });
    }

    const maxPosition = await prisma.card.aggregate({
      where: { listId },
      _max: { position: true },
    });

    const card = await prisma.card.create({
      data: {
        title,
        listId,
        position: (maxPosition._max.position ?? -1) + 1,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch {
    return NextResponse.json({ error: "カードの作成に失敗しました" }, { status: 400 });
  }
}
