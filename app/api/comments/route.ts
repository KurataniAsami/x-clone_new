import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({
      error: "コメントを取得するためのPostIDが存在しません" 
    },
    { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            accountName: true,
            name: true,
          },
        },
      },
    })
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("コメントが取得できません", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { postId, userId, content } = await request.json();

    // ?.trim()にすることで空白を通さない
    if (!postId || !userId || !content?.trim()) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // データベースに保存
    const comment = await prisma.comment.create({
      data: {
        postId: Number(postId),
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            accountName: true,
            name: true,
          },
        },
      },
    })

return NextResponse.json(comment)
  } catch (error) {
    console.error("コメントの作成処理中にエラーが発生しました:", error);

    return NextResponse.json(
      { error: "サーバー側でエラーが発生" },
      { status: 500 }
  );
  }
}