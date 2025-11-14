import { toast } from "sonner";
import { MoreHorizontalIcon } from "lucide-react";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { useSearch } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export type ContactEntry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};

export const contactEntriesTableColumns: ColumnDef<ContactEntry>[] = [
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
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    id: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => {
      const { message, name } = row.original;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              View Message
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>{name}&apos;s message</DialogTitle>
            {message}
          </DialogContent>
        </Dialog>
      );
    },
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
      const contactEntry = row.original;

      const queryClient = useQueryClient();
      const searchParams = useSearch({ from: "/admin/contact-entries" });

      const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
      const [actionsDropdownOpened, setActionsDropdownOpened] = useState(false);

      const nameWithId = `${row.original.name} #${row.original.id}`;

      const deleteMutation = useMutation(
        api.contact.delete.mutationOptions({
          onError: (err) => {
            toast.error(err.message);
          },
          onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(
              api.contact.all.queryOptions({ input: { query: searchParams } }),
            );
          },
        }),
      );

      async function handleDeleteContactEntry() {
        setDeleteDialogOpened(false);
        setActionsDropdownOpened(false);

        await deleteMutation.mutateAsync({
          params: { id: contactEntry.id },
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
                    <strong>{nameWithId}?</strong>
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
                  <Button
                    variant="destructive"
                    onClick={handleDeleteContactEntry}
                  >
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
