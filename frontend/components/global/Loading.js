import React from "react";

const Loading = () => {
    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{height: "100%"}}
        >
            <div className="spinner-border" role="status">
                <span className="visually-hidden-focusable">Loading...</span>
            </div>
        </div>
    );
};

export default Loading;
