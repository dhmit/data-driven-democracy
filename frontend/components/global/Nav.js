import React from "react";
import DH_LOGO from "../../images/dh_logo.svg";

const Nav = () => {
    return (
        <nav className="navbar navbar-light bg-light">
            <a className="navbar-brand link-home" href="/">
                Data Driven Democracy
            </a>
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a href="/competitiveness/">Competitiveness Map</a>
                </li>
            </ul>
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a href="/campaign-finance/top-10-donors-piechart/">Donors Pie Chart</a>
                </li>
            </ul>
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a href="/campaign-finance/top-10-donors-barchart/">Donors Bar Chart</a>
                </li>
            </ul>
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a href="/campaign-finance/donor-party-sankey/">Donor Party Sankey</a>
                </li>
            </ul>
            <a
                className="lab-link"
                href="https://digitalhumanities.mit.edu/"
                target="_blank"
                rel="noreferrer"
            >
                <img className="lab-image" src={DH_LOGO} />
            </a>
        </nav>
    );
};

export default Nav;
