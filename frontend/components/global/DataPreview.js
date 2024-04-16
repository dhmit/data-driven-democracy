import React from 'react';
import * as PropTypes from "prop-types";

import "../../scss/mapLegends.scss";

const DataPreview = ({dataToDisplay}) => {
    return (
        <div className="previewLegend">
            {dataToDisplay && <div>
                <div>
                    <span style={{fontWeight:'bold'}}>

                        State: &nbsp;
                    </span>
                    <span style={{fontWeight:'normal'}}>
                        {dataToDisplay[0].state_name.replace("_", " ")}
                    </span>
                        </div>
                        <div>
                        <span style={{fontWeight:'bold'}}>
                            Constituency: &nbsp;
                        </span>
                        <span style={{fontWeight:'normal'}}>
                            {dataToDisplay[0].constituency_name.charAt(0).toUpperCase()+dataToDisplay[0].constituency_name.slice(1).toLowerCase()}
                        </span>
                        </div>
                        <div>

                        <span style={{fontWeight:'bold'}}>
                            Winning Party: &nbsp;
                        </span>
                        <span style={{fontWeight:'normal'}}>
                            {dataToDisplay[0].party_name}
                        </span>

                        </div>
                        <div>
                        <span style={{fontWeight:'bold'}}>
                            Margin: &nbsp;
                        </span>
                        <span style={{fontWeight:'normal'}}>
                            {dataToDisplay[0].margin_percentage}%
                        </span>
                        </div>
                        </div>

            }
        </div>
    );
};
DataPreview.propTypes = {

    dataToDisplay:PropTypes.array
};
export default DataPreview;
