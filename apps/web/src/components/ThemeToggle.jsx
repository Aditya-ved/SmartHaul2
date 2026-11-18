import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

function ThemeToggle({ iconOnly = true, className = "" }) {
    const [theme, setTheme] = useState(() => localStorage.getItem("smarthaul_theme") || "light");

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("smarthaul_theme", theme);
        window.dispatchEvent(new CustomEvent("theme-change", { detail: theme }));
    }, [theme]);

    useEffect(() => {
        const syncTheme = (event) => {
            if (event.detail === "light" || event.detail === "dark") {
                setTheme(event.detail);
            }
        };
        window.addEventListener("theme-change", syncTheme);
        return () => window.removeEventListener("theme-change", syncTheme);
    }, []);

    const toggle = () => setTheme((current) => current === "dark" ? "light" : "dark");

    return (
        <Button
            type="button"
            variant="secondary"
            size={iconOnly ? "icon" : "default"}
            className={className}
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {!iconOnly && <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
        </Button>
    );
}

export default ThemeToggle;
