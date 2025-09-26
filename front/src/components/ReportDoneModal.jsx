import Button from "./Button";
import { BadgeCheck } from "lucide-react";

function ReportDoneModal({ onClose }) {

    return (
        <div className="modal-bg">
            <div className="modal-info report-done-modal">
                <div className="icon-container">
                    <BadgeCheck className="icon" />
                </div>
                <p>Signalement confirmé</p>
                <div className="btn-container">
                    <Button children={'Retour'} onClick={onClose}></Button>
                </div>
            </div>
        </div>
    )
}

export default ReportDoneModal;