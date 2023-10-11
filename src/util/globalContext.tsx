import {ReactNode, Dispatch, SetStateAction, createContext} from "react";
import {Student, Test, Grade} from ".";

export type GlobalContext = {
    popUpBox: ReactNode,
    setPopUpBox: Dispatch<SetStateAction<ReactNode>>,

    students: Student[] | Error | null,
    setStudents: Dispatch<SetStateAction<Student[] | Error | null>>
};

export const globalContext = createContext<GlobalContext>(null!);
export default globalContext;