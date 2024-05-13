import React from "react";

import "../../scss/mapLegends.scss";
import * as PropTypes from "prop-types";

const GradientLegend = ({grades, labels, getColor, title}) => {
    // TO-DO: make these variables props
    return (
        <div className="gradientLegend">
            <p>{title}</p>
            {grades.map((grade, index) => (
                <div key={index}>
                    <i style={{background: getColor(grade + 1)}}></i>
                    {labels[grade]}
                </div>
            ))}
        </div>
    );
};

GradientLegend.propTypes = {
    grades: PropTypes.array,
    labels: PropTypes.object,
    getColor: PropTypes.func,
    title: PropTypes.string
};

export default GradientLegend;
