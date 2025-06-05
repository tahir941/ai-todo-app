import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const ProgressChart = ({ completed, total }) => {
  const remaining = total - completed;

  const data = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [completed, remaining],
        backgroundColor: ['#4CAF50', '#e0e0e0'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  return (
    <div style={{ width: '250px', margin: 'auto' }}>
      <Doughnut data={data} options={options} />
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        {completed}/{total} Tasks Completed
      </p>
    </div>
  );
};

export default ProgressChart;
