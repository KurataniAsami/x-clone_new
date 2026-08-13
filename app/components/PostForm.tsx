import { Dispatch, SetStateAction } from "react"

export type PostFormData = {
  content: string
  ImageKey?: string 
}

type CreatepostProps = {
  content: string
  setContent: Dispatch<SetStateAction<string>>   
  onCreateSubmit: (data: PostFormData) => Promise<void>
  disabled?: boolean 
}

export default function PostForm({
  content,
  setContent,
  onCreateSubmit,
  disabled
}:CreatepostProps) {

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    await onCreateSubmit({
      content,
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