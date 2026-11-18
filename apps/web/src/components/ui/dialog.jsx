import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = ({ className, ...props }) => (
    <DialogPrimitive.Overlay
        className={cn("fixed inset-0 z-50 bg-black/50", className)}
        {...props}
    />
);

const DialogContent = ({ className, children, ...props }) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            className={cn(
                "fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-32px)] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[16px] border border-[#e5e5e5] bg-white p-6 shadow-[0_8px_24px_rgba(10,20,60,0.08)]",
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#efefef] text-[#5e5e5e]">
                <X size={18} />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
);

const DialogHeader = ({ className, ...props }) => (
    <div className={cn("flex flex-col gap-2 pr-10", className)} {...props} />
);

const DialogTitle = ({ className, ...props }) => (
    <DialogPrimitive.Title className={cn("text-[22px] font-semibold", className)} {...props} />
);

const DialogDescription = ({ className, ...props }) => (
    <DialogPrimitive.Description className={cn("text-sm text-[#5e5e5e]", className)} {...props} />
);

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose };
