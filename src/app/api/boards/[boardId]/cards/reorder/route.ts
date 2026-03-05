import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reorderCardSchema } from "@/lib/validations/card";

export async function PATCH(
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
    const { cards } = reorderCardSchema.parse(body);

    await prisma.$transaction(
      cards.map((card) =>
        prisma.card.update({
          where: { id: card.id },
          data: { listId: card.listId, position: card.position },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "並び替えに失敗しました" }, { status: 400 });
  }
}
