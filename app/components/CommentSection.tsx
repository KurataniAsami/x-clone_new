// コメントの状態を管理するコンポーネント
"use client";

import { Dispatch, SetStateAction, useState } from "react";
import CommentList from "./CommentList";
import { Comment } from "@/types/post";
import CommentForm from "@/components/ui/CommentForm";

type CommentSectionProps = {
  postId: number;
  userId: number;
  initialComments: Comment[];
  content: string
  setContent: Dispatch<SetStateAction<string>>
}

export default function CommentSection({
  postId,
  userId,
  initialComments,
  content,
  setContent
}: CommentSectionProps) {

  const [comments, setComments] = useState<Comment[]>(initialComments);
  
  const handleCommentAdded = (newComment: Comment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  return (
    <>
      <CommentList comments={comments} />
      <CommentForm
        postId={postId}
        onCommentAdded={handleCommentAdded}
        userId={userId}  
      />
    </>
  );
}