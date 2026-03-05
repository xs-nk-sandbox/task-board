import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateListSchema } from "@/lib/validations/list";

export async function PATCH(
  request: Request,
  { params }: { params: { boardId: string; listId: string } }
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
    const { title } = updateListSchema.parse(body);

    const list = await prisma.list.update({
      where: { id: params.listId },
      data: { title },
    });

    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { boardId: string; listId: string } }
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

  await prisma.list.delete({ where: { id: params.listId } });

  return NextResponse.json({ success: true });
}
