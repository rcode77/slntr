import React from "react";
import ReactApexChart from "react-apexcharts";

const CustomBarChart = ({
  data,
  categories,
  colors,
  height = 130,
  width = "20%",
  title,
  styleTitle,
  maxCount,
  min,
  positionTitle,
  enabled = true,
}) => {
  const series = [{ name: "Curah Hujan", data: [data] }];

  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true,
      },
      background: "transparent",
    },
    colors: ["#40B7D5"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "100%",
        endingShape: "rounded",
        borderRadius: 3, // Adjust the border radius value as needed
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Curah Hujan"],
      floating: true,
      axisTicks: {
        show: true,
        borderType: "solid",
        color: "#78909C",
      },
    },
    yaxis: {
      max: maxCount,
      show: false,
      labels: {
        formatter: function (val) {
          return val.toFixed(1);
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ["#40B7D5"],
    },
    tooltip: {
      enabled: enabled,
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    grid: {
      borderColor: "transparent", // Remove grid border
    },
  };

  return (
    <div id="chart" className="">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        width={width}
        height={height}
      />
    </div>
  );
};

export default CustomBarChart;
