import {assertNameIsInLength} from ".";

export interface IStudentData {
    id?: number;
    firstName: string;
    lastName: string;
}

export class Student implements IStudentData {
    private _id: number = 0;
    private _firstName: string = "";
    private _lastName: string = "";

    constructor(id: number, firstName: string, lastName: string) {
        this._id = Math.floor(id);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public get id(): number {return this._id;}

    public get firstName() {return this._firstName;}

    public set firstName(firstName: string) {
        assertNameIsInLength(firstName);
        this._firstName = firstName;
    }

    public get lastName() {return this._lastName;}

    public set lastName(lastName: string) {
        assertNameIsInLength(lastName);
        this._lastName = lastName;
    }
}
export default Student;