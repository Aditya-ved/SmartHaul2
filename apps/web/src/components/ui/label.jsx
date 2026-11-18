import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../../lib/utils";

const Label = ({ className, ...props }) => (
    <LabelPrimitive.Root
        className={cn("text-sm font-medium leading-4 text-[#0a0a0a]", className)}
        {...props}
    />
);

export { Label };
