export interface CrudStamp {
    /** created (acts as member of id. don't modify after creation) */
    c: string;
    u?: string;
    d?: string;
    /** construction index to resolve simultaneously constructed items */
    i: number;
}