import React, { useState, useEffect } from 'react';
import { sankey } from 'd3-sankey'; // Import the sankey function from D3
//import {SankeyChart} from '@d3/sankey-component';

const SankeyGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/campaign-finance/all-parties/MEGHA ENGINEERING AND INFRASTRUCTURES LTD');
        const jsonData = await response.json();
        console.log('Fetched data:', jsonData); // Log fetched data to the console
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      renderGraph();
    }
  }, [data]);

  const renderGraph = () => {
    const nodes = {};
    const links = [];

    // Process data to create nodes and links for the Sankey graph
    data.forEach(item => {
      if (!nodes[item.source]) {
        nodes[item.source] = { name: item.source };
      }
      if (!nodes[item.target]) {
        nodes[item.target] = { name: item.target };
      }
      links.push({ source: item.source, target: item.target, value: item.value });
    });

    // Convert nodes object to array format
    const nodesArray = Object.values(nodes);

    // Create a Sankey generator
    const sankeyGenerator = sankey()
      .nodeId(d => d.name)
      .nodeWidth(20)
      .nodePadding(10)
      .extent([[0, 0], [400, 200]]); // Set the extent of the Sankey diagram

    // Process data with the Sankey generator
    const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({ nodes: nodesArray, links });

    // Render the Sankey diagram using D3.js
    const svg = d3.select('#sankey-graph')
      .attr('width', 400)
      .attr('height', 200);

    svg.append('g')
      .attr('stroke', '#000')
      .selectAll('rect')
      .data(sankeyNodes)
      .enter()
      .append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', 'blue'); // Customize the color as needed

    svg.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(sankeyLinks)
      .enter()
      .append('path')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke', '#000')
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('fill', 'none');
  };

  return (
    <div className="plot-figure">
      <h1>Sankey Graph</h1>
      <svg id="sankey-graph" width="400" height="200"></svg>
    </div>
  );
};

export default SankeyGraph;
