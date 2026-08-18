'use client'

import { useEffect, useState } from "react"
import { useSupabaseSession } from "./useSupabaseSession"
import { CurrentUser } from "@/types/post"

export const useCurrentUser = () => {

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  const { session } = useSupabaseSession()

  // 現在ログインしているユーザーの取得
  useEffect(() => {
    const getUser = async () => {
      // session または user.id が存在しない場合は処理しない
      if (!session?.user?.id) return
  
      try {
        const res = await fetch(`/api/users/${session.user.id}`)
  
        const data = await res.json()
  
        setCurrentUser(data.user ?? data) 
      } catch (error) {
        console.error('ユーザーが取得できませんでした:', error)
      }
    }
  
    getUser()
  }, [session?.user?.id]) 

  return currentUser
}