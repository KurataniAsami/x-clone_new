'use client'

import { CreatepostRequestBody } from "@/app/api/posts/route"
import PostForm, { PostFormData } from "@/app/components/PostForm"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CreatePostPage() {
  const router = useRouter()

  const [content, setContent] = useState('')
  const [ImageKey, setImageKey] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 作成処理
  const handleCreateSubmit = async (data: PostFormData) => {

    setLoading(true)

    const body: CreatepostRequestBody = {
      content: data.content,
      ImageKey: data.ImageKey,
    }

    try {
      const res = await fetch(`/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      router.push('/')
    } catch(error) {
      setError(error instanceof Error ? error.message: 'ポストを作成できませんでした')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PostForm
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleCreateSubmit}
        content={content}
        setContent={setContent}
        disabled={loading}
      />
    </div>
  )
}

