import { ChangeEvent, Dispatch, SetStateAction } from "react"

export type PostFormData = {
  content: string
  ImageKey?: string 
}

type PostFormProps = {
  content: string
  setContent: Dispatch<SetStateAction<string>>   
  onCreateSubmit: (data: PostFormData) => Promise<void>
  onEditSubmit: (data: PostFormData) => Promise<void>
  disabled?: boolean 
  ImageKey: string | null
  setImageKey: Dispatch<SetStateAction<string | null>>   
  ImageUrl: string
  handleImageUpload: (post: ChangeEvent<HTMLInputElement, Element>) => Promise<void>
}

export default function PostForm({
  content,
  setContent,
  ImageKey,
  setImageKey,
  ImageUrl,
  handleImageUpload,
  onCreateSubmit,
  onEditSubmit,
  disabled,
}:PostFormProps) {

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    await onCreateSubmit({
      content,
      ImageKey: ImageKey ?? undefined,
    })
}

  return (
    <div className="border-y border-y-gray-500 mt-5 py-3">
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

        <div>
          <label
            htmlFor="ImageKey"
          >
            画像
          </label>
          <input
            type="file"
            id="ImageKey"
            onChange={handleImageUpload}
          />
        </div>

        <div className="flex justify-end mr-3">
          <button
            type="submit"
            className="bg-gray-700 text-black rounded-3xl font-bold mt-3 px-4 py-2"
          >
            POST
          </button>
        </div>
      </form>
    </div>
  )
}