'use client'

import { useRouter } from "next/navigation"
import { supabase } from "@/libs/supabase"
import { useSupabaseSession } from "../hooks/useSupabaseSession"
import { useCurrentUser } from "../hooks/useCurrentUser"

export default function RightSidebar() {
  const router = useRouter()
  const { session } = useSupabaseSession()

  //  ログインユーザーの取得はhokksに格納 
  const currentUser = useCurrentUser()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await router.replace('/')
  }

  return (
    <div>
      {session ? (
        <div>
          <p>ログイン中</p>

          <div>
            {currentUser && (
              <p>{currentUser.accountName}</p>
            )}
          </div>

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
  )
}