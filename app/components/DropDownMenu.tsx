'use client'

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Session } from '@supabase/supabase-js'
import PostForm, { PostFormData } from "./PostForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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
} from "@/components/ui/alert-dialog"

type DropDOwnMenuProps = {
  onEditSubmit: (data: PostFormData) => Promise<void>
  isEditOpen: boolean
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>
  isDeleteOpen: boolean
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>
  content: string
  setContent: Dispatch<SetStateAction<string>>
  ImageKey: string | null
  setImageKey: Dispatch<SetStateAction<string | null>> 
  ImageUrl: string | null
  setImageUrl: Dispatch<SetStateAction<string | null>> 
  handleImageUpload: (post: ChangeEvent<HTMLInputElement, Element>) => Promise<void>
  onDelete: () => void
  session: Session | null | undefined
  onEdit: () => void
  onDeleteClick: () => void
}

export default function PostDropDownMenu({
  onEditSubmit,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  content,
  ImageKey,
  setImageKey,
  ImageUrl,
  setImageUrl,
  handleImageUpload,
  setContent,
  onDelete,
  session,
  onEdit,
  onDeleteClick
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
              onClick={onEdit}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDeleteClick}
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
              ImageKey={ImageKey}
              setImageKey={setImageKey}
              ImageUrl={ImageUrl}
              setImageUrl={setImageUrl}
              handleImageUpload={handleImageUpload}
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