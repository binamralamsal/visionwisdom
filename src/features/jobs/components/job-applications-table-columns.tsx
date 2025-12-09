import { toast } from "sonner";
import {
  FileBadge2,
  FileHeart,
  FileText,
  MoreHorizontalIcon,
} from "lucide-react";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Link, useSearch } from "@tanstack/react-router";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import { cn } from "@/util/cn";
import { api } from "@/orpc/client";

type UploadedFile = {
  id: number;
  name: string | null;
  url: string | null;
  fileType: string | null;
};

export type JobApplicationRow = {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  preferredCountries?: string | null;
  preferredPosition?: string | null;
  resumeFileId?: number | null;
  passportFileId?: number | null;
  medicalReportFileId?: number | null;
  resumeFile?: UploadedFile | null;
  passportFile?: UploadedFile | null;
  medicalReportFile?: UploadedFile | null;
  createdAt: Date;
  updatedAt: Date;
};

export const jobApplicationsTableColumns: ColumnDef<JobApplicationRow>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicant" />
    ),
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <div className="text-sm font-medium">{row.original.name}</div>
        <div className="text-muted-foreground text-xs">
          {row.original.email} · {row.original.phone}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "preferredPosition",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preferred Position" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.preferredPosition || "—"}</span>
    ),
  },
  {
    accessorKey: "preferredCountries",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preferred Countries" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-2 text-xs">
        {row.original.preferredCountries || "—"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applied At" />
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-xs">
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
          <TooltipTrigger className="text-xs">
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
    id: "documents",
    header: () => <span className="text-xs font-medium">Documents</span>,
    cell: ({ row }) => {
      const { resumeFile, passportFile, medicalReportFile } = row.original;

      return (
        <div className="flex flex-wrap gap-1.5">
          <DocBadge icon={FileText} label="CV" file={resumeFile} />
          <DocBadge icon={FileBadge2} label="Passport" file={passportFile} />
          <DocBadge icon={FileHeart} label="Medical" file={medicalReportFile} />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: function CellComponent({ row }) {
      const app = row.original;

      const queryClient = useQueryClient();
      const searchParams = useSearch({ from: "/admin/job-applications" });

      const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
      const [actionsDropdownOpened, setActionsDropdownOpened] = useState(false);

      const titleWithId = `${app.name} #${app.id}`;

      const deleteMutation = useMutation(
        api.jobApplications.delete.mutationOptions({
          onError: (err) => {
            toast.error(err.message);
          },
          onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(
              api.jobApplications.all.queryOptions({
                input: { query: searchParams },
              }),
            );
          },
        }),
      );

      async function handleDeleteApplication() {
        setDeleteDialogOpened(false);
        setActionsDropdownOpened(false);

        await deleteMutation.mutateAsync({
          params: { id: app.id },
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

            {/* Optional: detailed view route */}
            {/* <DropdownMenuItem asChild>
              <Link
                to="/admin/job-applications/$id"
                params={{ id: app.id.toString() }}
              >
                View details
              </Link>
            </DropdownMenuItem> */}

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
                    Are you sure you want to delete{" "}
                    <strong>{titleWithId} application?</strong>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete{" "}
                    <strong>{titleWithId}</strong> from our records.
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
                    onClick={handleDeleteApplication}
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

function isImage(file: UploadedFile | null | undefined) {
  if (!file) return false;
  const type = file.fileType?.toLowerCase() || "";
  const url = file.url?.toLowerCase() || "";
  return (
    type.startsWith("image/") ||
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".webp") ||
    url.endsWith(".gif")
  );
}

function isPdf(file: UploadedFile | null | undefined) {
  if (!file) return false;
  const type = file.fileType?.toLowerCase() || "";
  const url = file.url?.toLowerCase() || "";
  return type === "application/pdf" || url.endsWith(".pdf");
}

function DocBadge({
  icon: Icon,
  label,
  file,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  file?: UploadedFile | null;
}) {
  const active = !!file && !!file.url;

  if (!active) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]",
          "border-muted bg-muted/40 text-muted-foreground",
        )}
      >
        <Icon className="h-3 w-3" />
        <span>{label}</span>
        <span className="text-[10px] opacity-70">—</span>
      </span>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]",
            "border-emerald-500/60 bg-emerald-50 text-emerald-700",
            "dark:bg-emerald-950/40 dark:text-emerald-300",
            "hover:border-primary hover:bg-primary/5 transition-colors",
          )}
        >
          <Icon className="h-3 w-3" />
          <span className="max-w-[80px] truncate">{label}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-full max-w-md overflow-hidden sm:max-w-xl lg:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{label} preview</DialogTitle>
          <DialogDescription className="truncate">
            {file?.name || file?.url}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/40 mt-4 rounded-md border p-2">
          {isImage(file) && file?.url && (
            <div className="bg-background flex max-h-[60vh] items-center justify-center overflow-auto rounded-md">
              <img
                src={file.url}
                alt={file.name || label}
                className="max-h-[60vh] max-w-full object-contain"
              />
            </div>
          )}

          {isPdf(file) && file?.url && (
            <div className="bg-background h-[60vh] w-full overflow-hidden rounded-md">
              <iframe
                src={file.url}
                title={file.name || label}
                className="h-full w-full"
              />
            </div>
          )}

          {!isImage(file) && !isPdf(file) && (
            <div className="flex flex-col items-start gap-2 p-2 text-sm">
              <p className="font-medium">
                Preview not available for this file type.
              </p>
              <p className="text-muted-foreground text-xs">
                You can still download the file using the button below.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            asChild
            className="w-full justify-center sm:w-auto"
          >
            <a
              href={file?.url || "#"}
              download
              target="_blank"
              rel="noreferrer"
            >
              Download {label}
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
