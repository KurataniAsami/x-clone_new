'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

import { Post } from "@/types/post"

import PersonIcon from '@mui/icons-material/Person';
import { useCurrentUser } from "./hooks/useCurrentUser";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  //  ログインユーザーの取得はhokksに格納
  const currentUser = useCurrentUser()

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
      <ul>
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <div className="flex gap-3 mt-3 border-b border-b-gray-700 pb-3">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <PersonIcon className="h-5 w-5 text-black" />
                </div>

                <div className="flex-1">
                  <div className="flex gap-2">
                  <p>{post.user?.name}</p>
                    <p className="text-gray-400">
                    {post.user?.accountName}
                  </p>
                </div>

                  <Link href={`posts/${post.id}`}>
                    <div className="my-1 line-clamp-3">
                      {post.content}
                    </div>
                  </Link>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
