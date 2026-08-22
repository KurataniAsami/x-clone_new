// コメント投稿フォーム
"use client";

import { useState } from "react";
import { Comment } from "@/types/post";

type CommentFormProps = {
  postId: number;
  userId: string;
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

      <div className="border-b border-b-gray-700">
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          // rows={4}   // テキストエリアが何行分表示するか
          className="mt-1 pt-2 pl-2 block w-full shadow-sm"
          placeholder="Post your reply"
        ></textarea>

        <div className="flex justify-end mr-3 mb-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2 border border-transparent
              text-sm font-bold rounded-2xl shadow-sm text-black bg-gray-700 disabled:opacity-50"
          >
            {isSubmitting ? "Posting comment..." : "reply"}
          </button>
        </div>
      </div>
    </form>
  );
}