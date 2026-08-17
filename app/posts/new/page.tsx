'use client'

import { ChangeEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/libs/supabase";
import { v4 as uuidv4 } from 'uuid'

import { CreatepostRequestBody } from "@/app/api/posts/route"
import PostForm, { PostFormData } from "@/app/components/PostForm"

import { useSupabaseSession } from "@/app/hooks/useSupabaseSession"

export default function CreatePostPage() {
  const router = useRouter()

  const [content, setContent] = useState('')
  const [ImageKey, setImageKey] = useState<string | null>(null)
  const [ImageUrl, setImageUrl] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await router.replace('/')
  }

  const { token } = useSupabaseSession()

  // 作成処理
  const handleCreateSubmit = async (data: PostFormData) => {
    setLoading(true)

    const body: CreatepostRequestBody = {
      content: data.content,
      ImageKey: data.ImageKey,
      ImageUrl: ImageUrl,
    }

    try {
      const res = await fetch(`/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

  // 画像アップロード
  const handleImageUpload = async (
    post: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if(!post.target.files || post.target.files.length == 0) {
      return
    }

    const file = post.target.files[0]

    const filePath = `private/${uuidv4()}`

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_image')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

      if(error) {
      setError(error.message)
      return
    }

      const {
        data: { publicUrl },
      } = supabase.storage
      .from('post_image')
      .getPublicUrl(data.path)

      setImageKey(data.path)
      console.log('upload success', data.path)
      setImageUrl(publicUrl)
  }

  return (
    <div>
      <PostForm
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleCreateSubmit}
        content={content}
        setContent={setContent}
        ImageKey={ImageKey}
        ImageUrl={ImageUrl}
        setImageUrl={setImageUrl}
        setImageKey={setImageKey}
        handleImageUpload={handleImageUpload}
        disabled={loading}
      />
    </div>
  )
}

