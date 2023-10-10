import React, {FormEvent, JSX, useId, useRef} from "react";
import {ITestData} from "../util";
import "../styles/testDataForm.scss";


export type TestDataFormProps = {
    confirmAction: (testData: ITestData) => void,
    cancelAction: () => void,
    confirmActionButtonText: string,
    cancelActionButtonText: string
};


export function TestDataForm(props: TestDataFormProps): JSX.Element {
    const testNameInputId = useId();
    const testNameInputRef = useRef<HTMLInputElement>(null);

    function onSubmit(e: FormEvent): void {
        e.preventDefault();
        props.confirmAction({name: testNameInputRef?.current?.value ?? ""});
    }

    return (
        <form className="testDataForm" onSubmit={onSubmit}>
            <div className="testDataFormInputsArea">
                <div>
                    <label htmlFor={testNameInputId}>Nome: </label>
                    <input className="dataFormInput" type="text" ref={testNameInputRef} />
                </div>
            </div>

            <div className="testDataFormButtonsArea">
                <button type="submit" className="dataFormButton">{props.confirmActionButtonText}</button>
                <button type="button" className="dataFormButton" onClick={props.cancelAction}>{props.cancelActionButtonText}</button>
            </div>
        </form>
    );
}
export default TestDataForm;