import { cn } from "../../lib/utils";

function Card({ className, ...props }) {
    return <div className={cn("rounded-[16px] border border-[#e5e5e5] bg-white", className)} {...props} />;
}

function CardHeader({ className, ...props }) {
    return <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
    return <h3 className={cn("text-[22px] font-semibold leading-[30px]", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
    return <p className={cn("text-sm text-[#5e5e5e]", className)} {...props} />;
}

function CardContent({ className, ...props }) {
    return <div className={cn("p-6 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
    return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
