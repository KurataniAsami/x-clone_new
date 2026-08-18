'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/libs/supabase'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accountName, setAccountName] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      // 1. Supabase Authに新規登録
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            accountName,
            name,
          },
        },
      })

      if (error || !data.user) {
        setIsLoading(false)
        return
      }

      // 2. Prisma Userを作成
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: data.user.id,
          email: email,             
          accountName: accountName, 
          name: name,               
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setIsLoading(false)
        return
      }

      alert('ユーザー登録が完了しました')
      router.replace('/login')
    } catch (err) {
      console.error('Catch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center pt-60">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-100"
      >
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-white"
          >
            メールアドレス
          </label>

          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="name@company.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-white"
          >
            パスワード
          </label>

          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="accountName"
            className="block mb-2 text-sm font-medium text-white"
          >
            アカウント名
          </label>

          <input
            type="text"
            name="accountName"
            id="accountName"
            value={accountName}
            placeholder="@tarou"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
            onChange={(e) => setAccountName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-white"
          >
            名前
          </label>

          <input
            type="text"
            name="name"
            id="name"
            placeholder="たろう"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isLoading}
          >
            新規登録
          </button>
        </div>
      </form>
    </div>
  )
}