'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

import { Post } from "@/types/post"

import PersonIcon from '@mui/icons-material/Person';
import LikeButton from "../components/LikeButton";
import { useCurrentUser } from "../hooks/useCurrentUser";


export default function LikesListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const currentUser = useCurrentUser()

  useEffect(() => {
    if (!currentUser) return;

    const getLikedPosts = async () => {
      const res = await fetch(
        `/api/likes?userId=${currentUser.id}`
      );

      const data = await res.json();

      const posts = data.likes.map((like: any) => like.post);

      setPosts(posts);
      setLoading(false);
    };

    getLikedPosts();
  }, [currentUser]);

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

                <div className="flex-1 flex-col">
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

                  {currentUser && (
                    <LikeButton
                      postId={post.id}
                      userId={currentUser.id}
                    />
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
