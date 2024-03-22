import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import MapBase from "../components/global/MapBase";
import { GeoJSON, Polygon } from "react-leaflet";
export const DEFAULT_MAP_CENTER_LAT = 20.5937;
export const DEFAULT_MAP_CENTER_LNG = 78.9629;

const multiPolygon = [
    [
        [20.5536, 78.9681],
        [20.553, 78.9681],
        [20.553, 78.9695],
    ],
];
const fillBlueOptions = { fillColor: "blue" };
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

const ExampleId = ({ id }) => {
    // set your entire OBJECT (array of FEATURES) here
    const [features, setFeatures] = useState(null);
    const[constituencyData,setConstituencyData]=useState(null);
    const [tracker, setTracker] = useState(0);

    const onButtonClick = () => {
        setTracker((previousState) => previousState + 1);
    };

    const [mapData, setMapData] = useState(null);

    const [electionYear, setElectionYear] = useState(2019);
    const [displayData, setDisplayData] = useState(null);

    const onEachFeature = (feature, layer) => {
        layer.on({
            click:()=>{
                // if (constituencyData[e.target.feature.id].length>0){
                //     console.log(constituencyData[e.target.feature.id]);
                //     setDisplayData(constituencyData[e.target.feature['id']]);
                // }
                // else{
                //     setDisplayData(null);
                // }

            },
            mouseover: (e) => {
                // Highlight feature and display data on hover
                layer.setStyle({ color: "white", weight:2 });
                e.target.bringToFront();

                // updates the data that displays on the side
                // TO-DO: add a preview rather than the side data
                if (constituencyData[e.target.feature.id].length>0){
                    console.log(constituencyData[e.target.feature.id]);
                    setDisplayData(constituencyData[e.target.feature['id']]);
                }
                else{
                    setDisplayData(null);
                }
            },
            mouseout: () => {
                // Reset style on mouseout
                layer.setStyle({ color: "black",weight:1 });
            },
        });
    };

    async function fetchMoreFeatures(geojson, year) {
        if (!geojson) return null;

        const result = await Promise.all(
            geojson["features"].map((feature) => {
                async function getData() {
                    let color = "gray";

                    let state = feature["properties"]["State_Name"];

                    if (state){
                        state=state.replace(/ /g, "_");
                    }

                    const constituency = feature["properties"]["Constituency_Name"];
                    console.log(constituency,state);
                    const dataResponse = await fetch(
                        `/api/ls-elections/${year}/${state}/${constituency}`
                    );
                    const result = await dataResponse.json();

                    if (result) {
                        if (result.length > 0) {
                            color = getColor(result[0]["margin_percentage"]);
                        }
                        else{
                            console.log("NOTHING", result,state,constituency);
                        }
                    }
                    else{
                        console.log("NOTHING", result,state,constituency);
                    }

                    // console.log(feature, feature.id);

                    return {
                        feature,
                        color,
                        result
                    };
                }

                return getData();
            })
        );

        // console.log("finished fetching more", result);

        return result;
    }


    useEffect(() => {
        if (!mapData) return;

        async function getFeatures() {
            setFeatures(await fetchMoreFeatures(mapData,electionYear));
        }
        getFeatures();
    }, [mapData]);

    useEffect(()=>{
        if (!features) return;
        let constData={};
        console.log(features);
        for (const obj of features){
            console.log(obj);

            constData={...constData,[obj.feature.id]:obj.result};



        }
        setConstituencyData(constData);
    },[features]);

    // DEPENDENCY: election year
    // TO-DO: cache results for all 5 election years
    useEffect(() => {
        async function getGeojson() {
            const mapResponse = await fetch("/api/India_PC_2019/10");
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
    }, [electionYear]);

    return (
        <div>


        <div className="example">

            {features ? (
                <MapBase
                    layers={{

                        LS_2019_Competitiveness: features.map((obj) => (
                            <GeoJSON
                                style={{
                                    fillColor: obj.color,
                                    color: "black",
                                    weight: 1,
                                    fillOpacity:0.8
                                }}
                                key={obj.feature.id}
                                data={obj.feature}
                                onEachFeature={onEachFeature}
                            />
                        )),
                    }}
                />
            ) : <p>Loading...</p>}


            <div className="flexJustCenter dataDisplay" style={{padding:'0%'}}>

                <div style={{}}>
                    <div className="mapTitle">
                        Competitiveness Distribution in {electionYear}
                    </div>
                    {displayData && <div>
                    <div className="mapSubtitle">
                        <span>
                            Constituency: &nbsp;
                        </span>
                        <span style={{fontWeight:'normal'}}>
                            {displayData[0].constituency_name}
                        </span>
                        <span style={{marginLeft:'5%'}}>
                        State: &nbsp;
                        </span>
                        <span style={{fontWeight:'normal'}}>
                            {displayData[0].state_name}
                        </span>

                    </div>


                    <div>
                    <span className="bold text-left-align">
                        Winning Party:&nbsp;
                    </span>
                    <span>
                        {displayData[0].party_name}
                    </span>
                    <span className="bold text-left-align" style={{marginLeft:'3%'}}>
                        Winning Candidate:&nbsp;
                    </span>
                    <span>
                        {displayData[0].candidate}
                    </span>
                    </div>
                    <div>
                    <span className="bold text-left-align">
                        Runner-Up Party:&nbsp;
                    </span>
                    <span>
                        {displayData[1].party_name}
                    </span>
                    <span className="bold text-left-align" style={{marginLeft:'3%'}}>
                        Runner-Up Candidate:&nbsp;
                    </span>
                    <span>
                        {displayData[1].candidate}
                    </span>
                    </div>

                    <div>
                    <span className="bold text-left-align">
                        Margin Percentage:&nbsp;
                    </span>
                    <span>
                        {displayData[0].margin_percentage}%
                    </span>
                    </div>

                    </div>

                    }

                </div>
          </div>
        </div>
        </div>
    );
};

ExampleId.propTypes = {
    id: PropTypes.number,
};

export default ExampleId;
