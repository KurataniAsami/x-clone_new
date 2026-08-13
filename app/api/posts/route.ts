import { prisma } from "@/libs/prisma";
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
  ImageKey?: string
}

// レスポンス返す型
export type CreatePostResponse = {
  id: number
}

export const POST = async (
  request: NextRequest
) => {
  try {
    // ① フロントからデータが入ったbodyが送られ、それを受け取る
    const body: CreatepostRequestBody = await request.json()

    const { content, ImageKey } = body  // ② bodyから取り出す

    // ③ レコード作成
    const data = await prisma.post.create({
      data: {
        content,   // content: body.contentと同じ意味
        ImageKey
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