import { prisma } from "@/libs/prisma";
import { supabase } from "@/libs/supabase";
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

  // PUT
  export type UpdatePostRequestBody = {
    content: string
    ImageKey?: string
    ImageUrl?: string
  }

  export const PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }>},
  ) => {

    const authorization = request.headers.get('Authorization')

    if (!authorization) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user)
      return NextResponse.json({ message: '認証に失敗しました' }, { status: 401 })

    const { id } = await params

    const { content, ImageKey, ImageUrl }: UpdatePostRequestBody = await request.json()

    // if (post.userId !== user.id) {
    //   return 403
    // }

    try {
      const post = await prisma.post.update({
        where: {
          id: parseInt(id),
        },
        data: {
          content,
          ImageKey,
          ImageUrl
        }
      })

      return NextResponse.json({ message: '変更しました'}, { status: 200})
    } catch(error) {
      if(error instanceof Error)
        return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }

  // DELETE
  export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }>},
  ) => {

    const { id } = await params

    const authorization = request.headers.get('Authorization')

    if (!authorization) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    // 認証失敗は401
    if (error || !user)
      return NextResponse.json({ message: '認証に失敗しました' }, { status: 401 })

    // 自分の投稿だけ削除するために投稿を取得
    try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    })

    // 投稿がなければ404
    if (!post) {
      return NextResponse.json(
        { message: '投稿が見つかりません' },
        { status: 404 }
      )
    }

    // if (post.userId !== user.id) {
    //   return NextResponse.json(
    //     { message: 'この投稿を削除する権限がありません' },
    //     { status: 403 }
    //   )
    // }

    // その後、削除
    await prisma.post.delete({
        where: {
          id: parseInt(id)
      }
    })

      return NextResponse.json({ message: '削除成功'}, { status: 200 })
    } catch(error) {
      if(error instanceof Error)
        return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }