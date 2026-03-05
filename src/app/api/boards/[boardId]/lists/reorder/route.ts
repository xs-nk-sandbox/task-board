import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reorderListSchema } from "@/lib/validations/list";

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
    const { orderedIds } = reorderListSchema.parse(body);

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.list.update({
          where: { id },
          data: { position: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "並び替えに失敗しました" }, { status: 400 });
  }
}
