'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Post } from "@/types/post"
import PersonIcon from '@mui/icons-material/Person';

export default function Home() {
  const { id } = useParams<{ id: string }>()

  const [posts, setPosts] = useState<Post[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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