import { prisma } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()

    const { id, email, accountName, name } = body

    if (!id || !email) {
      return NextResponse.json(
        { message: 'アカウント名とEmailは必須です' },
        { status: 400 }
      )
    }

    // 1. 重複Emailの古いユーザーがあれば削除
    const existingEmailUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingEmailUser && existingEmailUser.id !== id) {
      await prisma.user.delete({
        where: { id: existingEmailUser.id },
      })
    }

    // 2. Prisma User の保存 (upsert)
    // ※ schema.prisma の定義が accountName の場合
    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        accountName: accountName ?? null,
        name: name ?? null,
      },
      create: {
        id,
        email,
        accountName: accountName ?? null,
        name: name ?? null,
      },
    })

    return NextResponse.json({ user }, { status: 200 })

  } catch (error) {
    if(error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}