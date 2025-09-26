import Button from "../components/Button";

function ConfirmReportModal({ btnMessage, to, onClick}) {
    return (
        <div className="modal-bg">
            <div className="modal-info confirm-report-modal">
                <h1>Confirmation de signalement</h1>
                <p>Merci de contribuer à faire d'Urban Play un espace sain et convivial</p>
                <p>Ce signalement sera analysé par notre équipe de modération</p>
                <div className="btn-container">
                    <Button to={to} onClick={!to ? onClick : undefined}>{btnMessage}</Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmReportModal;