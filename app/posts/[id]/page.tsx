'use client'

import { useEffect, useState } from "react"
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"

import { PostDetail } from "@/types/post"
import { UpdatePostRequestBody } from "@/app/api/posts/[id]/route";
import { PostFormData } from "@/app/components/PostForm";

import PostDropDownMenu from "@/app/components/DropDownMenu";

import PersonIcon from '@mui/icons-material/Person';
import { Button } from "@/components/ui/button"

export default function PostDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string}>()

  const [post, setPost] = useState<PostDetail | null>(null)
  const [content, setContent] = useState('')
  const [ImageKey, setImageKey] = useState<string | null>(null)


  // モーダル
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

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

  // PUT
  // フォームに既存データ表示
  useEffect(() => {
    const ChengePost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`)
        const data = await res.json()

        setContent(data.post.content)
      } catch(error) {
        setError(error instanceof Error ? error.message: '既存データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    ChengePost()
  },[id])


  // 更新処理
  const handleEditSubmit = async (data: PostFormData) => {
  
    setLoading(true)

    const body: UpdatePostRequestBody = {
      content: data.content,
      ImageKey: data.ImageKey,
    }

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      router.push('/')
    } catch(error) {
      setError(error instanceof Error ? error.message: 'ポストを変更できませんでした')
    } finally {
      setLoading(false)
    }
  }

  // DELETE
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/posts/${id}`,{
        method: 'DELETE'
      })

      router.push('/')
    } catch(error) {
      setError(error instanceof Error ? error.message: 'ポストを削除できませんでした')
    }
  }

  if(loading) return <p>Loading...</p>
  if(!post) return <p>イベントがありません</p>
  if(error) return <p>エラーが発生しました</p>

  return (
    <div>
      <Link
        href={`/posts/new`}
        className="flex justify-end mr-3"
      >
        <Button
          className="bg-gray-700 text-black rounded-2xl font-bold mt-3 p-4 hover:bg-gray-700"
        >
          Post
        </Button>
      </Link>

      <div className="flex gap-2 mt-3 border-b border-b-gray-700 pb-3">
        <div className="h-8 w-8 inline-flex rounded-full bg-white p-1">
          <PersonIcon className="h-5 w-5 text-black" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <span>{post.user?.name}</span>
              <span className="ml-2 text-gray-400">
                {post.user?.AccountName}
              </span>
            </div>

            <PostDropDownMenu
              onEditSubmit={handleEditSubmit}
              isEditOpen={isEditOpen}
              setIsEditOpen={setIsEditOpen}
              isDeleteOpen={isDeleteOpen}
              setIsDeleteOpen={setIsDeleteOpen}
              content={content}
              setContent={setContent}
              onDelete={handleDelete}
            />
          </div>

          <div className="mt-1">
            {post.content}
          </div>

          <p className="mt-2">
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
  )
}