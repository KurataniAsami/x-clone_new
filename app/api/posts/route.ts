import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

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