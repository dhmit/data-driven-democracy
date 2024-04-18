import React from "react";
import * as PropTypes from "prop-types";
import "../../scss/legend.scss";

export default function Legend({layers, visibleLayers, toggleLayer}) {
    return (
        <div className="legend">
            <ul>
                {layers.map((layer) => {
                    return (
                        <li key={layer}>
                            <button
                                value={layer}
                                onClick={(e) => toggleLayer(e)}
                                className={`legend-square
                            ${layer.toLowerCase()}
                            ${visibleLayers.indexOf(layer) > -1 ? "" : "inactive"}`}
                            />
                            <span className={"label"}>{layer}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

Legend.propTypes = {
    layers: PropTypes.array,
    visibleLayers: PropTypes.array,
    toggleLayer: PropTypes.func
};
