import React, {useState, useEffect, useRef} from "react";
import * as PropTypes from "prop-types";
import MapBase from "../components/global/MapBase";
import Loading from "../components/global/Loading";
import {GeoJSON} from "react-leaflet";
export const DEFAULT_MAP_CENTER_LAT = 20.5937;
export const DEFAULT_MAP_CENTER_LNG = 50.9629;

const CompetitivenessMap = () => {
    const [features, setFeatures] = useState(null);
    const [constituencyData, setConstituencyData] = useState(null);

    const [mapData, setMapData] = useState(null);

    const [electionYear, setElectionYear] = useState(2004);
    const [displayData, setDisplayData] = useState(null);
    const [displayId, setDisplayId] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [previewId, setPreviewId] = useState(null);
    const [mapChanged, setMapChanged] = useState(false);

    const constituencyDataRef = useRef(constituencyData);

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
    const labels = {
        0: "0%",
        1: "1%",
        2: "2%",
        3: "3%",
        5: "5%",
        7: "7%",
        10: "10%",
        20: "20%",
        30: "30%"
    };

    const title = "Percent Margin";
    useEffect(() => {
        constituencyDataRef.current = constituencyData;
        if (displayData) {
            setDisplayData(constituencyData[displayId]);
            setPreviewData(constituencyData[previewId]);
        }
    }, [constituencyData]);

    const handleSliderChange = (newValue) => {
        setElectionYear(newValue);
    };

    // handle click and hover events
    const onEachFeature = (feature, layer) => {
        layer.on({
            click: (e) => {
                // shows more information on the side of the map onClick
                layer.setStyle({color: "white", weight: 2});

                if (constituencyData[e.target.feature.id].length > 0) {
                    setDisplayData(constituencyDataRef.current[e.target.feature["id"]]);
                    setDisplayId(e.target.feature["id"]);
                } else {
                    setDisplayData(null);
                }
            },
            mouseover: (e) => {
                // Highlight feature and display data on hover
                e.target.bringToFront();

                layer.setStyle({color: "white", weight: 2});

                if (constituencyData[e.target.feature.id].length > 0) {
                    setPreviewData(constituencyDataRef.current[e.target.feature["id"]]);
                    setPreviewId(e.target.feature["id"]);
                } else {
                    setPreviewData(null);
                }
            },
            mouseout: () => {
                // Reset style on mouseout
                layer.setStyle({color: "black", weight: 1});
            }
        });
    };

    // get map data from geojson on mount
    useEffect(() => {
        if (mapData) return;
        async function getGeojson() {
            const mapResponse = await fetch("/api/India_PC_2019/");
            const result = await mapResponse.json();
            setMapData(result);
        }
        getGeojson();
    }, []);

    // updates map colors and data when electionYear changes
    useEffect(() => {
        if (!mapData) return;
        async function getMapColors() {
            const colorsResponse = await fetch(`/api/competitiveness_colors/${electionYear}`);

            const colorsResult = await colorsResponse.json();

            const newFeatures = mapData["features"].map((feature, index) => ({
                feature: feature,
                ...colorsResult["colors"][index + 1] // Merge color object at index
            }));

            setFeatures(newFeatures);
            setConstituencyData(colorsResult["data"]);
            setMapChanged(!mapChanged);
        }

        getMapColors();
    }, [mapData, electionYear]);

    return (
        <div>
            <div className="map-title">Competitiveness Distribution in {electionYear}</div>

            <div className="map-display">
                {features ? (
                    <MapBase
                        layers={{
                            LS_2019_Competitiveness: features.map((obj) => (
                                <GeoJSON
                                    style={{
                                        fillColor: obj.color,
                                        color: "black",
                                        weight: 1,
                                        fillOpacity: 0.8
                                    }}
                                    key={obj.feature.id}
                                    data={obj.feature}
                                    onEachFeature={onEachFeature}
                                />
                            ))
                        }}
                        defaultVisibleLayers={["LS_2019_Competitiveness"]}
                        mapChanged={mapChanged}
                        dataToDisplay={previewData}
                        handleSliderChange={handleSliderChange}
                        legendGrades={grades}
                        legendLabels={labels}
                        colorLegendFunc={getColor}
                        legendTitle={title}
                    />
                ) : (
                    <Loading />
                )}

                <div className="slider">
                    <div style={{fontSize: "x-large", fontWeight: "bold", textAlign: "center"}}>
                        Election Year:&nbsp; {electionYear}
                    </div>

                    <div className="data-display">
                        {displayData && (
                            <div>
                                <div className="map-subtitle">
                                    <div>State:</div>
                                    <div style={{fontWeight: "normal"}}>
                                        {displayData[0].state_name.replace("_", " ")}
                                    </div>
                                </div>

                                <div className="map-subtitle">
                                    <div>Constituency:</div>
                                    <div style={{fontWeight: "normal"}}>
                                        {displayData[0].constituency_name.charAt(0).toUpperCase() +
                                            displayData[0].constituency_name.slice(1).toLowerCase()}
                                    </div>
                                </div>

                                <div>
                                    <div className="map-subtitle">Winning Party:</div>
                                    <div>{displayData[0].party_name}</div>
                                </div>

                                <div>
                                    <div className="map-subtitle">Margin:</div>
                                    <div>{displayData[0].margin_percentage}%</div>
                                </div>

                                <div>
                                    <div className="bold text-left-align">Winning Candidate:</div>
                                    <div>{displayData[0].candidate}</div>
                                </div>

                                <div>
                                    <div className="bold text-left-align">Runner-Up Party:</div>
                                    <div>{displayData[1].party_name}</div>

                                    <div className="bold text-left-align">Runner-Up Candidate:</div>
                                    <div>{displayData[1].candidate}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

CompetitivenessMap.propTypes = {
    id: PropTypes.number
};

export default CompetitivenessMap;
