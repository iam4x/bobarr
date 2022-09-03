export function formatUrl(value: string) {
    return value.endsWith("/") ? value : value + "/"
}
