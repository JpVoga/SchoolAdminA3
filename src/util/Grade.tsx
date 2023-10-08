export interface IGradeData {
    id?: number;
    grade?: number;
    studentId: number;
    testId: number;
}

export class Grade implements IGradeData {
    private _id: number = 0;
    private _grade?: number = 0;
    private _studentId: number = 0;
    private _testId: number = 0;

    constructor(id: number, grade: number | null | undefined, studentId: number, testId: number) {
        this._id = Math.floor(id);
        this.grade = grade;
        this.studentId = studentId;
        this.testId = testId;
    }

    get id(): number {return this._id;}

    get grade(): number | undefined {return this._grade;}

    set grade(grade: number | null | undefined) {
        if (typeof(grade) === "number") {
            if ((grade < 0.0) || (grade > 10.0)) throw new Error("Grade must be from 0 to 10.");
            this._grade = (Math.round(grade * 100) / 100); // Round to two decimal places
        }
        else this._grade = undefined;
    }

    get studentId(): number {return this._studentId;}

    set studentId(studentId: number) {this._studentId = Math.floor(studentId);}

    get testId(): number {return this._testId;}

    set testId(testId: number) {this._testId = Math.floor(testId);}
}
export default Grade;