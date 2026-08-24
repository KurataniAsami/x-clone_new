import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

// 自分がいいねしたポストを表示する
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get("userId");
  const postId = searchParams.get("postId");

  if (!userId) {
    return NextResponse.json({
      error: "userIdが存在しません" 
    },
    { status: 400 });
  }

  try {
    // 特定の投稿のいいね状態を取得
    if (postId) {

      const like = await prisma.like.findUnique({
        where: {
          postId_userId: {   // スキーマの@@uniqueからの複合キー
            postId: Number(postId),
            userId,
          },
        },
      });

      return NextResponse.json({
        isLiked: !!like,
      });
    }

    const likes = await prisma.like.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: {
          include: {
            user: {
              select: {
                id: true,
                accountName: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ likes });
  } catch (error) {
    console.error("一覧が取得できません", error);
    return NextResponse.json(
      { error: "サーバー側でエラーが発生" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { postId, userId } = await request.json();

    if (!postId || !userId ) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // データベースに保存
    const like = await prisma.like.create({
      data: {
        postId: Number(postId),
        userId,
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

    return NextResponse.json(like)
  } catch (error) {
    console.error("いいねの保存処理中にエラーが発生しました:", error);

    return NextResponse.json(
      { error: "サーバー側でエラーが発生" },
      { status: 500 }
  );
  }
}


export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const postId = searchParams.get("postId");
  const userId = searchParams.get("userId");

  if (!postId || !userId) {
    return NextResponse.json(
      { error: "postIdまたはuserIdがありません" },
      { status: 400 }
    );
  }

  try {
    await prisma.like.deleteMany({
      where: {
        userId,
        postId: Number(postId),
      },
    });
    return NextResponse.json({ message: 'いいね解除しました' }, { status: 200 })
  } catch (error) {
    if(error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}