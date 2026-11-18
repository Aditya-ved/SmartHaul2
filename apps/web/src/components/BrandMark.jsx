function BrandMark({ className = "", compact = false }) {
    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center bg-black text-white ${compact ? "h-9 w-9 rounded-full" : "h-10 w-10 rounded-[12px]"} ${className}`}
            aria-label="SmartHaul"
        >
            <svg
                width={compact ? 20 : 22}
                height={compact ? 20 : 22}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
            >
                <path d="M5 7.5C5 5.57 6.57 4 8.5 4H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M19 16.5C19 18.43 17.43 20 15.5 20H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M19 4V8.5C19 10.43 17.43 12 15.5 12H8.5C6.57 12 5 13.57 5 15.5V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="5" cy="4" r="2" fill="currentColor" />
                <circle cx="19" cy="20" r="2" fill="currentColor" />
            </svg>
        </span>
    );
}

export default BrandMark;
