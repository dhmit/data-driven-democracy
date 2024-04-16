import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import * as PropTypes from "prop-types";

function valuetext(value) {
    return `${value}°C`;
}


export default function DiscreteSlider({handleSliderChange}) {
    function handleChange(event,newValue){
        handleSliderChange(newValue);
    }

    return (
        <Box sx={{width: 300}}>
            <Slider
                aria-label="Year"
                size="medium"
                defaultValue={30}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                shiftStep={5}
                onChange={handleChange}
                step={5}
                marks
                min={2004}
                max={2019}
            />
        </Box>
    );
}

DiscreteSlider.propTypes = {

    handleSliderChange: PropTypes.func
};
