import React, { useState, useEffect } from 'react';

const PlotFigure = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/electoral-bonds-denominations/');
        const jsonData = await response.json();
        setData(jsonData);
        console.log(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      plotData();
    }
  }, [data]);

  const plotData = () => {
    const xValues = data.map(item => item.party_name);
    const yValues = data.map(item => item.denomination);

    // Check if Plotly is available in the global window object
    if (typeof window.Plotly !== 'undefined') {
      const trace = {
        x: xValues,
        y: yValues,
        mode: 'markers',
        type: 'scatter',
        marker: {
          size: 10,
        },
      };

      const layout = {
        title: 'Electoral Bonds Denominations',
        xaxis: { title: 'Party Name' },
        yaxis: { title: 'Denomination' },
      };

      window.Plotly.newPlot('scatter-plot', [trace], layout);
    } else {
      console.error('Plotly is not loaded. Make sure it is included in your HTML.');
    }
  };

  return (
    <div>
      <h1>Electoral Bonds Denominations</h1>
      {data.length > 0 ? (
        <div id="plot"></div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default PlotFigure;
