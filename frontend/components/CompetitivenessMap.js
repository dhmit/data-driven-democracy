import React, {useState, useEffect,useRef} from "react";
import * as PropTypes from "prop-types";
import MapBase from "../components/global/MapBase";
import {GeoJSON} from "react-leaflet";
import DiscreteSlider from "./global/DiscreteSlider";
export const DEFAULT_MAP_CENTER_LAT = 20.5937;
export const DEFAULT_MAP_CENTER_LNG = 78.9629;

// assigns a color to a constituency
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

    // cache to store map features and constituency data
    // unused variable are to get the inital data to place in backend
    // let newConstData={};
    // const[allFeatures,setAllFeatures]=useState({});
    // const[allConstData,setAllConstData]=useState({});
    const constituencyDataRef = useRef(constituencyData);
    // const [allColors,setAllColors]=useState({});

    useEffect(() => {
        constituencyDataRef.current = constituencyData;
    }, [constituencyData]);



    const handleSliderChange = (newValue) =>{

        setElectionYear(newValue);
    };


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

    // FUNCTION USED TO GET MAP DATA
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

    // UNCOMMENT CODE BELOW TO GET COLORS AND CONSTITUENCY DATA

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

    // get map data (only called once)
    useEffect(() => {
        if (mapData) return;
        async function getGeojson() {
            const mapResponse = await fetch("/api/India_PC_2019/10");
            const result = await mapResponse.json();
            setMapData(result);


        }
        getGeojson();

    }, []);

    useEffect(()=>{
        if (!mapData) return;
        async function getMapColors(){
            const colorsResponse = await fetch(`/api/competitiveness_colors/${electionYear}`);

            const colorsResult = await colorsResponse.json();

            const newArray = mapData["features"].map((item, index) => ({
                "feature": item,
                ...colorsResult["colors"][index+1] // Merge color object at index
            }));


            setFeatures(newArray);
            setConstituencyData(colorsResult["data"]);
            setMapChanged(!mapChanged);


        }

        getMapColors();

    },[mapData,electionYear]);


    return (
        <div>
            <DiscreteSlider handleSliderChange={handleSliderChange}/>

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


                <div className="flexJustCenter dataDisplay" style={{padding:"0%"}}>

                    <div style={{}}>
                        <div className="mapTitle">
                        Competitiveness Distribution in {electionYear}
                        </div>
                        {displayData && <div>
                            <div className="mapSubtitle">
                                <span>
                            Constituency: &nbsp;
                                </span>
                                <span style={{fontWeight:"normal"}}>
                                    {displayData[0].constituency_name}
                                </span>
                                <span style={{marginLeft:"5%"}}>
                        State: &nbsp;
                                </span>
                                <span style={{fontWeight:"normal"}}>
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
                                <span className="bold text-left-align" style={{marginLeft:"3%"}}>
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
                                <span className="bold text-left-align" style={{marginLeft:"3%"}}>
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

CompetitivenessMap.propTypes = {
    id: PropTypes.number
};

export default CompetitivenessMap;
