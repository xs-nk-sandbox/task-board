import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBoardSchema } from "@/lib/validations/board";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const boards = await prisma.board.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(boards);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title } = createBoardSchema.parse(body);

    const board = await prisma.board.create({
      data: { title, userId: session.user.id },
    });

    return NextResponse.json(board, { status: 201 });
  } catch {
    return NextResponse.json({ error: "ボードの作成に失敗しました" }, { status: 400 });
  }
}
