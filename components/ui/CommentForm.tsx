// コメント投稿フォーム
"use client";

import { useState } from "react";
import { Comment } from "@/types/post";

type CommentFormProps = {
  postId: number;
  userId: number;
  onCommentAdded: (comment: Comment) => void;
}

export default function CommentForm({
  postId,
  userId,
  onCommentAdded,  // コメントの投稿が成功したことを親コンポーネントに知らせる
}: CommentFormProps) {
  
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId, content }),
      });

      if (!response.ok) {
        throw new Error("コメントを投稿できませんでした");
      }

      const newComment = await response.json();
      setContent("");
      onCommentAdded(newComment);  // CommentSection.tsxで
    } catch (error) {
      console.error("コメント送信エラー:", error);
      setError("コメントを投稿できませんでした。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {error && (
        <div className="text-red-500" role="alert">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          コメント
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}   // テキストエリアが何行分表示するか
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white !bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? "コメント送信中..." : "コメントする"}
      </button>
    </form>
  );
}