import React from "react";


import "../../scss/mapLegends.scss";

const GradientLegend = () => {
    // TO DO: make this a prop
    function getColor(value) {
        if (value > 70) {
            return "#E9EAE0";
        } else if (value > 50) {
            return "#F7BEC0";
        } else if (value > 40) {
            return "#FF8A8A";
        } else if (value > 30) {
            return "#FF5C5C";
        } else if (value > 20) {
            return "#FF2E2E";
        } else if (value > 10) {
            return "#FF0000";
        } else if (value > 5) {
            return "#D10000";
        } else if (value > 3) {
            return "#A30000";
        } else {
            return "#750000";
        }
    }

    const grades=[0,3,5,10,20,30,40,50,70];
    const title="Percent Margin";
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
