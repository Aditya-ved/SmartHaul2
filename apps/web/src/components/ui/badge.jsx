import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
    {
        variants: {
            variant: {
                pending: "bg-[#fff4d6] text-[#8a5a00]",
                booked: "bg-[#e3edff] text-[#1d4ed8]",
                transit: "bg-[#efe6ff] text-[#6d28d9]",
                delivered: "bg-[#dcf5e4] text-[#15803d]",
                rejected: "bg-[#fde4e4] text-[#b91c1c]",
                neutral: "bg-[#efefef] text-[#5e5e5e]",
            },
        },
        defaultVariants: {
            variant: "neutral",
        },
    }
);

function Badge({ className, variant, ...props }) {
    return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
