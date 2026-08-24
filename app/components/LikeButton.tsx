import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useLike } from "../hooks/useLike";

type LikeButtonProps = {
  postId: number;
  userId: string;
};

export default function LikeButton({
  postId,
  userId
}:LikeButtonProps) {

  const { isLiked, handleLike } = useLike(postId, userId)
  
  return (
    <button onClick={handleLike}>
      {isLiked
        ? <FavoriteIcon className="text-red-500" />
        : <FavoriteBorderIcon />
      }
    </button>
  )
}