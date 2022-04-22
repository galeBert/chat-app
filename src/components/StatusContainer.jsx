const StatusContainer = ({ children, ...props }) => {

    return (
        <div id={props.id} className={`status-container text-center ${children ? (children.toLowerCase() === "active" ? "bg-yellow-100" : (children !== "Flag" || children !== "Banned") ? "bg-primary-100" : "bg-red-100") : ""}`}>
            {props.loading ? (
                <div className="flex-center">
                    <div className="loading w-4 h-4" />
                </div>
            ) : <span>{children}</span>}
        </div>
    );
}

export default StatusContainer;