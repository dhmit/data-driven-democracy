import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import {sankey, sankeyLinkHorizontal} from "d3-sankey";

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
        
        data.forEach(item => {
            const key = `${item.donor_name}-${item.party_name}`;
            if (contributions[key]) {
                contributions[key] += item.amount;
            } else {
                contributions[key] = item.amount;
            }
        });

        Object.entries(contributions).forEach(([contribution, amount]) => {
            const [donor, party] = contribution.split("-");
            
            let donorIndex = nodes.findIndex(node => node.name === donor);
            if (donorIndex === -1) {
                nodes.push({name: donor});
                donorIndex = nodes.length - 1;
            }

            let partyIndex = nodes.findIndex(node => node.name === party);
            if (partyIndex === -1) {
                nodes.push({name: party});
                partyIndex = nodes.length - 1;
            }

            links.push({
                source: donorIndex,
                target: partyIndex,
                value: amount
            });
        });

        // SVG dimensions
        const width = 1000;
        const height = 800;

        // Create SVG
        const svg = d3.select("#sankey-graph")
            .attr("width", width)
            .attr("height", height);

        // Create Sankey layout
        const sankeyLayout = sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .size([width, height]);

        // Generate Sankey diagram data
        const {nodes: sankeyNodes, links: sankeyLinks} = sankeyLayout({
            nodes,
            links
        });

        // Render links
        svg.selectAll(".link")
            .data(sankeyLinks)
            .join("path")
            .attr("class", "link")
            .attr("d", sankeyLinkHorizontal())  // <-- Import this function
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-width", d => Math.max(1, d.width));

        // Render nodes
        const node = svg.selectAll(".node")
            .data(sankeyNodes)
            .join("g")
            .attr("class", "node")
            // Position at the center of the node
            .attr("transform", d => `translate(${d.x0},${(d.y0 + d.y1) / 2})`);

        // Add rectangles for nodes
        node.append("rect")
            .attr("x", 0)
            .attr("y", d => -((d.y1 - d.y0) / 2))
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", d => {
                if (d.name.startsWith("Donor")) return "blue";
                else return "green";
            });

        // Add text for node labels
        node.append("text")
            .attr("x", 10) //TODO: Adjust this value to position the text properly
            .attr("y", 0)
            .attr("dy", "0.35em")
            .attr("text-anchor", "start")
            .text(d => d.name)
            .style("font-size", "12px")
            .style("fill", "black");
    };
    
    return (
        <div className="plot-figure">
            <h1>Sankey Graph of Donors and Parties</h1>
            <svg id="sankey-graph"></svg>
        </div>
    );
};
   
export default FinanceSankey;