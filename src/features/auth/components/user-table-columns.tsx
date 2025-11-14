import { toast } from "sonner";
import { MoreHorizontalIcon, ShieldIcon, UserIcon } from "lucide-react";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Link, useSearch } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
};

export const userTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <Badge className="inline-flex gap-1 py-1 capitalize">
        {row.original.role === "admin" ? (
          <ShieldIcon className="h-4 w-4" />
        ) : (
          <UserIcon className="h-4 w-4" />
        )}
        <span>{row.original.role}</span>
      </Badge>
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
      const user = row.original;

      const queryClient = useQueryClient();
      const searchParams = useSearch({ from: "/admin/users" });

      const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
      const [actionsDropdownOpened, setActionsDropdownOpened] = useState(false);

      const { data } = useQuery(api.users.current.user.queryOptions());

      const isDeletingCurrentUser = data?.user.id === user.id;
      const nameWithId = `${row.original.name} #${row.original.id}`;

      const deleteUserMutation = useMutation(
        api.users.admin.delete.mutationOptions({
          onSuccess: async (response) => {
            toast.success(response.message);
            await queryClient.invalidateQueries(
              api.users.admin.all.queryOptions({
                input: { query: searchParams },
              }),
            );
          },
          onError: (response) => {
            toast.error(response.message);
          },
        }),
      );

      async function handleDeleteUser() {
        setDeleteDialogOpened(false);
        setActionsDropdownOpened(false);

        await deleteUserMutation.mutateAsync({ params: { id: user.id } });
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
              <Link to="/admin/users/$id" params={{ id: user.id.toString() }}>
                Edit
              </Link>
            </DropdownMenuItem>
            {!isDeletingCurrentUser && (
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
                      <strong>{nameWithId} user?</strong>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      <strong>{nameWithId}</strong> from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setActionsDropdownOpened(false)}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <Button variant="destructive" onClick={handleDeleteUser}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
