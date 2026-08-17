'use client'

import { supabase } from "@/libs/supabase"
import { useRouter } from "next/navigation"
import { useSupabaseSession } from "../hooks/useSupabaseSession"

export default function RightSidebar() {
  const router = useRouter()
  const { session, isLoading } = useSupabaseSession()

  const handleLogout = async () => {
      await supabase.auth.signOut()
      await router.replace('/')
    }

  return (
    <div>
      <div>
        {session ? (
          <div>
            <p>ログイン中</p>

            <button
              onClick={handleLogout}
              className="fixed bottom-4 right-4 bg-white text-black rounded-full px-3 py-1"
            >
              Log Out
            </button>
          </div>
        ) : (
          <p>ログインしていません</p>
        )}
      </div>
    </div>
  )
}