import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';


const Finance2 = () => {
 const [data, setData] = useState([]);


 useEffect(() => {
   async function fetchData() {
     try {
       const response = await fetch('/api/campaign-finance/MEGHA ENGINEERING AND INFRASTRUCTURES LTD/BJP');
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
    renderChart();
  }
}, [data]);

const renderChart = () => {
  const donors = {};
  data.forEach(item => {
    if (!donors[item.donor_name]) {
      donors[item.donor_name] = item.amount;
    } else {
      donors[item.donor_name] += item.amount;
    }
  });

  // Sort donors by donation amount in descending order
  const sortedDonors = Object.entries(donors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10); // Select top 10 donors

  const xValues = sortedDonors.map(([donor]) => donor);
  const yValues = sortedDonors.map(([, amount]) => amount);

  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: xValues,
      datasets: [
        {
          label: 'Total Donation Amount',
          data: yValues,
          backgroundColor: 'rgba(0, 123, 255, 0.6)', // Blue color
          borderColor: 'rgba(0, 123, 255, 1)', // Border color
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total Donation Amount',
          },
          ticks: {
            callback: function(value, index, values) {
              return '₹' + value.toLocaleString(); // Format as currency
            },
          },
        },
        x: {
          title: {
            display: true,
            text: 'Donor Name',
          },
        },
      },
    },
  });
};

return (
  <div className="plot-figure">
    <h1>Top 10 Donors by Donation Amount</h1>
    <canvas id="myChart" width="400" height="200"></canvas>
  </div>
);
};
 export default Finance2;