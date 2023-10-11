import React, {FormEvent, JSX} from "react";
import "../styles/confirmDialog.scss";


export type ConfirmDialogProps = {
    confirmAction: () => void,
    cancelAction: () => void,
    mainText: string,
    confirmActionButtonText?: string,
    cancelActionButtonText?: string
};


export function ConfirmDialog(props: ConfirmDialogProps): JSX.Element {
    return (
        <div className="confirmDialog">
            <div className="confirmDialogMainText">{props.mainText}</div>

            <div className="confirmDialogButtonsArea">
                <button className="yesButton" type="button" onClick={props.confirmAction}>{props.confirmActionButtonText ?? "Sim"}</button>
                <button className="noButton" type="button" onClick={props.cancelAction}>{props.cancelActionButtonText ?? "Não"}</button>
            </div>
        </div>
    );
}
export default ConfirmDialog;