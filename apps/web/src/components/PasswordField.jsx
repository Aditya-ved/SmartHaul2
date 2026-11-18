import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";

function PasswordField({ id, name, value, onChange, placeholder, required, minLength }) {
    const [visible, setVisible] = useState(false);
    return (
        <div className="relative">
            <Input
                id={id}
                name={name}
                type={visible ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                minLength={minLength}
                className="pr-12"
            />
            <button
                type="button"
                onClick={() => setVisible((current) => !current)}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#5e5e5e] hover:bg-[#efefef]"
                aria-label={visible ? "Hide password" : "Show password"}
            >
                {visible ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
        </div>
    );
}

export default PasswordField;
