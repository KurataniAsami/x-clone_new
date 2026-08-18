import { prisma } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  try {
    // ここを追加
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        accountName: true,
        name: true,
      },
    })

    // 今までの検索
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        accountName: true,
        name: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { user },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: 'ユーザー情報の取得に失敗しました' },
      { status: 400 }
    )
  }
}