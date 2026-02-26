/**
 * Converts a string to PascalCase.
 */
export function toPascalCase(str: string): string {
    return str
        .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
        .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Simplistic singularization for the MVP.
 * Removes trailing 's' if present.
 */
export function singularize(str: string): string {
    if (str.endsWith('s') && str.length > 1) {
        return str.slice(0, -1);
    }
    return str;
}
