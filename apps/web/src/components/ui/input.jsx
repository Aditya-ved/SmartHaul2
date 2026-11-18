import { cn } from "../../lib/utils";

const Input = ({ className, type = "text", ...props }) => (
    <input
        type={type}
        className={cn(
            "flex h-12 w-full rounded-[8px] border border-transparent bg-[#efefef] px-4 py-3 text-base outline-none transition focus:border-[#533afd] focus:bg-white focus:ring-2 focus:ring-[#533afd]/20",
            className
        )}
        {...props}
    />
);

export { Input };
