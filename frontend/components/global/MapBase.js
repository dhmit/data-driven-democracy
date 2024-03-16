import React from "react";
import {useState} from "react";
import Legend from "./Legend";

import * as PropTypes from "prop-types";
import {
    MapContainer,
    TileLayer,
    ZoomControl
} from "react-leaflet";

// Default latitude and longitude values for the center of the map
export const DEFAULT_MAP_CENTER_LAT = 22.5937;
export const DEFAULT_MAP_CENTER_LNG = 78.9629;

export function MapBase({
    className = "map-base",
    lat = DEFAULT_MAP_CENTER_LAT,
    lng = DEFAULT_MAP_CENTER_LNG,
    scrollWheelZoom = true,
    layers = {},
    singleLayer = false,
    defaultVisibleLayers = [],
    bounds = null,
    zoom = 5,
    minZoom = 5,
    maxZoom=8
}) {
    let visibleLayersInit = defaultVisibleLayers;
    if (singleLayer) {
        visibleLayersInit = layers[Object.keys(layers)[0]];
    } else if (!defaultVisibleLayers) {
        visibleLayersInit = Object.keys(layers);
    }

    function getOverlays() {
        return Object.keys(layers).map((layerName) => {
            return visibleLayers.includes(layerName)
                ? layers[layerName]
                : <></>;
        });
    }

    const [visibleLayers, setvisibleLayers] = useState(visibleLayersInit);
    const [overlays, setOverlays] = useState(getOverlays());

    function toggleLayer(event) {
        const clickedLayer = event.target.value;
        console.log(clickedLayer);
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
            <Legend
                layers={Object.keys(layers)}
                toggleLayer={toggleLayer}
                visibleLayers={visibleLayers}/>
            <MapContainer
                key={"map"}
                // Initial state of Map
                center={[
                    lat ?? DEFAULT_MAP_CENTER_LAT,
                    lng ?? DEFAULT_MAP_CENTER_LNG
                ]}
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
                zoomControl={false}>
                <ZoomControl position="bottomleft"/>
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
    maxZoom: PropTypes.number
};

export default MapBase;
