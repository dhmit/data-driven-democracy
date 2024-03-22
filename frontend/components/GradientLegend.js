import React from "react";
import * as PropTypes from "prop-types";
import "../scss/legend.scss";


export default function GradientLegend({
    colorMap
}) {

    return (
        <div className="legend">
            {/* {Object.keys(colorMap).map((color)=>{
                <div>
                <div>
                    COLOR
                </div>
                <div>
                    RANGE
                </div>
                </div>

            })

            } */}
        </div>
    );
}

GradientLegend.propTypes = {
    colorMap: PropTypes.object
};
