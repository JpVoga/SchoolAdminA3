import {assertNameIsValid} from ".";

export interface IStudentData {
    id?: number;
    firstName: string;
    lastName: string;
}

export class Student implements IStudentData {
    private _id: number = 0;
    private _firstName: string = "";
    private _lastName: string = "";

    static fromData(data: IStudentData): Student {
        if (!data.id) throw new Error("Id is required");
        return new Student(data.id, data.firstName, data.lastName);
    }

    constructor(id: number, firstName: string, lastName: string) {
        this._id = Math.floor(id);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public get id(): number {return this._id;}

    public get firstName() {return this._firstName;}

    public set firstName(firstName: string) {
        assertNameIsValid(firstName);
        this._firstName = firstName;
    }

    public get lastName() {return this._lastName;}

    public set lastName(lastName: string) {
        assertNameIsValid(lastName);
        this._lastName = lastName;
    }
}
export default Student;