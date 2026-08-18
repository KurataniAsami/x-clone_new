'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

import { Post } from "@/types/post"

import PersonIcon from '@mui/icons-material/Person';
import { useSupabaseSession } from "./hooks/useSupabaseSession";

type CurrentUser = {
  id: string
  email: string
  accountName: string | null
  name: string | null
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  const [loading, setLoading] = useState(true)

  const { session } = useSupabaseSession()

  useEffect(() => {
  const getUser = async () => {
    // session または user.id が存在しない場合は処理しない
    if (!session?.user?.id) return

    try {
      const res = await fetch(`/api/users/${session.user.id}`)

      if (!res.ok) {
        console.log('ユーザー取得失敗:', res.status)
        return
      }

      const data = await res.json()
      console.log('GET APIから取得したデータ:', data) // ★ここで accountName が入っているか確認

      // APIが { user: { ... } } を返す場合:
      setCurrentUser(data.user ?? data) 
      // ※ APIが直接 { id, accountName, ... } を返している場合は data を直接セット
    } catch (error) {
      console.error('Fetchエラー:', error)
    }
  }

  getUser()
}, [session?.user?.id]) // session.user.id の変化をトリガーにする

  useEffect(() => {
    const getAllPosts = async () => {
      const res = await fetch(`/api/posts`)
      const data = await res.json()
      setPosts(data.posts)
      setLoading(false)
    }

    getAllPosts()
  },[])

  if(loading) return <p>Loading...</p>
  if (!posts) return <p>ポストがありません</p>
  
  return (
    <div>
      <div>
        {currentUser && (
          <p>{currentUser.accountName}</p>
        )}
      </div>

      <ul>
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <div className="flex gap-3 mt-3 border-b border-b-gray-700">
                <div className="h-8 w-8 inline-flex rounded-full bg-white p-1">
                  <PersonIcon className="h-5 w-5 text-black" />
                </div>
                <Link
                  href={`posts/${post.id}`}
                >
                  <div className="my-1 line-clamp-3">
                    {post.content}
                  </div>
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
