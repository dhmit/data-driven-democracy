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
    // COMMENTED VARIABLES USED TO GET INITIAL DATA TO PLACE ON BACKEND
    let newConstData = {};
    const [allFeatures, setAllFeatures] = useState({});
    const [allConstData, setAllConstData] = useState({});
    const [allColors, setAllColors] = useState({});

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
    function countObjects(obj, condiiton) {
        let count = 0;
        obj.forEach((obj1) => {
            if (obj1.caste.substring(0, 1) === condiiton) {
                count++;
            }
        });
        return count;
    }

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
                    setDisplayData(constituencyData[e.target.feature.id]);
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
                    setPreviewData(constituencyData[e.target.feature.id]);
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

    useEffect(() => {}, features);
    async function fetchMoreFeatures(geojson, year) {
        if (!geojson) return null;

        const result = await Promise.all(
            geojson["features"].map(async (feature) => {
                let color = "#ababab";
                let state = feature["properties"]["State_Name"];

                if (state) {
                    if (state === "Telangana" && year < 2019) {
                        state = "Andhra Pradesh";
                    }
                    state = state.replace(/ /g, "_");
                }

                const constituency_no = feature["properties"]["Constituency_No"];
                const dataResponse = await fetch(
                    `/api/responders/${year}/${state}/${constituency_no}`
                );

                const result = await dataResponse.json();
                let caste_count = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0
                };
                if (result && result.length > 0) {
                    caste_count[1] = countObjects(result, "1");
                    caste_count[2] = countObjects(result, "2");

                    caste_count[3] = countObjects(result, "3");

                    caste_count[4] = countObjects(result, "4");

                    let maxKey = null;
                    let maxValue = -Infinity;

                    // Iterate over object keys
                    let total_responses = 0;
                    for (let key in caste_count) {
                        total_responses += caste_count[key];
                        // Compare current value with max value
                        if (caste_count[key] > maxValue) {
                            maxValue = caste_count[key];
                            maxKey = key;
                        }
                    }
                    const caste_mapping = {
                        1: "Scheduled Caste",
                        2: "Scheduled Tribe",
                        3: "Other Backwards Caste",
                        4: "Other"
                    };
                    color = getColor(maxKey);

                    if (!color) {
                        color = "#ababab";
                    }

                    newConstData[feature.id] = {
                        election_year: electionYear,
                        state_name: result[0].state_name,
                        constituency_name: feature.properties.Constituency_Name,
                        caste_one: Math.round((caste_count[1] / total_responses) * 100),
                        caste_two: Math.round((caste_count[2] / total_responses) * 100),
                        caste_three: Math.round((caste_count[3] / total_responses) * 100),
                        caste_four: Math.round((caste_count[4] / total_responses) * 100),
                        top_caste: caste_mapping[maxKey],
                        top_caste_percentage: Math.round(
                            (caste_count[maxKey] / total_responses) * 100
                        )
                    };
                } else {
                    newConstData[feature.id] = null;
                    console.log("NOT FOUND", electionYear, state, constituency_no);
                }

                return {feature, color};
            })
        );

        return result;
    }

    useEffect(() => {}, [electionYear]);
    // update colors on map and constituency data displayed when year changes
    useEffect(() => {
        if (!mapData) return;
        let fetchMore = true;

        // checks if any year's data has been cached

        if (allFeatures) {
            const newObj = {};
            let counter = 1;
            for (const key in allFeatures[electionYear]) {
                newObj[counter++] = {color: allFeatures[electionYear][key].color};
            }
            let newColorsData = {...allColors};
            newColorsData[electionYear] = newObj;
            setAllColors({...newColorsData});

            // if the data for that given year is already cached
            if (allFeatures[electionYear]) {
                setFeatures(allFeatures[electionYear]);
                setConstituencyData(allConstData[electionYear]);
                setMapChanged(!mapChanged);
                fetchMore = false;
            }
        }
        if (fetchMore) {
            async function getFeatures() {
                newConstData = {};
                const newFeatures = await fetchMoreFeatures(mapData, electionYear);

                setFeatures(newFeatures);

                allFeatures[electionYear] = newFeatures;
                setAllFeatures({...allFeatures});

                setConstituencyData(newConstData);
                allConstData[electionYear] = newConstData;
                setAllConstData({...allConstData});

                setMapChanged(!mapChanged);
            }
            getFeatures();
        }
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
