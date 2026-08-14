'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PostForm, { PostFormData } from "./PostForm";
import { useState } from "react";

type DropDOwnMenuProps = {
  onEditSubmit: (data: PostFormData) => Promise<void>
}

export default function PostDropDownMenu({
  onEditSubmit
  }:DropDOwnMenuProps){

  const [content, setContent] = useState('')

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizIcon 
            className="mr-3"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Edit
              <PostForm
                onEditSubmit={onEditSubmit}
                content={content}
                setContent={setContent}
              />
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}