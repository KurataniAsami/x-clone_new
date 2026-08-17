import { prisma } from "@/libs/prisma";
import { supabase } from "@/libs/supabase";
import { NextRequest, NextResponse } from "next/server";

export type PostIndexResponse = {
  content: string
  ImageKey?: string
  createdAt: Date
}

export const GET = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            AccountName: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ posts }, { status: 200 })
  } catch(error) {
    if(error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

// POST
export type CreatepostRequestBody = {
  content: string
  ImageKey?: string | null
  ImageUrl?: string | null
}

// レスポンス返す型
export type CreatePostResponse = {
  id: number
}

// Authorization: 私はこのユーザーですという認証情報をサーバーに送るための場所
export const POST = async (
  request: NextRequest
) => {
  const authorization = request.headers.get('Authorization')   // Authorizationヘッダーを取得

  // 認証エラーを返す
  if (!authorization) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    )
  }

  // token: APIへ送る認証情報, Bearerトークンとして送信
  // Authorizationが存在した場合eyJ...に変換
  // Authorizationからトークンを取り出してawait supabase.auth.getUserに渡す
  const token = authorization.replace('Bearer ', '')  // Bearerを取り除いたトークン

  // トークンが有効か確認する
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)  // トークンからユーザー情報を取得

  if (error || !user)
    return NextResponse.json({ status: error?.message }, { status: 400 })

  try {
    // ① フロントからデータが入ったbodyが送られ、それを受け取る
    const body: CreatepostRequestBody = await request.json()

    const { content, ImageKey, ImageUrl } = body  // ② bodyから取り出す

    // ③ レコード作成
    const data = await prisma.post.create({
      data: {
        content,   // content: body.contentと同じ意味
        ImageKey,
        ImageUrl
      }
    })

    // 中間テーブル作成

    return NextResponse.json({
      id: data.id
    })
  } catch(error) {
    if(error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}