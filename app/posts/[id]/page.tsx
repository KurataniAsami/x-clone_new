'use client'

import { useEffect, useState } from "react"
import Link from "next/link";
import { useParams } from "next/navigation"
import { PostDetail } from "@/types/post"
import { Button } from "@/components/ui/button"
import PersonIcon from '@mui/icons-material/Person';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string}>()

  const [post, setPost] = useState<PostDetail | null>(null)

  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPostDetail = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`)
        const data = await res.json()
        console.log(data)
        setPost(data.post)
      } catch(error) {
        setError(error instanceof Error ? error.message: 'ポストを取得できませんでした')
      } finally {
        setLoading(false)
      }
    }

    getPostDetail()
  },[id])

  if(loading) return <p>Loading...</p>
  if(!post) return <p>イベントがありません</p>
  if(error) return <p>エラーが発生しました</p>

  return (
    <div>
      <Link
        href={`posts/new`}
        className="flex justify-end mr-3"
      >
        <Button
          className="bg-gray-700 text-black rounded-2xl font-bold mt-3 p-4"
        >
          Post
        </Button>
      </Link>

      <div className="flex gap-2 mt-3 border-b border-b-gray-700 pb-3">
        <div className="h-8 w-8 inline-flex rounded-full bg-white p-1">
          <PersonIcon className="h-5 w-5 text-black" />
        </div>

        <span>{post.user?.name}</span>
        <span className="text-gray-400">
          {post.user?.AccountName}
        </span>

        <div className="flex flex-col">
          <span>{post.user?.name}</span>
          <span className="text-gray-400">
            {post.user?.AccountName}
          </span>

          <div className="ml-auto">

            <div className="my-1">
              {post.content}
              {/* 画像 */}
            </div>

            <p>
              {new Date(post.createdAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}