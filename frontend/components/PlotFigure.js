import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';


const PlotFigure = () => {
 const [data, setData] = useState([]);


 useEffect(() => {
   async function fetchData() {
     try {
       const response = await fetch('/api/electoral-bonds-denominations/');
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
   const thresholdValue = 10000000000; // Set your threshold value here
   const parties = {};
  
   data.forEach(item => {
     if (!parties[item.party_name]) {
       parties[item.party_name] = item.denomination;
     } else {
       parties[item.party_name] += item.denomination;
     }
   });


   const filteredParties = Object.entries(parties)
     .filter(([party, total]) => total > thresholdValue)
     .reduce((obj, [party, total]) => {
       obj[party] = total;
       return obj;
     }, {});


     const xValues = Object.keys(filteredParties);
     const yValues = Object.values(filteredParties).map(val => val / 1000000000); // Convert to billions
     const colors = xValues.map(party => {
       // Change color based on party name
       if (party === 'BHARTIYA JANTA PARTY (BJP)') {
         return 'rgba(255, 165, 0, 1)'; // Orange color for BJP
       } else if (party === 'INDIAN NATIONAL CONGRESS (INC)') {
         return 'rgba(0, 0, 255, 1)'; // Green color for INC
       } else if (party === 'ALL INDIA TRINAMOOL CONGRESS (TMC)') {
         return 'rgba(0, 255, 0, 1)'; // Blue for TMC
       } else if (party === 'BHARAT RASHTRA SAMITHI (BRS)') {
         return 'rgba(255, 192, 203, 1)'; // Default color
       } else if (party === 'DRAVIDA MUNNETRA KAZHAGAM (DMK)') {
         return 'rgba(255, 0, 0, 1)'; // Default color
       }
       else {
         return 'rgba(128, 128, 128, 1)';
       }
     });


     console.log('X values:', xValues); // Log xValues to the console
     console.log('Y values:', yValues); // Log yValues to the console
     const ctx = document.getElementById('myChart').getContext('2d');
     new Chart(ctx, {
       type: 'bar',
       data: {
         labels: xValues,
         datasets: [
           {
             label: 'Total Denomination (in billions)',
             data: yValues,
             backgroundColor: colors,
             borderColor: colors.map(color => color.replace('0.6', '1')), // Make border color opaque
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
               text: 'Total Denomination (Billions of Rupees)',
             },
             ticks: {
               callback: function(value, index, values) {
                 return value + 'B';
               }
             }
           },
           x: {
             title: {
               display: true,
               text: 'Party Name',
             },
           },
         },
       },
     });
   };


   return (
     <div className="plot-figure">
       <h1>Electoral Bonds Total Donations</h1>
       <canvas id="myChart" width="400" height="200"></canvas>
     </div>
   );
 };


 export default PlotFigure;