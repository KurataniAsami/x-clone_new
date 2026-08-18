'use client'

import { ChangeEvent, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/libs/supabase";
import { useSupabaseSession } from "@/app/hooks/useSupabaseSession";

import { PostDetail } from "@/types/post"
import { UpdatePostRequestBody } from "@/app/api/posts/[id]/route";

import { PostFormData } from "@/app/components/PostForm";
import PostDropDownMenu from "@/app/components/DropDownMenu";

import { v4 as uuidv4 } from 'uuid'
import PersonIcon from '@mui/icons-material/Person';
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

export default function PostDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string}>()

  const [post, setPost] = useState<PostDetail | null>(null)
  const [content, setContent] = useState('')
  const [ImageKey, setImageKey] = useState<string | null>(null)
  const [ImageUrl, setImageUrl] = useState<string | null>(null)

  // モーダル
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  const { session, token } = useSupabaseSession()

  const currentUser = useCurrentUser()

  useEffect(() => {
    const getPostDetail = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`)
        const data = await res.json()
        setPost(data.post)
        setImageKey(data.post.ImageKey ?? '')
      } catch(error) {
        setError(error instanceof Error ? error.message: 'ポストを取得できませんでした')
      } finally {
        setLoading(false)
      }
    }

    getPostDetail()
  },[id])

  // 作成ボタンクリックで認証
  const handlePostCreate = () => {
    if (!session) {
      router.push('/login')
      return
    }

    router.push(`/posts/new`)
  }

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
  const handleEdit = () => {
    if (!session) {
      router.push('/login')
      return
    }

    setIsEditOpen(true)
  }

  const handleEditSubmit = async (data: PostFormData) => {
  
    setLoading(true)

    const body: UpdatePostRequestBody = {
      content: data.content,
      ImageKey: data.ImageKey,
      ImageUrl: data.ImageUrl,
    }

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

  // 画像のアップロード
  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    ): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    const file = event.target.files[0]

    const filePath = `private/${uuidv4()}`

    const { data, error } = await supabase.storage
      .from('post_image')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      setError(error.message)
      return
    }

    setImageKey(data.path)

    const {
      data: { publicUrl },
      } = supabase.storage
      .from('post_image')
      .getPublicUrl(data.path)

      setImageUrl(publicUrl)
      
  }

  // DELETE
  const handleDeleteClick = () => {
    if(!session) {
      router.push('/login')
      return
    }
     
    setIsDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch(`/api/posts/${id}`,{
        method: 'DELETE',
        headers: {
        Authorization: `Bearer ${token}`,
      },
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
      <div className="flex justify-end mr-3">
        <Button
          className="bg-gray-700 text-black rounded-2xl font-bold mt-3 p-4 hover:bg-gray-700"
          onClick={handlePostCreate}
        >
          Post
        </Button>
      </div>

      <div className="flex gap-2 mt-3 border-b border-b-gray-700 pb-3">
        <div className="h-8 w-8 inline-flex rounded-full bg-white p-1">
          <PersonIcon className="h-5 w-5 text-black" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex gap-2">
              <p>{post.user?.name}</p>
                <p className="text-gray-400">
                {post.user?.accountName}
              </p>
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
              ImageKey={ImageKey}
              setImageKey={setImageKey}
              ImageUrl={ImageUrl}
              setImageUrl={setImageUrl}
              handleImageUpload={handleImageUpload}
              session={session}
              onEdit={handleEdit}
              onDeleteClick={handleDeleteClick}
            />
          </div>

          <div className="mt-1">
            {post.content}
          </div>

          {post.ImageUrl && (
            <div className="mt-2">
              <img
                src={post.ImageUrl}
                alt="thumbnail"
                width={300}
                height={400}
                className="rounded-xl"
              />
            </div>
          )}

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