'use client'

import { supabase } from '@/libs/supabase'
import { Session } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

// Supabaseが保持しているログインセッションを取得して、アプリ側で使えるようにする
export const useSupabaseSession = () => {
  // 現在ログインしているかを管理
  // undefined: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  const [token, setToken] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setToken(session?.access_token || null)  // 取得したトークンをstateに保存
    }

    fetcher()
  }, [pathname])

  return { session, isLoading: session === undefined, token }
}