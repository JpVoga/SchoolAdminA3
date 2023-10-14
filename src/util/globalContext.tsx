import {ReactNode, Dispatch, SetStateAction, createContext} from "react";
import {Student, Test, Grade} from ".";

export type GlobalContext = {
    popUpBox: ReactNode,
    setPopUpBox: Dispatch<SetStateAction<ReactNode>>,

    students: Student[] | Error | null,
    setStudents: Dispatch<SetStateAction<Student[] | Error | null>>,

    tests: Test[] | Error | null,
    setTests: Dispatch<SetStateAction<Test[] | Error | null>>,

    grades: Grade[] | Error | null,
    setGrades: Dispatch<SetStateAction<Grade[] | Error | null>>
};

export const globalContext = createContext<GlobalContext>(null!);
export default globalContext;