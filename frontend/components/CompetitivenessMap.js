import React, { useState, useEffect,useRef } from "react";
import * as PropTypes from "prop-types";
import MapBase from "../components/global/MapBase";
import { GeoJSON, Polygon } from "react-leaflet";
import DiscreteSlider from "./global/DiscreteSlider";
export const DEFAULT_MAP_CENTER_LAT = 20.5937;
export const DEFAULT_MAP_CENTER_LNG = 78.9629;


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

const CompetitivenessMap = () => {
    const [features, setFeatures] = useState(null);
    let newConstData={};
    const [constituencyData,setConstituencyData]=useState(null);

    const [mapData, setMapData] = useState(null);

    const [electionYear, setElectionYear] = useState(2004);
    const [displayData, setDisplayData] = useState(null);
    const [mapChanged,setMapChanged]=useState(false);
    const[allFeatures,setAllFeatures]=useState({});
    const[allConstData,setAllConstData]=useState({});
    const constituencyDataRef = useRef(constituencyData);

    useEffect(() => {
        constituencyDataRef.current = constituencyData;
    }, [constituencyData]);



    const handleSliderChange = (newValue) =>{

        setElectionYear(newValue);
    };


    const onEachFeature = (feature, layer) => {
        layer.on({
            click:(e)=>{
                layer.setStyle({ color: "white", weight:2 });
                // if (constituencyData[e.target.feature.id].length>0){
                //     console.log(constituencyData[e.target.feature.id]);
                //     setDisplayData(constituencyData[e.target.feature['id']]);
                // }
                // else{
                //     setDisplayData(null);
                // }
                console.log("on click",constituencyDataRef.current);
                console.log(constituencyDataRef.current[e.target.feature.id]);

            },
            mouseover: (e) => {
                // Highlight feature and display data on hover
                e.target.bringToFront();

                layer.setStyle({ color: "white", weight:2 });

                // updates the data that displays on the side
                // TO-DO: add a preview rather than the side data
                // console.log("CONSTITHFSJKDF",constituencyData[e.target.feature.id]);

                if (constituencyData[e.target.feature.id].length>0){
                    setDisplayData(constituencyDataRef.current[e.target.feature['id']]);

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

                    // account for differences in state name
                    if (state){
                        if (state==="Telangana" && year<2019){
                            state="Andhra Pradesh";
                        }
                        // else if (state==="Vanachal" && year===1999){
                        //     state="Jharkhand";

                        // }

                        // else if (state==="Uttaranchal" && year===1999){
                        //     state="Uttarakhand";

                        // }
                        // else if (state==="Uttarakhand" && year===1999){
                        //     state="Uttaranchal";

                        // }
                        // else if (state==="Chhattisgarh"&& year===1999){
                        //     state="Chhattisgarh";
                        // }

                        state=state.replace(/ /g, "_");

                    }

                    const constituency = feature["properties"]["Constituency_Name"];
                    const constituency_no = feature["properties"]["Constituency_No"];

                    const dataResponse = await fetch(
                        `/api/ls-elections/${year}/${state}/${constituency_no}`
                    );
                    const result = await dataResponse.json();

                    if (result) {
                        if (result.length > 0) {
                            color = getColor(result[0]["margin_percentage"]);
                            newConstData[feature.id]=result;
                        }
                        else{
                            console.log("NOT FOUND",state,constituency);

                        }
                    }
                    else{
                        console.log("NOT FOUND",state,constituency);
                    }

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
        let fetchMore=true;

        if (allFeatures){
            console.log("HI",allFeatures);
            if (allFeatures[electionYear]){
                setFeatures(allFeatures[electionYear]);
                console.log(allFeatures[electionYear]);
                setConstituencyData(allConstData[electionYear]);
                console.log(allConstData[electionYear]);
                setMapChanged(!mapChanged);
                fetchMore=false;
            }


        }
        if (fetchMore){
            async function getFeatures() {
                newConstData={};
                const newFeatures= (await fetchMoreFeatures(mapData,electionYear));
                setFeatures(newFeatures);
                allFeatures[electionYear]=newFeatures;
                const updatedFeatures = { ...allFeatures };

                updatedFeatures[electionYear] = newFeatures;

                setAllFeatures(updatedFeatures);
                // console.log(newConstData,"HERE");
                setConstituencyData(newConstData);
                const updatedConstData={...allConstData};
                updatedConstData[electionYear]=newConstData;
                setAllConstData(updatedConstData);
                setMapChanged(!mapChanged);

            }
            getFeatures();

        }



    }, [mapData,electionYear]);

    useEffect(()=>{
        console.log("CONS CHANGED",constituencyData);
    },[constituencyData]);

    useEffect(() => {
        if (mapData) return;
        async function getGeojson() {
            const mapResponse = await fetch("/api/India_PC_2019/10");
            const result = await mapResponse.json();
                setMapData(result);

        }
        getGeojson();

    }, []);


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
                        )),
                    }}
                    defaultVisibleLayers={["LS_2019_Competitiveness"]}
                    mapChanged={mapChanged}

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

CompetitivenessMap.propTypes = {
    id: PropTypes.number,
};

export default CompetitivenessMap;
