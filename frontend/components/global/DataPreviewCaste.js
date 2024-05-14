import React from "react";
import * as PropTypes from "prop-types";

import "../../scss/mapLegends.scss";

const DataPreview = ({dataToDisplay}) => {
    return (
        <div className="previewLegend">
            {dataToDisplay && (
                <div>
                    <div>
                        <span style={{fontWeight: "bold"}}>State: &nbsp;</span>
                        <span style={{fontWeight: "normal"}}>
                            {dataToDisplay.state_name.replace("_", " ")}
                        </span>
                    </div>
                    <div>
                        <span style={{fontWeight: "bold"}}>Constituency: &nbsp;</span>
                        <span style={{fontWeight: "normal"}}>
                            {dataToDisplay.constituency_name.charAt(0).toUpperCase() +
                                dataToDisplay.constituency_name.slice(1).toLowerCase()}
                        </span>
                    </div>
                    <div>
                        <span style={{fontWeight: "bold"}}>Top Caste: &nbsp;</span>
                        <span style={{fontWeight: "normal"}}>{dataToDisplay.top_caste}</span>
                    </div>
                    <div>
                        <span style={{fontWeight: "bold"}}>Percentage: &nbsp;</span>
                        <span style={{fontWeight: "normal"}}>
                            {dataToDisplay.top_caste_percentage}%
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
DataPreview.propTypes = {
    dataToDisplay: PropTypes.object
};
export default DataPreview;
