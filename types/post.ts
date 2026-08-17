// 一覧表示の型
export type Post = {
  id: number
  content: string
  createdAt: Date
  ImageKey: string | null
  comments: string | null

  user: {
    id: number
    AccountName: string | null   // 一時的にnull
    name: string | null  // 一時的にnull
  }
}

export type PostIndexResponse = {
  posts: Post[]  // Postをstateに入れる
}

// 詳細用型
export type PostDetail = {
  id: number
  content: string
  createdAt: string
  ImageKey: string | null
  ImageUrl: string | null
  comments: string | null

  user: {
    id: number
    AccountName: string | null   // 一時的にnull
    name: string | null   // 一時的にnull
  }
}