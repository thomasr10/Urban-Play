import Button from "./Button";

function ReportModal({ title, subtitle, activityName, btnMessage, to, onClick, onClose, reportOptions, value, onTextChange, reasonId, onReasonChange}) {

    return (
        <div className="modal-bg">
            <div className="modal-info report-modal">
                <span onClick={onClose} className="close-btn">X</span>
                <div>
                    <h1>{title}</h1>
                </div>
                <div className="report-modal-infos">
                    <span className="bold">{ subtitle }</span>
                    <span>{ activityName }</span>
                </div>
                <div className="report-modal-infos">
                    <span className="bold">Motif du signalement</span>
                    <select value={reasonId} onChange={onReasonChange}>
                        <option value="">Chosir un motif</option>
                        {
                            reportOptions.map((option) => (
                                <option value={option.id} key={option.id}>{ option.name }</option>
                            ))
                        }
                    </select>
                </div>
                <div className="report-modal-msg">
                    <span className="bold">Commentaire</span>
                    <textarea value={value} onChange={onTextChange}></textarea>
                </div>
                <div className="btn-container">
                    <Button to={to} onClick={!to ? onClick : undefined}>{btnMessage}</Button>
                </div>
            </div>
        </div>
    )
}

export default ReportModal;