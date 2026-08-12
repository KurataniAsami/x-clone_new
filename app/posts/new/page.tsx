'use client'

import { useRouter } from "next/router"
import { useState } from "react"

export default function CreatePostPage() {
  const router = useRouter()

  const [content, setContent] = useState('')
  const [ImageKey, setImageKey] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
}

{/* <PostForm
  onCreateSubmit={handleCreateSubmit}
  onEditSubmit={handleEditSubmit}   [id]/page.tsx
/> */}