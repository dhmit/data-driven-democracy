import React from "react";

import "../../scss/mapLegends.scss";

const GradientLegend = () => {
    // TO-DO: make these variables props
    function getColor(value) {
        if (value > 30) {
            return "#FFD6D6";
        } else if (value > 20) {
            return "#FFB5B5";
        } else if (value > 10) {
            return "#FF8383";
        } else if (value > 7) {
            return "#FF5C5C";
        } else if (value > 5) {
            return "#FF2E2E";
        } else if (value > 3) {
            return "#FF0000";
        } else if (value > 2) {
            return "#D10000";
        } else if (value > 1) {
            return "#A30000";
        } else {
            return "#750000";
        }
    }

    const grades = [0, 1, 2, 3, 5, 7, 10, 20, 30];
    const title = "Percent Margin";
    return (
        <div className="gradientLegend">
            <p>{title}</p>
            {grades.map((grade, index) => (
                <div key={index}>
                    <i style={{background: getColor(grade + 1)}}></i>
                    {grade}%
                </div>
            ))}
        </div>
    );
};

export default GradientLegend;
