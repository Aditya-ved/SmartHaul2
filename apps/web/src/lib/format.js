export const formatIndianCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const formatWeight = (value) =>
    `${Number(value || 0).toLocaleString("en-IN")} kg`;

export const formatIndianDate = (value) => {
    if (!value) return "Date unavailable";
    return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};
