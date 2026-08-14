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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type DropDOwnMenuProps = {
  onEditSubmit: (data: PostFormData) => Promise<void>
  isEditOpen: boolean
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>
  isDeleteOpen: boolean
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>
  content: string
  setContent: Dispatch<SetStateAction<string>>
  onDelete: () => void
}

export default function PostDropDownMenu({
  onEditSubmit,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  content,
  setContent,
  onDelete
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
            <DropdownMenuItem
              onClick={() => {
                setIsDeleteOpen(true)
              }}
              className="text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* modal(edit) */}
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

      {/* modal(delete) */}
      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ポストを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              削除したポストは元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}