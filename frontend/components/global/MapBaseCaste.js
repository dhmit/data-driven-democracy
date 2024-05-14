import React from "react";
import {useState, useEffect} from "react";

import * as PropTypes from "prop-types";
import {MapContainer, TileLayer, ZoomControl} from "react-leaflet";
import GradientLegend from "./GradientLegend";
import DataPreview from "./DataPreviewCaste";
import DiscreteSlider from "./DiscreteSliderOnMap";
// Default latitude and longitude values for the center of the map
export const DEFAULT_MAP_CENTER_LAT = 24.5937;
export const DEFAULT_MAP_CENTER_LNG = 80.9629;

// TODO: Integrate with existing MapBase to reduce duplicate code
export function MapBase({
    className = "map-base",
    lat = DEFAULT_MAP_CENTER_LAT,
    lng = DEFAULT_MAP_CENTER_LNG,
    scrollWheelZoom = true,
    layers = {},
    singleLayer = false,
    defaultVisibleLayers = [],
    bounds = [
        [38.2, 100],
        [5.63, 67]
    ],
    zoom = 5,
    minZoom = 5,
    maxZoom = 8,
    mapChanged = false,
    dataToDisplay = {},
    handleSliderChange,
    legendGrades,
    legendLabels,
    colorLegendFunc,
    legendTitle
}) {
    const yearMarks = [
        {
            value: 2004,
            label: 2004
        },
        {
            value: 2009,
            label: 2009
        },
        {
            value: 2014,
            label: 2014
        },
        {
            value: 2019,
            label: 2019
        }
    ];

    let visibleLayersInit = defaultVisibleLayers;

    if (singleLayer) {
        visibleLayersInit = layers[Object.keys(layers)[0]];
    } else if (!defaultVisibleLayers) {
        visibleLayersInit = Object.keys(layers);
    }

    function getOverlays() {
        return Object.keys(layers).map((layerName) => {
            return visibleLayers.includes(layerName) ? layers[layerName] : <></>;
        });
    }

    const [visibleLayers, setvisibleLayers] = useState(visibleLayersInit);
    const [overlays, setOverlays] = useState(getOverlays());
    useEffect(() => {
        toggleLayer({target: {value: defaultVisibleLayers}});
    }, [mapChanged]);

    function toggleLayer(event) {
        const clickedLayer = event.target.value;
        let newVisibleLayers = visibleLayers;
        if (singleLayer) {
            newVisibleLayers = [];
        }
        if (newVisibleLayers.includes(clickedLayer)) {
            newVisibleLayers.splice(newVisibleLayers.indexOf(clickedLayer), 1);
        } else {
            newVisibleLayers.push(clickedLayer);
        }
        setvisibleLayers(newVisibleLayers);
        setOverlays(getOverlays());
    }

    return (
        <div className={className} id="map-container">
            <div
                style={{
                    width: "100%",
                    height: "100%"
                }}
            >
                <GradientLegend
                    getColor={colorLegendFunc}
                    title={legendTitle}
                    grades={legendGrades}
                    labels={legendLabels}
                />
                <div className="preview">
                    <DataPreview dataToDisplay={dataToDisplay} />
                    <DiscreteSlider handleSliderChange={handleSliderChange} marks={yearMarks} />
                </div>

                <MapContainer
                    key={"map"}
                    // Initial state of Map
                    center={[lat ?? DEFAULT_MAP_CENTER_LAT, lng ?? DEFAULT_MAP_CENTER_LNG]}
                    zoom={zoom}
                    scrollWheelZoom={scrollWheelZoom}
                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                    // Sets Map Boundaries - Keeps user from leaving Paris
                    maxBoundsViscosity={1.0}
                    maxBounds={bounds}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    zoomControl={false}
                >
                    <ZoomControl position="bottomleft" />
                    <TileLayer
                        // Sets Map Boundaries - Keeps user from leaving Paris
                        maxBoundsViscosity={1.0}
                        bounds={bounds}
                        minZoom={minZoom}
                        // Retrieves Map image

                        // HOT option
                        url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png?api_key=42f43691-95d6-488e-ab8e-8c775d43f6e2"
                    />
                    {overlays}
                </MapContainer>
            </div>
        </div>
    );
}

MapBase.propTypes = {
    className: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    zoom: PropTypes.number,
    scrollWheelZoom: PropTypes.bool,
    layers: PropTypes.object,
    singleLayer: PropTypes.bool,
    defaultVisibleLayers: PropTypes.array,
    bounds: PropTypes.array,
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    mapChanged: PropTypes.bool,
    dataToDisplay: PropTypes.array,
    handleSliderChange: PropTypes.func,
    legendGrades: PropTypes.array,
    legendTitle: PropTypes.string,
    colorLegendFunc: PropTypes.func,
    legendLabels: PropTypes.object
};

export default MapBase;
