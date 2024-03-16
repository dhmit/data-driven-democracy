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
        [20.5530, 78.9695],
    ]
];
const fillBlueOptions = { fillColor: 'blue' };
function getColor(value){
    if (value >70){
        return "#E9EAE0";
    }
    else if (value>50){
        return "#F7BEC0";
    }
    else if (value>40){
        return "#FF8A8A";
    }
    else if (value>30){
        return "#FF5C5C";

    }
    else if (value>20){
        return "#FF2E2E";
    }
    else if (value>10){
        return "#FF0000";
    }
    else if (value>5){
        return "#D10000";
    }
    else if (value >3){
        return "#A30000";
    }
    else {
        return "#750000";
    }
}
function geojsonLayer(geojson,year) {
    return geojson !== null ? (
        geojson["features"].map((feature) => {
            let color="white";

            const state=feature["properties"]["State_Name"];
            const constituency=feature["properties"]["Constituency_Name"];
            console.log(state,"HI",constituency);
            async function getData() {

                const dataResponse = await fetch(`/api/ls-elections/2019/${state}/${constituency}`);
                const result = await dataResponse.json();

                if (result){

                    console.log("HI",result);

                    if (result.length>0){
                        color = getColor(result[0]["margin_percentage"]);
                        console.log(color);

                    }
                    return result;
                }
                return (
                    <GeoJSON
                        style={{
                            fillColor: color,
                            color: "#20CCD7",
                        }}
                        key={feature.properties["DIST_CODE"]}
                        data={feature}
                    />
                );

            }
            return getData();


        })
    ) : <></>;
}

const ExampleId = ({id}) => {

    const [tracker, setTracker] = useState(0);

    const onButtonClick = () => {
        setTracker(previousState => previousState + 1);
    };

    const [mapData, setMapData] = useState(null);
    const [mapValuesData,setMapValuesData] = useState(null);

    const [electionYear,setElectionYear]=useState(2019);

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

    },[electionYear]);





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
                SDE_DATA_IN_F7DSTRBND_1991: geojsonLayer(mapData,electionYear)
            }}/>
        </div>
    );
};

ExampleId.propTypes = {
    id: PropTypes.number
};

export default ExampleId;
