export * from "./Student";
export * from "./Test";
export * from "./Grade";
export * from "./globalContext";

export const nameMaxLength = 50;
export const itemsPerPage = 10;

export function getCurrentPageNumber(): number {
    let pageNumber = parseInt(((new URL(document.URL)).searchParams.get("page")) ?? "1");
    if (isNaN(pageNumber)) pageNumber = 1;
    return pageNumber;
}

export function assertNameIsInLength(name: string): void {
    if ((name.length <= 0) || (name.length > nameMaxLength)) {
        throw new Error(`Name must be at least 1 character long and at most ${nameMaxLength} characters long.`);
    }
}

export function isError(x: any): x is Error {
    return ((x != null) && (typeof x.name === "string") && (typeof x.message === "string"));
}

export function filterForPage<T,>(array: T[]): T[] {
    return array.filter((value, index) => ((index >= ((getCurrentPageNumber() - 1) * itemsPerPage)) && (index < (getCurrentPageNumber() * itemsPerPage))));;
}