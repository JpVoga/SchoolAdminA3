import {ReactNode, Dispatch, SetStateAction, createContext} from "react";

export type GlobalContext = {
    popUpBox: ReactNode,
    setPopUpBox: Dispatch<SetStateAction<ReactNode>>
};

export const globalContext = createContext<GlobalContext>(null!);
export default globalContext;