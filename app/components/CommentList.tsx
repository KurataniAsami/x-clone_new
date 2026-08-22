import { Comment } from "@/types/post"

// コメント表示
type CommentListProps = {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div className="mt-8">
      {!comments || comments.length === 0 ? (
        <p className="text-gray-500">コメントがありません</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="text-white p-4 rounded-lg">
              <div className="flex gap-3">
                <p className="text-white">
                  {comment.user.name}
                </p>
                <p className="text-gray-700">{comment.user.accountName}</p>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-white">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}