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
import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"

type DropDOwnMenuProps = {
  onEditSubmit: (data: PostFormData) => Promise<void>
  isEditOpen: boolean
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>
  content: string
  setContent: Dispatch<SetStateAction<string>>
}

export default function PostDropDownMenu({
  onEditSubmit,
  isEditOpen,
  setIsEditOpen,
  content,
  setContent
  }:DropDOwnMenuProps){

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
            <DropdownMenuItem
              onClick={() => {
                setIsEditOpen(true)
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* modal */}
      <Dialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      >
        <DialogContent className="pb-5">
          <DialogHeader>
            <p>ポストを編集</p>
            <PostForm
              onEditSubmit={onEditSubmit}
              onCreateSubmit={onEditSubmit}
              content={content}
              setContent={setContent}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}