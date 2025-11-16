import { toast } from "sonner";
import { MoreHorizontalIcon } from "lucide-react";

import { useState } from "react";

import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useSearch } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { api } from "@/orpc/client";

export type Blog = {
  id: number;
  title: string;
  slug: string;
  status: string;
  category: string | null;
  author: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export const blogsTableColumns: ColumnDef<Blog>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge className="capitalize">{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "author",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {row.original.createdAt.toDateString()}
          </TooltipTrigger>
          <TooltipContent>
            {row.original.createdAt.toLocaleString()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {row.original.updatedAt.toDateString()}
          </TooltipTrigger>
          <TooltipContent>
            {row.original.updatedAt.toLocaleString()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "actions",
    cell: function CellComponent({ row }) {
      const blog = row.original;

      const queryClient = useQueryClient();
      const searchParams = useSearch({ from: "/admin/blogs" });

      const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
      const [actionsDropdownOpened, setActionsDropdownOpened] = useState(false);

      const titleWithId = `${row.original.title} #${row.original.id}`;

      const deleteMutation = useMutation(
        api.blogs.delete.mutationOptions({
          onError: (err) => {
            toast.error(err.message);
          },
          onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(
              api.blogs.all.queryOptions({
                input: { query: searchParams },
              }),
            );
          },
        }),
      );

      async function handleDeleteBlog() {
        setDeleteDialogOpened(false);
        setActionsDropdownOpened(false);

        await deleteMutation.mutateAsync({
          params: { id: blog.id },
        });
      }

      return (
        <DropdownMenu
          open={actionsDropdownOpened}
          onOpenChange={setActionsDropdownOpened}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/admin/blogs/$id/edit"
                params={{ id: blog.id.toString() }}
              >
                Edit
              </Link>
            </DropdownMenuItem>

            <AlertDialog
              open={deleteDialogOpened}
              onOpenChange={setDeleteDialogOpened}
            >
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure you want to delete{" "}
                    <strong>{titleWithId} blog?</strong>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete{" "}
                    <strong>{titleWithId}</strong> from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setActionsDropdownOpened(false)}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <Button variant="destructive" onClick={handleDeleteBlog}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
