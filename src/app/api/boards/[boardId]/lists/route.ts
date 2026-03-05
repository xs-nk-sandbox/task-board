import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createListSchema } from "@/lib/validations/list";

export async function GET(
  _request: Request,
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

  const lists = await prisma.list.findMany({
    where: { boardId: params.boardId },
    orderBy: { position: "asc" },
    include: { cards: { orderBy: { position: "asc" } } },
  });

  return NextResponse.json(lists);
}

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
    const { title } = createListSchema.parse(body);

    const maxPosition = await prisma.list.aggregate({
      where: { boardId: params.boardId },
      _max: { position: true },
    });

    const list = await prisma.list.create({
      data: {
        title,
        boardId: params.boardId,
        position: (maxPosition._max.position ?? -1) + 1,
      },
      include: { cards: true },
    });

    return NextResponse.json(list, { status: 201 });
  } catch {
    return NextResponse.json({ error: "リストの作成に失敗しました" }, { status: 400 });
  }
}
