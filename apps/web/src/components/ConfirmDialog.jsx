import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirm",
    destructive = false,
    onConfirm,
    loading = false
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[420px]">
                <DialogHeader>
                    <div className={`mb-2 flex h-11 w-11 items-center justify-center rounded-full ${destructive ? "bg-[#fde4e4] text-[#b91c1c]" : "bg-[#ecebff] text-[#533afd]"}`}>
                        <AlertTriangle size={20} />
                    </div>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
                    <Button variant={destructive ? "destructive" : "default"} onClick={onConfirm} disabled={loading}>
                        {loading ? "Please wait..." : confirmLabel}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmDialog;