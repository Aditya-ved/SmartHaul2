import { cn } from "../../lib/utils";

function Alert({ className, variant = "default", ...props }) {
    const variants = {
        default: "bg-[#f7f7f7] text-[#5e5e5e]",
        success: "bg-[#dcf5e4] text-[#15803d]",
        destructive: "bg-[#fde4e4] text-[#b91c1c]",
    };
    return (
        <div
            role="alert"
            className={cn("rounded-[12px] px-4 py-3 text-sm", variants[variant], className)}
            {...props}
        />
    );
}

export { Alert };
