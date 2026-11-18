import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#533afd] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
    {
        variants: {
            variant: {
                default: "bg-black text-white hover:bg-[#282828]",
                secondary: "border border-[#e5e5e5] bg-white text-[#0a0a0a] hover:bg-[#f7f7f7]",
                subtle: "bg-[#efefef] text-[#0a0a0a] hover:bg-[#e2e2e2]",
                destructive: "bg-[#fde4e4] text-[#b91c1c] hover:bg-[#fbd0d0]",
                ghost: "text-[#5e5e5e] hover:bg-[#f7f7f7] hover:text-[#0a0a0a]",
                link: "text-[#533afd] underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-5",
                lg: "h-14 px-6 text-[18px]",
                sm: "h-9 px-4",
                icon: "h-10 w-10 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
