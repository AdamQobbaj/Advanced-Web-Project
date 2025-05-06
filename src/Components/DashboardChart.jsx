import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

// Register required components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
function DashboardChart({ labels, dataValues }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Define a preset palette
  const backgroundPalette = [
    'rgba(0, 173, 181, 0.6)',
    'rgba(255, 193, 7, 0.6)',
    'rgba(40, 167, 69, 0.6)',
    'rgba(108, 92, 231, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(153, 102, 255, 0.6)',
  ];

  const borderPalette = [
    'rgba(0, 173, 181, 1)',
    'rgba(255, 193, 7, 1)',
    'rgba(40, 167, 69, 1)',
    'rgba(108, 92, 231, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(153, 102, 255, 1)',
  ];

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Count',
          data: dataValues,
          backgroundColor: backgroundPalette.slice(0, dataValues.length),
          borderColor: borderPalette.slice(0, dataValues.length),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#fff' }
          }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [labels, dataValues]);

  return (
    <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default DashboardChart;
