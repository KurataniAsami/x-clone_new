'use client'
import { useEffect, useState } from "react";

export const useLike = (
  postId: number,
  userId: string
) => {
  const [isLiked, setIsLiked] = useState(false);

  // 現在のいいね状態を取得
  useEffect(() => {
    const getLikeStatus = async () => {
      try {
        const response = await fetch(
          `/api/likes?postId=${postId}&userId=${userId}`
        );

        if (!response.ok) {
          throw new Error("いいね状態の取得に失敗しました");
        }

        const data = await response.json();

        setIsLiked(data.isLiked);
      } catch (error) {
        console.error(error);
      }
    };

    getLikeStatus();
  }, [postId, userId]);

  // いいね・いいね解除
  const handleLike = async () => {
    try {
      if(isLiked) {
        const res = await fetch(`/api/likes?postId=${postId}&userId=${userId}`,{
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })

         if (!res.ok) {
          throw new Error("いいね解除に失敗しました");
        }

        setIsLiked(false);

      } else {

        const res = await fetch("/api/likes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId,
            userId,
          }),
        });

        if (!res.ok) {
          throw new Error("いいねに失敗しました");
        }

        // APIから返ってきたデータをnewLikeに入れる
        // 作成したlikeの処理を一覧に追加するためnewlikeとする
        const newLike = await res.json();

        setIsLiked(true);

        return newLike;
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    isLiked,
    handleLike,
  };
};