import React, { useState, useEffect } from 'react';
import * as d3 from 'd3'; // Import all D3 functions

const BubbleChart = () => {
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
      renderChart();
    }
  }, [data]);

  const renderChart = () => {
    const contributions = {};
    data.forEach((item) => {
      const key = `${item.donor_name}-${item.party_name}`;
      let amountInCrores = item.amount / 10000000; // Convert rupees to crores
      if (contributions[key]) {
        contributions[key] += amountInCrores;
      } else {
        contributions[key] = amountInCrores;
      }
    });

    console.log("Rendering chart with data:", contributions); // Log data before rendering the chart

    // Check if data is available
    if (Object.keys(contributions).length === 0) {
      console.warn("No data available for chart rendering.");
      return;
    }

    // Sort contributions by contribution amount in descending order
    const sortedContributions = Object.entries(contributions)
      .sort((a, b) => b[1] - a[1]); // Sort in descending order

    // Limit data to top 100 donors
    const topContributions = sortedContributions.slice(0, 100);

    const width = 1000;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    // Scale for circle sizes based on data values
    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(topContributions.map(d => d[1]))]) // Use top contributions for domain calculation
      .range([5, 50]); // Adjust the range for desired bubble sizes

    // Define a color scale for bubbles based on party names
    const colorScale = d3.scaleOrdinal()
      .domain(topContributions.map(d => d[0])) // Use top contributions for domain
      .range(d3.schemeCategory10); // Use a predefined color scheme

    console.log("Data before data binding:", topContributions);

    // Create bubbles based on top contributions
    const svg = d3.select("#bubble-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg.selectAll("circle")
      .data(topContributions) // Use top contributions
      .enter()
      .append("circle")
      .attr("cx", d => Math.random() * (width - margin.left - margin.right) + margin.left) // Random x-position within the chart area
      .attr("cy", d => Math.random() * (height - margin.top - margin.bottom) + margin.top) // Random y-position within the chart area
      .attr("r", d => radiusScale(d[1])) // Use d[1] to access the value in each key-value pair
      .attr("fill", (d, i) => colorScale(d[0])) // Color based on party name
      .attr("opacity", 0.7)
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`<strong>${d[0]}</strong><br>Contribution: ${d[1]} crores`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
        d3.select(event.currentTarget).attr("stroke", "black").attr("stroke-width", 2);
      })
      .on("mouseout", (event, d) => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
        d3.select(event.currentTarget).attr("stroke", "none");
      });
      // .append("title")
      // .text(d => `${d[0]}: ${d[1]}`); // Tooltip text using key-value pairs

    // Log a message after rendering the chart
    console.log("Chart rendered successfully!");
  };

  return (
    <div className="plot-figure">
      <h1>Top 10 Donors by Donation Amount</h1>
      <div id="bubble-chart"></div>
    </div>

  ); // Placeholder for the chart
};

export default BubbleChart;


// import React, { useState, useEffect } from 'react';
// import * as d3 from 'd3'; // Import all D3 functions

// const BubbleChart = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch("/api/all-campaign-finance/");
//         const jsonData = await response.json();
//         console.log("Fetched data:", jsonData); // Log fetched data to the console
//         setData(jsonData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (data.length > 0) {
//       renderChart();
//     }
//   }, [data]);

//   const renderChart = () => {
//     const contributions = {};
//     data.forEach((item) => {
//       const key = `${item.donor_name}-${item.party_name}`;
//       let amountInCrores = item.amount / 10000000; // Convert rupees to crores
//       if (contributions[key]) {
//         contributions[key] += amountInCrores;
//       } else {
//         contributions[key] = amountInCrores;
//       }
//     });

//     console.log("Rendering chart with data:", contributions); // Log data before rendering the chart

//     // Check if data is available
//     if (Object.keys(contributions).length === 0) {
//       console.warn("No data available for chart rendering.");
//       return;
//     }

//     // Sort contributions by contribution amount in descending order
//     const sortedContributions = Object.entries(contributions)
//       .sort((a, b) => b[1] - a[1]); // Sort in descending order

//     // Limit data to top 100 donors
//     const topContributions = sortedContributions.slice(0, 100);

//     const width = 600;
//     const height = 400;
//     const margin = { top: 20, right: 20, bottom: 50, left: 50 };

//     // Scale for circle sizes based on data values
//     const radiusScale = d3.scaleSqrt()
//       .domain([0, d3.max(topContributions.map(d => d[1]))]) // Use top contributions for domain calculation
//       .range([5, 50]); // Adjust the range for desired bubble sizes

//     // Define a color scale for bubbles based on party names
//     const colorScale = d3.scaleOrdinal()
//       .domain(topContributions.map(d => d[0])) // Use top contributions for domain
//       .range(d3.schemeCategory10); // Use a predefined color scheme

//     console.log("Data before data binding:", topContributions);

//     // Create bubbles based on top contributions
//     const svg = d3.select("#bubble-chart")
//       .append("svg")
//       .attr("width", width)
//       .attr("height", height);

//     svg.selectAll("circle")
//       .data(topContributions) // Use top contributions
//       .enter()
//       .append("circle")
//       .attr("cx", d => Math.random() * (width - margin.left - margin.right) + margin.left) // Random x-position within the chart area
//       .attr("cy", d => Math.random() * (height - margin.top - margin.bottom) + margin.top) // Random y-position within the chart area
//       .attr("r", d => radiusScale(d[1])) // Use d[1] to access the value in each key-value pair
//       .attr("fill", (d, i) => colorScale(d[0])) // Color based on party name
//       .attr("opacity", 0.7)
//       .append("title")
//       .text(d => `${d[0]}: ${d[1]}`); // Tooltip text using key-value pairs

//     // Log a message after rendering the chart
//     console.log("Chart rendered successfully!");
//   };

//   return <div id="bubble-chart"></div>; // Placeholder for the chart
// };

// export default BubbleChart;
