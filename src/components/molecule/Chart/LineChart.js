import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = ({
  data,
  height,
  colors,
  positionTitle,
  title,
  styleTitle,
  sizeMarker = 0,
  colorsMarker,
  categories,
  minLineChartValue = undefined,
  maxLineChartValue = undefined,
  gridColor = true,
  showYAxis = true,
  xasis,
  yasis,
  tooltip = {},
  floating = false,
  annotations = {},
  chart,
  refsById,
}) => {
  const series = data;

  const options = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      ...chart,
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
      strokeWidth: 0,
    },
    stroke: {
      width: 4,
    },
    grid: {
      row: {
        opacity: 0.5,
      },
      borderColor: gridColor ? "#90A4AE" : "transparent", // Remove grid border
    },
    yaxis: [
      {
        show: showYAxis,
        opposite: positionTitle ? true : false,
        axisTicks: {
          show: false,
        },
        labels: {
          formatter: function (val) {
            return val.toFixed(1);
          },
        },
        min: minLineChartValue,
        max: maxLineChartValue,
        title: {
          text: title,
          style: styleTitle,
          rotate: positionTitle ? 90 : -90,
        },
        ...yasis,
      },
    ],
    xaxis: {
      categories: categories,
      // floating: floating ? floating : categories.length > 15 ? true : false,
      floating: floating ? floating : false,
      ...xasis,
    },
    tooltip: {
      ...tooltip,
    },
    annotations: { ...annotations },
  };

  return (
    <div id="chart" className="">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={height}
        ref={refsById}
      />
    </div>
  );
};

export default LineChart;
