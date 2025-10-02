export function encodeCursor(obj) {
    return btoa(JSON.stringify(obj));
}

export function decodeCursor(cursor) {
    try {
        return JSON.parse(atob(cursor));
    } catch {
        return null;
    }
}
