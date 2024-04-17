import React, {useState, useEffect,useRef} from "react";
import * as PropTypes from "prop-types";
import MapBase from "../components/global/MapBase";
import {GeoJSON} from "react-leaflet";
import DiscreteSlider from "./global/DiscreteSlider";
export const DEFAULT_MAP_CENTER_LAT = 20.5937;
export const DEFAULT_MAP_CENTER_LNG = 78.9629;

// assigns a color to a constituency, will be used later
// function getColor(value) {

//     if (value > 70) {
//         return "#E9EAE0";
//     } else if (value > 50) {
//         return "#F7BEC0";
//     } else if (value > 40) {
//         return "#FF8A8A";
//     } else if (value > 30) {
//         return "#FF5C5C";
//     } else if (value > 20) {
//         return "#FF2E2E";
//     } else if (value > 10) {
//         return "#FF0000";
//     } else if (value > 5) {
//         return "#D10000";
//     } else if (value > 3) {
//         return "#A30000";
//     } else {
//         return "#750000";
//     }
// }

const CompetitivenessMap = () => {
    const [features, setFeatures] = useState(null);
    const [constituencyData,setConstituencyData]=useState(null);

    const [mapData, setMapData] = useState(null);

    const [electionYear, setElectionYear] = useState(2004);
    const [displayData, setDisplayData] = useState(null);
    const [previewData,setPreviewData]=useState(null);
    const [mapChanged,setMapChanged]=useState(false);

    // COMMENTED VARIABLES USED TO GET INITIAL DATA TO PLACE ON BACKEND
    // let newConstData={};
    // const[allFeatures,setAllFeatures]=useState({});
    // const[allConstData,setAllConstData]=useState({});
    // const [allColors,setAllColors]=useState({});

    const constituencyDataRef = useRef(constituencyData);

    useEffect(() => {
        constituencyDataRef.current = constituencyData;
    }, [constituencyData]);



    const handleSliderChange = (newValue) =>{

        setElectionYear(newValue);
    };

    // handle click and hover events
    const onEachFeature = (feature, layer) => {
        layer.on({
            click:(e)=>{
                // shows more information on the side of the map onClick
                layer.setStyle({color: "white", weight:2});

                if (constituencyData[e.target.feature.id].length>0){
                    setDisplayData(constituencyDataRef.current[e.target.feature["id"]]);

                }
                else{
                    setDisplayData(null);
                }


            },
            mouseover: (e) => {
                // Highlight feature and display data on hover
                e.target.bringToFront();

                layer.setStyle({color: "white", weight:2});

                if (constituencyData[e.target.feature.id].length>0){
                    setPreviewData(constituencyDataRef.current[e.target.feature["id"]]);

                }
                else{
                    setPreviewData(null);
                }
            },
            mouseout: () => {
                // Reset style on mouseout
                layer.setStyle({color: "black",weight:1});
            }
        });
    };

    // get map data from geojson on mount
    useEffect(() => {
        if (mapData) return;
        async function getGeojson() {
            const mapResponse = await fetch("/api/India_PC_2019/10");
            const result = await mapResponse.json();
            setMapData(result);

        }
        getGeojson();

    }, []);

    // updates map colors and data when electionYear changes
    useEffect(()=>{
        if (!mapData) return;
        async function getMapColors(){

            const colorsResponse = await fetch(`/api/competitiveness_colors/${electionYear}`);

            const colorsResult = await colorsResponse.json();

            const newFeatures = mapData["features"].map((feature, index) => ({
                "feature": feature,
                ...colorsResult["colors"][index+1] // Merge color object at index
            }));

            setFeatures(newFeatures);
            setConstituencyData(colorsResult["data"]);
            setMapChanged(!mapChanged);

        }

        getMapColors();

    },[mapData,electionYear]);


    // UNCOMMENT CODE BELOW TO GET INITAL COLOR DATA AND CONSTITUENCY DATA

    // async function fetchMoreFeatures(geojson, year) {
    //     if (!geojson) return null;

    //     const result = await Promise.all(
    //         geojson["features"].map(async (feature) => {
    //             let color = getColor(30);
    //             let state = feature["properties"]["State_Name"];

    //             if (state) {
    //                 if (state === "Telangana" && year < 2019) {
    //                     state = "Andhra Pradesh";
    //                 }
    //                 state = state.replace(/ /g, "_");
    //             }

    //             const constituency_no = feature["properties"]["Constituency_No"];
    //             const dataResponse = await fetch(
    //                 `/api/ls-elections/${year}/${state}/${constituency_no}`
    //             );
    //             const result = await dataResponse.json();

    //             if (result && result.length > 0) {
    //                 color = getColor(result[0]["margin_percentage"]);
    //                 newConstData[feature.id] = result;
    //             } else {
    //                 newConstData[feature.id] = result;
    //             }

    //             return {feature, color};
    //         })
    //     );

    //     return result;
    // }

    // update colors on map and constituency data displayed when year changes
    // useEffect(() => {
    //     if (!mapData) return;
    //     let fetchMore=true;

    //     // checks if any year's data has been cached

    //     if (allFeatures){
    //         console.log(allFeatures,allConstData);
    //         const newObj = {};
    //         let counter = 1;
    //         for (const key in allFeatures[electionYear]) {

    //             newObj[counter++] = { color: allFeatures[electionYear][key].color };

    //         }
    //         let newColorsData={...allColors};
    //         newColorsData[electionYear]=newObj;
    //         setAllColors({...newColorsData});
    //         console.log("COLORS DATA", newColorsData,allColors);


    //         // if the data for that given year is already cached
    //         if (allFeatures[electionYear]){
    //             setFeatures(allFeatures[electionYear]);
    //             setConstituencyData(allConstData[electionYear]);
    //             setMapChanged(!mapChanged);
    //             fetchMore=false;
    //         }


    //     }
    //     if (fetchMore){
    //         async function getFeatures() {
    //             newConstData = {};
    //             const newFeatures = await fetchMoreFeatures(mapData, electionYear);
    //             setFeatures(newFeatures);

    //             allFeatures[electionYear] = newFeatures;
    //             setAllFeatures({ ...allFeatures });

    //             setConstituencyData(newConstData);
    //             allConstData[electionYear] = newConstData;
    //             setAllConstData({ ...allConstData });

    //             setMapChanged(!mapChanged);
    //         }
    //         getFeatures();


    //     }


    // }, [mapData,electionYear]);

    const yearMarks=[
        {
            value:2004,
            label:2004
        },
        {
            value:2009,
            label:2009
        },
        {
            value:2014,
            label:2014
        },
        {
            value:2019,
            label:2019
        }
    ];
    return (
        <div>

            <div className="mapTitle">
                Competitiveness Distribution in {electionYear}
            </div>

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
                            ))
                        }}
                        defaultVisibleLayers={["LS_2019_Competitiveness"]}
                        mapChanged={mapChanged}
                        dataToDisplay={previewData}

                    />
                ) : <p>Loading...</p>}

                <div className="slider">
                    <div style={{fontSize:"x-large",fontWeight:"bold",textAlign:"left"}}>
                        Election Year:&nbsp; {electionYear}
                    </div>
                    <DiscreteSlider handleSliderChange={handleSliderChange} marks={yearMarks}/>

                </div>

                <div className="dataDisplay">


                    <div style={{}}>

                        {displayData && <div>
                            <div className="mapSubtitle">
                                <div>
                        State:
                                </div>
                                <div style={{fontWeight:"normal"}}>
                                    {displayData[0].state_name.replace("_", " ")}
                                </div>
                            </div>
                            <div className="mapSubtitle">
                                <div>
                            Constituency:
                                </div>
                                <div style={{fontWeight:"normal"}}>
                                    {displayData[0].constituency_name.charAt(0).toUpperCase()+
                        displayData[0].constituency_name.slice(1).toLowerCase()}
                                </div>


                            </div>



                            <div>
                                <div className="mapSubtitle">
                        Winning Party:
                                </div>
                                <div>
                                    {displayData[0].party_name}
                                </div>

                            </div>
                            <div>
                                <div className="mapSubtitle">
                        Margin:
                                </div>
                                <div>
                                    {displayData[0].margin_percentage}%
                                </div>
                            </div>
                            <div>
                                <div className="bold text-left-align">
                        Winning Candidate:
                                </div>
                                <div>
                                    {displayData[0].candidate}
                                </div>

                            </div>
                            <div>
                                <div className="bold text-left-align">
                        Runner-Up Party:
                                </div>
                                <div>
                                    {displayData[1].party_name}
                                </div>
                                <div className="bold text-left-align">
                        Runner-Up Candidate:
                                </div>
                                <div>
                                    {displayData[1].candidate}
                                </div>
                            </div>



                        </div>

                        }

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
