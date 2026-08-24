import { ChangeEvent, Dispatch, SetStateAction } from "react"
import ImageIcon from '@mui/icons-material/Image';

export type PostFormData = {
  content: string
  ImageKey?: string 
  ImageUrl?: string 
}

type PostFormProps = {
  content: string
  setContent: Dispatch<SetStateAction<string>>   
  onCreateSubmit: (data: PostFormData) => Promise<void>
  onEditSubmit: (data: PostFormData) => Promise<void>
  disabled?: boolean 
  ImageKey: string | null
  setImageKey: Dispatch<SetStateAction<string | null>>   
  ImageUrl: string | null
  setImageUrl: Dispatch<SetStateAction<string | null>>
  handleImageUpload: (post: ChangeEvent<HTMLInputElement, Element>) => Promise<void>
}

export default function PostForm({
  content,
  setContent,
  ImageKey,
  ImageUrl,
  handleImageUpload,
  onCreateSubmit,
  disabled,
}:PostFormProps) {

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    await onCreateSubmit({
      content,
      ImageKey: ImageKey ?? undefined,
      ImageUrl: ImageUrl ?? undefined,
    })
}

  return (
    <div className=" mt-5 py-3">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="focus:outline-none"
            disabled={disabled}
            placeholder="今どうしてる？"
          />
        </div>

        <div className="flex justify-between items-center border-t border-t-gray-500 mt-2 pt-4">
          <label htmlFor="ImageKey">
            <ImageIcon/>
          </label>
          <input
            type="file"
            id="ImageKey"
            onChange={handleImageUpload}
            className="sr-only"
          />

          <button
            type="submit"
            className="bg-gray-700 text-black rounded-3xl font-bold px-3 py-1 mt-3"
          >
            POST
          </button>
        </div>
      </form>
    </div>
  )
}