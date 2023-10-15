import React, {FormEvent, JSX, useId, useRef, useContext, useState} from "react";
import {IGradeData, globalContext, isError} from "../util";
import "../styles/gradeDataForm.scss";


export type GradeDataFormProps = {
    confirmAction: (grade: IGradeData) => void,
    cancelAction: () => void,
    confirmActionButtonText: string,
    cancelActionButtonText: string,
    gradeInitialValue?: number,
    studentIdFixedValue?: number,
    testIdFixedValue?: number
};


export function GradeDataForm(props: GradeDataFormProps): JSX.Element {
    const gradeInputId = useId();
    const studentSelectId = useId();
    const testSelectId = useId();
    const gradeInputRef = useRef<HTMLInputElement>(null);
    const studentSelectRef = useRef<HTMLSelectElement>(null);
    const testSelectRef = useRef<HTMLSelectElement>(null);
    const [isDataValid, setIsDataValid] = useState(true);
    const {students, tests, grades} = useContext(globalContext);

    function updateIsDataValid(): void {
        if (isError(students) || isError(tests) || (!tests) || (!students)) {
            setIsDataValid(false);
        }
        else {
            setIsDataValid(
                (students.filter(s => s.id === parseInt(studentSelectRef?.current?.value ?? "")).length > 0) &&
                (tests.filter(t => t.id === parseInt(testSelectRef?.current?.value ?? "")).length > 0)
            );
        }
    }

    function onSubmit(e: FormEvent): void {
        e.preventDefault();

        let grade: number | undefined;
        if (isNaN(parseFloat(gradeInputRef?.current?.value ?? ""))) {
            grade = undefined;
        }
        else grade = parseFloat(gradeInputRef?.current?.value ?? "0");

        const studentId = parseInt((studentSelectRef?.current?.value)!);

        const testId = parseInt((testSelectRef?.current?.value)!);

        props.confirmAction({grade, studentId, testId}); // TODO: Put in student and test ids!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        console.log(grade);
    }

    return (
        <form className="gradeDataForm" onSubmit={onSubmit}>
            <div className="gradeDataFormInputsArea">
                <div>
                    <label htmlFor={gradeInputId}>Nota: </label>
                    <input id={gradeInputId} className="dataFormInput" type="number" min={0} max={10} step={0.01} ref={gradeInputRef} defaultValue={props.gradeInitialValue} />
                </div>

                <div>
                    <label htmlFor={studentSelectId}>Aluno: </label>
                    <select id={studentSelectId} className="dataFormInput" ref={studentSelectRef} value={props.studentIdFixedValue} onChange={updateIsDataValid}>{
                        (Array.isArray(students)) && (
                            students.map(student => (
                                <option key={student.id} value={student.id}>({student.id}) {student.firstName} {student.lastName}</option>
                            ))
                        )
                    }</select>
                </div>

                <div>
                    <label htmlFor={testSelectId}>Avaliação: </label>
                    <select id={testSelectId} className="dataFormInput" ref={testSelectRef} value={props.testIdFixedValue} onChange={updateIsDataValid}>{
                        (Array.isArray(tests)) && (
                            tests.map(test => (
                                <option key={test.id} value={test.id}>({test.id}) {test.name}</option>
                            ))
                        )
                    }</select>
                </div>
            </div>

            <div className="gradeDataFormButtonsArea">
                <button className="dataFormButton" type="submit" disabled={!isDataValid}>{props.confirmActionButtonText}</button>
                <button className="dataFormButton" type="button" onClick={props.cancelAction}>{props.cancelActionButtonText}</button>
            </div>
        </form>
    );
}
export default GradeDataForm;