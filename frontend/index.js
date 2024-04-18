import React from "react";
import {createRoot} from "react-dom/client";
import "./scss/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Base from "./components/global/Base";
import ErrorNotFoundComponent from "./components/ErrorNotFoundComponent";
import Home from "./components/Home";
import CompetitivenessMap from "./components/CompetitivenessMap";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import FinanceSankey from "./components/FinanceSankey";
const COMPONENT_PROPS_RAW = document.getElementById("component_props").text;
const COMPONENT_NAME_RAW = document.getElementById("component_name").text;
const COMPONENT_PROPS = JSON.parse(COMPONENT_PROPS_RAW);
const COMPONENT_NAME = JSON.parse(COMPONENT_NAME_RAW);

const COMPONENTS = {
    ErrorNotFoundComponent,
    Home,
    PieChart,
    BarChart,
    FinanceSankey,
    CompetitivenessMap
};

const PreselectedComponent = COMPONENTS[COMPONENT_NAME || "ErrorNotFoundComponent"];

const container = document.getElementById("app_root");
const root = createRoot(container);

root.render(
    <Base>
        <PreselectedComponent {...COMPONENT_PROPS} />
    </Base>
);
