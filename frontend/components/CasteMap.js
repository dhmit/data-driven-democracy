import React, {useState, useEffect, useRef} from "react";
import * as PropTypes from "prop-types";
import MapBase from "../components/global/MapBaseCaste";
import Loading from "../components/global/Loading";
import {GeoJSON} from "react-leaflet";
export const DEFAULT_MAP_CENTER_LAT = 20.5937;
export const DEFAULT_MAP_CENTER_LNG = 50.9629;

const CasteMap = () => {
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

    // assigns a color to a constituency, will be used later
    function getColor(value) {
        if (value > 3.5) {
            return "#fac3c3";
        } else if (value > 2.5) {
            return "#FF5C5C";
        } else if (value > 1.5) {
            return "#D10000";
        } else {
            return "#750000";
        }
    }
    const title = "Caste";
    const grades = [0, 1, 2, 3];
    const labels = {
        0: "Scheduled Caste",
        1: "Scheduled Tribe",
        2: "Other Backward Caste",
        3: "Other"
    };

    useEffect(() => {}, [displayData]);

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

                if (constituencyData[e.target.feature.id]) {
                    setDisplayData(constituencyDataRef.current[e.target.feature.id]);
                    setDisplayId(e.target.feature.id);
                } else {
                    setDisplayData(null);
                }
            },
            mouseover: (e) => {
                // Highlight feature and display data on hover
                e.target.bringToFront();

                layer.setStyle({color: "white", weight: 2});

                if (constituencyData[e.target.feature.id]) {
                    setPreviewData(constituencyDataRef.current[e.target.feature.id]);
                    setPreviewId(e.target.feature.id);
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
            const colorsResponse = await fetch(`/api/caste_colors/${electionYear}`);

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
            <div className="map-title">Caste Distribution in {electionYear}</div>

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
                        colorLegendFunc={getColor}
                        legendTitle={title}
                        legendLabels={labels}
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
                                        {displayData.state_name.replace("_", " ")}
                                    </div>
                                </div>

                                <div className="map-subtitle">
                                    <div>Constituency:</div>
                                    <div style={{fontWeight: "normal"}}>
                                        {displayData.constituency_name.charAt(0).toUpperCase() +
                                            displayData.constituency_name.slice(1).toLowerCase()}
                                    </div>
                                </div>

                                <div>
                                    <div className="map-subtitle">Scheduled Caste:</div>
                                    <div>{displayData.caste_one}%</div>
                                </div>

                                <div>
                                    <div className="map-subtitle">Scheduled Tribe</div>
                                    <div>{displayData.caste_two}%</div>
                                </div>

                                <div>
                                    <div className="map-subtitle">Other Backward Caste:</div>
                                    <div>{displayData.caste_three}%</div>
                                </div>

                                <div>
                                    <div className="map-subtitle">Other:</div>
                                    <div>{displayData.caste_four}%</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

CasteMap.propTypes = {
    id: PropTypes.number
};

export default CasteMap;
