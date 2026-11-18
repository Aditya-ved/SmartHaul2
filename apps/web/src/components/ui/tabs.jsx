import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = ({ className, ...props }) => (
    <TabsPrimitive.List
        className={cn("inline-flex h-10 items-center gap-1 rounded-full bg-[#efefef] p-1", className)}
        {...props}
    />
);

const TabsTrigger = ({ className, ...props }) => (
    <TabsPrimitive.Trigger
        className={cn(
            "inline-flex h-8 items-center justify-center rounded-full px-4 text-sm font-medium text-[#5e5e5e] transition data-[state=active]:bg-black data-[state=active]:text-white",
            className
        )}
        {...props}
    />
);

const TabsContent = ({ className, ...props }) => (
    <TabsPrimitive.Content className={cn("mt-4", className)} {...props} />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
