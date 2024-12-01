export const formatNumber = (value: string, decimal: number) => {
    return parseFloat(value || "0")?.toFixed(decimal)
}