import React from "react";
import ReactApexChart from "react-apexcharts";

const LineChartCustome = ({ height = 150, colors = "#2E93fA", data = [] }) => {
  const series = [
    {
      name: "series-1",
      data: data,
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      //   curve: "straight",
      curve: "smooth",
    },
    grid: {
      show: false, // Remove the grid lines
    },
    colors: [colors],
    xaxis: {
      axisBorder: {
        show: false, // Remove the x-axis line
      },
      labels: {
        show: false, // Hide the x-axis labels
      },
      categories: [], // Remove the x-axis categories
    },
    yaxis: {
      show: false, // Remove the y-axis labels and lines
    },
    tooltip: {
      enabled: false,
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={height}
      />
    </div>
  );
};

export default LineChartCustome;
