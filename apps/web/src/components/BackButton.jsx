import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButton({ to, label = "Back", className = "" }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to);
            return;
        }

        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate("/");
    };

    return (
        <button
            type="button"
            onClick={handleBack}
            className={`inline-flex h-10 items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-3 text-sm font-medium text-[#5e5e5e] shadow-sm transition hover:border-[#d4d4d4] hover:bg-[#f7f7f7] hover:text-[#0a0a0a] ${className}`}
        >
            <ArrowLeft size={17} />
            {label}
        </button>
    );
}

export default BackButton;
