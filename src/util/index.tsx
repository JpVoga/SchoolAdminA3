export * from "./Student";
export * from "./Test";
export * from "./Grade";

export const nameMaxLength = 50;

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