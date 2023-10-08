import {assertNameIsInLength} from ".";

export interface ITestData {
    id?: number;
    name: string;
}

export class Test implements ITestData {
    private _id: number = 0;
    private _name: string = "";

    constructor(id: number, name: string) {
        this._id = Math.floor(id);
        this.name = name;
    }

    public get id(): number {return this._id;}

    public get name(): string {return this._name;}

    public set name(name: string) {
        assertNameIsInLength(name);
        this._name = name;
    }
}
export default Test;