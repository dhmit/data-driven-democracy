import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const PieChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/all-campaign-finance/');
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

        const labels = sortedDonors.map(([donor]) => donor);
        const amounts = sortedDonors.map(([, amount]) => amount);

        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Top 10 Donors by Donation Amount',
                        data: amounts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 0, 0, 0.6)',
                            'rgba(0, 255, 0, 0.6)',
                            'rgba(0, 0, 255, 0.6)',
                            'rgba(128, 128, 128, 0.6)',
                        ],
                        borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)',
                          'rgba(255, 0, 0, 1)',
                          'rgba(0, 255, 0, 1)',
                          'rgba(0, 0, 255, 1)',
                          'rgba(128, 128, 128, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Top 10 Donors by Donation Amount',
                    },
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20,
                        left: 20,
                        right: 20,
                    },
                },
                radius: '60%', // Adjust the size of the pie chart
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

export default PieChart;