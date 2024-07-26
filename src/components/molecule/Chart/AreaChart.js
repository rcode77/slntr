import React from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = ({
  data,
  height,
  colors,
  positionTitle,
  title,
  styleTitle,
  sizeMarker = 0,
  colorsMarker,
  minLineChartValue = undefined,
  maxLineChartValue = undefined,
}) => {
  // example data from dataLine.data

  const series = data;

  const options = {
    chart: {
      type: "line",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: false,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
    },
    grid: {
      row: {
        colors: ["transparent"], // Set the background color to transparent
        opacity: 0.5,
      },
    },
    stroke: {
      curve: "smooth",
    },
    colors: colors,
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
    },
    markers: {
      size: sizeMarker,
      colors: colorsMarker,
      strokeColors: ["#fff"],
      strokeWidth: 2,
    },
    fill: {
      type: "solid", // Set the type to "solid" for no gradient
    },
    // fill: {
    //   type: "",
    //   // type: "gradient",
    //   // gradient: {
    //   //   shadeIntensity: 1,
    //   //   inverseColors: false,
    //   //   opacityFrom: 0.5,
    //   //   opacityTo: 0,
    //   //   stops: [0, 90, 100],
    //   // },
    // },
    yaxis: {
      min: minLineChartValue,
      max: maxLineChartValue,
      labels: {
        formatter: function (val) {
          return val.toFixed(1);
        },
      },
      title: {
        text: title,
        style: styleTitle,
        rotate: positionTitle ? 90 : -90,
      },
      opposite: positionTitle,
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      shared: true,
      y: {
        formatter: function (val) {
          return val.toFixed(1);
        },
      },
      x: {
        formatter: function (val) {
          const date = new Date(val);
          const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
          };
          return date.toLocaleDateString("en-US", options);
        },
      },
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={height}
      />
    </div>
  );
};

export default AreaChart;
