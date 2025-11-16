import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import {
  BoldIcon,
  CodeIcon,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  Quote,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react";

import { ReactNode, useState } from "react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Toggle } from "./ui/toggle";
import { FileUpload, FileUploader } from "./file-upload";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { cn } from "@/util/cn";

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3, 4, 5, 6],
    },
  }),
  Underline,
  Link.configure(),
  Highlight.configure(),
  TiptapImage,
];

export function TextEditor({
  content = "",
  onChange,
  toolbarClassName,
}: {
  content?: string;
  onChange?: (content: string) => void;
  toolbarClassName?: string;
}) {
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none max-w-none",
      },
    },
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="bg-background relative rounded-lg border shadow-sm">
      {editor && (
        <>
          <Toolbar editor={editor} toolbarClassName={toolbarClassName} />
          <BubbleMenu editor={editor} />
        </>
      )}

      <div className={cn("", editor ? "" : "animate-pulse")}>
        <EditorContent editor={editor} className="min-h-[300px] px-4 py-3" />
      </div>
    </div>
  );
}

function LinkComponent({
  editor,
  children,
}: {
  editor: Editor;
  children: ReactNode;
}) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const handleSetLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setIsLinkPopoverOpen(false);
    setLinkUrl("");
  };

  return (
    <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="flex flex-col gap-4">
          <h3 className="font-medium">Insert Link</h3>
          <Input
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSetLink();
              }
            }}
          />
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsLinkPopoverOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSetLink}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ImageComponent({
  editor,
  children,
}: {
  editor: Editor;
  children: ReactNode;
}) {
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);

  return (
    <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <FileUploader
          maxFilesCount={1}
          maxFileSize="5mb"
          accept={["image/*"]}
          onChange={(files) => {
            editor.chain().focus().setImage({ src: files[0].url }).run();

            setIsImagePopoverOpen(false);
          }}
        >
          <FileUpload />
        </FileUploader>
      </PopoverContent>
    </Popover>
  );
}

export function Toolbar({
  editor,
  toolbarClassName,
}: {
  editor: Editor;
  toolbarClassName?: string;
}) {
  const handleHeadingChange = (value: string) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number.parseInt(value.replace("heading", "")) as
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6;
      editor.chain().focus().setHeading({ level }).run();
    }
  };

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b p-2",
        toolbarClassName,
      )}
    >
      <Select
        onValueChange={handleHeadingChange}
        value={
          editor.isActive("heading", { level: 2 })
            ? "heading2"
            : editor.isActive("heading", { level: 3 })
              ? "heading3"
              : editor.isActive("heading", { level: 4 })
                ? "heading4"
                : editor.isActive("heading", { level: 5 })
                  ? "heading5"
                  : editor.isActive("heading", { level: 6 })
                    ? "heading6"
                    : "paragraph"
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Paragraph" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Paragraph</SelectItem>
          <SelectItem value="heading2">Heading 1</SelectItem>
          <SelectItem value="heading3">Heading 2</SelectItem>
          <SelectItem value="heading4">Heading 3</SelectItem>
          <SelectItem value="heading5">Heading 4</SelectItem>
          <SelectItem value="heading6">Heading 5</SelectItem>
        </SelectContent>
      </Select>

      <div className="bg-border mx-1 h-6 w-px" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <BoldIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <ItalicIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Toggle underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle strikethrough"
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("highlight")}
        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        aria-label="Toggle highlight"
      >
        <HighlighterIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        aria-label="Toggle code"
      >
        <CodeIcon className="h-4 w-4" />
      </Toggle>

      <div className="bg-border mx-1 h-6 w-px" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Toggle bullet list"
      >
        <ListIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle ordered list"
      >
        <ListOrderedIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Toggle blockquote"
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <div className="bg-border mx-1 h-6 w-px" />

      <LinkComponent editor={editor}>
        <Toggle
          size="sm"
          pressed={editor.isActive("link")}
          aria-label="Toggle link"
        >
          <LinkIcon className="h-4 w-4" />
        </Toggle>
      </LinkComponent>

      <ImageComponent editor={editor}>
        <Toggle
          size="sm"
          pressed={editor.isActive("image")}
          aria-label="Toggle link"
        >
          <ImageIcon className="h-4 w-4" />
        </Toggle>
      </ImageComponent>

      <div className="bg-border mx-1 h-6 w-px" />

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        aria-label="Undo"
      >
        <UndoIcon className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        aria-label="Redo"
      >
        <RedoIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function BubbleMenu({ editor }: { editor: Editor }) {
  return (
    <TiptapBubbleMenu
      editor={editor}
      className="bg-background flex items-center rounded-md border shadow-md"
    >
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <BoldIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <ItalicIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Toggle underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle strikethrough"
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        aria-label="Toggle code"
      >
        <CodeIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("highlight")}
        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        aria-label="Toggle highlight"
      >
        <HighlighterIcon className="h-4 w-4" />
      </Toggle>

      <LinkComponent editor={editor}>
        <Toggle
          size="sm"
          pressed={editor.isActive("link")}
          aria-label="Toggle link"
        >
          <LinkIcon className="h-4 w-4" />
        </Toggle>
      </LinkComponent>
    </TiptapBubbleMenu>
  );
}
