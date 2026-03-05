import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateCardSchema } from "@/lib/validations/card";

export async function GET(
  _request: Request,
  { params }: { params: { boardId: string; cardId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const card = await prisma.card.findFirst({
    where: {
      id: params.cardId,
      list: { boardId: params.boardId, board: { userId: session.user.id } },
    },
  });

  if (!card) {
    return NextResponse.json({ error: "カードが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(card);
}

export async function PATCH(
  request: Request,
  { params }: { params: { boardId: string; cardId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const card = await prisma.card.findFirst({
    where: {
      id: params.cardId,
      list: { boardId: params.boardId, board: { userId: session.user.id } },
    },
  });
  if (!card) {
    return NextResponse.json({ error: "カードが見つかりません" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const data = updateCardSchema.parse(body);

    const updated = await prisma.card.update({
      where: { id: params.cardId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { boardId: string; cardId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const card = await prisma.card.findFirst({
    where: {
      id: params.cardId,
      list: { boardId: params.boardId, board: { userId: session.user.id } },
    },
  });
  if (!card) {
    return NextResponse.json({ error: "カードが見つかりません" }, { status: 404 });
  }

  await prisma.card.delete({ where: { id: params.cardId } });

  return NextResponse.json({ success: true });
}
