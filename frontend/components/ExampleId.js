import React, {useState, useEffect} from "react";
import * as PropTypes from "prop-types";
import MapBase from "../components/global/MapBase";
import {GeoJSON, Polygon} from "react-leaflet";
export const DEFAULT_MAP_CENTER_LAT = 20.5937;
export const DEFAULT_MAP_CENTER_LNG = 78.9629;

const multiPolygon = [
    [
        [20.5536, 78.9681],
        [20.5530, 78.9681],
        [20.5530, 78.9695]
    ]
];
const fillBlueOptions = {fillColor: "blue"};

function geojsonLayer(geojson) {
    return geojson !== null ? (
        geojson["features"].map((feature) => {
            return (
                <GeoJSON
                    style={{
                        fillColor: "none",
                        color: "#20CCD7"
                    }}
                    key={feature.properties["DIST_CODE"]}
                    data={feature}
                />
            );
        })
    ) : <></>;
}

const ExampleId = ({id}) => {

    const [tracker, setTracker] = useState(0);

    const onButtonClick = () => {
        setTracker(previousState => previousState + 1);
    };

    const [mapData, setMapData] = useState(null);

    useEffect(() => {
        async function getGeojson() {
            const mapResponse = await fetch("/api/SDE_DATA_IN_F7DSTRBND_1991/10");
            const result = await mapResponse.json();
            if (!ignore) {
                setMapData(result);
            }
        }
    
        let ignore = false;
        getGeojson();
        return () => {
            ignore = true;
        };
    });

    return (
        <div className="example">
            <h1>This is the Example ID page.</h1>
            <p>
                This page demonstrates passing view parameters from Django to React
                and very simple state management.
            </p>
            <p>View params:</p>
            <ul className="list">
                <li>ID: {id}</li>
            </ul>
            <p>Example state: {tracker}</p>
            <button onClick={onButtonClick}>Add to tracker</button>
            <MapBase layers={{
                triangle: <Polygon pathOptions={fillBlueOptions} positions={multiPolygon} />,
                SDE_DATA_IN_F7DSTRBND_1991: geojsonLayer(mapData)
            }}/>
        </div>
    );
};

ExampleId.propTypes = {
    id: PropTypes.number
};

export default ExampleId;
