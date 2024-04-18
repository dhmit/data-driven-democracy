import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import {sankey, sankeyLinkHorizontal} from "d3-sankey";
import "../scss/finance.scss";

const FinanceSankey = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/all-campaign-finance/");
                const jsonData = await response.json();
                console.log("Fetched data:", jsonData); // Log fetched data to the console
                setData(jsonData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            renderSankey();
        }
    }, [data]);

    const renderSankey = () => {
        const contributions = {};
        const nodes = [];
        const links = [];

        data.forEach((item) => {
            const key = `${item.donor_name}-${item.party_name}`;
            let amountInCrores = item.amount / 10000000; // Convert rupees to crores
            if (contributions[key]) {
                contributions[key] += amountInCrores;
            } else {
                contributions[key] = amountInCrores;
            }
        });

        Object.entries(contributions).forEach(([contribution, amount]) => {
            const [donor, party] = contribution.split("-");

            if (amount > 100) {
                let donorIndex = nodes.findIndex((node) => node.name === donor);
                if (donorIndex === -1) {
                    nodes.push({name: donor});
                    donorIndex = nodes.length - 1;
                }

                let partyIndex = nodes.findIndex((node) => node.name === party);
                if (partyIndex === -1) {
                    nodes.push({name: party});
                    partyIndex = nodes.length - 1;
                }

                links.push({
                    source: donorIndex,
                    target: partyIndex,
                    value: amount
                });
            }
        });

        // SVG dimensions
        const width = 1200;
        const height = 800;

        // Create SVG
        const svg = d3.select("#sankey-graph").attr("width", width).attr("height", height);

        // Create Sankey layout
        const sankeyLayout = sankey().nodeWidth(50).nodePadding(20).size([width, height]);

        // Generate Sankey diagram data
        const {nodes: sankeyNodes, links: sankeyLinks} = sankeyLayout({
            nodes,
            links
        });

        // Color scale for parties
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Render links
        svg.selectAll(".link")
            .data(sankeyLinks)
            .join("path")
            .attr("class", "link")
            .attr("d", sankeyLinkHorizontal()) // <-- Import this function
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-width", (d) => Math.max(1, d.width));

        // Add hover event listeners
        svg.selectAll(".link") // Select the links again
            .on("mouseover", function (event, d) {
                // Enlarge the hovered link
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("stroke-width", 3)
                    .attr("stroke-opacity", 1);

                // Access the contribution amount value
                const contributionAmount = d.value.toFixed(2); // Access the value attribute

                // Update text element with contribution amount
                const tooltip = d3.select("#tooltip");
                tooltip
                    .html(`Contribution Amount: ${contributionAmount} crores`)
                    .style("font-size", "22px")
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY - 20 + "px")
                    .style("opacity", 1);
            })
            .on("mouseout", function () {
                // Restore original size and opacity
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("stroke-width", (d) => Math.max(1, d.width))
                    .attr("stroke-opacity", 0.5);

                // Hide the tooltip
                d3.select("#tooltip").style("opacity", 0);
            });

        // Render nodes
        const node = svg
            .selectAll(".node")
            .data(sankeyNodes)
            .join("g")
            .attr("class", "node")
            // Position at the center of the node
            .attr("transform", (d) => `translate(${d.x0},${(d.y0 + d.y1) / 2})`);

        // Add rectangles for nodes
        node.append("rect")
            .attr("x", 0)
            .attr("y", (d) => -((d.y1 - d.y0) / 2))
            .attr("height", (d) => d.y1 - d.y0)
            .attr("width", (d) => (d.x1 - d.x0) * 3)
            .attr("fill", (d) => colorScale(d.name)); // Use color scale based on party name

        // Add text for node labels
        node.append("text")
            .attr("x", 0) //TODO: Adjust this value to position the text properly
            .attr("y", 0)
            .attr("dy", "0.35em")
            .attr("text-anchor", "start")
            .text((d) => d.name)
            .style("font-size", "22px")
            .style("fill", "black");
    };

    return (
        <div className="plot-figure">
            <h1>Sankey Graph of Donors and Parties</h1>
            <svg id="sankey-graph"></svg>
            <div id="tooltip" className="tooltip"></div>
        </div>
    );
};

export default FinanceSankey;
