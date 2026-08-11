import { prisma } from "@/libs/prisma";
import { PostDetail } from "@/types/post";
import { NextRequest, NextResponse } from "next/server";

export type PostShowResponse = {
  post: PostDetail
}

export const GET = async (
  request: NextRequest,
  // { params } → オブジェクトからparams(id)を取り出す
  { params }: { params: Promise<{ id: string }>},
) => {
  const { id } = await params
  
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        user: true
      }
    })

    if(!post) {
      return NextResponse.json({ message: "ポストが見つかりません"}, { status: 400 })
    } 

    return NextResponse.json({ post }, { status: 200 })
  } catch(error) {
      if(error instanceof Error)
        return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }