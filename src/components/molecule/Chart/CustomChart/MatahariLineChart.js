import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import Sun from "@assets/sun.png";
import { BsFillSunFill } from "react-icons/bs";

const MatahariLineChart = ({
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
  widthBorder = 2,
}) => {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    setTimeout(() => setDisplay(true), 1000);
  }, []);

  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartOptions = {
        series: data,
        chart: {
          height: height,
          type: "line",
          zoom: false, // Disable zooming
        },
        xaxis: {
          type: "category",
          ...xasis,
        },
        colors: ["rgb(202, 138, 4)"],
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
        stroke: {
          width: widthBorder, // Reduce the line border thickness
        },
      };

      const chart = new ApexCharts(chartRef.current, chartOptions);
      chart.render().then(() => {
        for (let i = 1; i <= chart.w.globals.series[0].length; i++) {
          const datapoint = chart.w.config.series[0].data[i - 1];

          chart.addPointAnnotation({
            x: datapoint.x,
            y: datapoint.y,
            marker: {
              size: 0,
            },
            image: {
              path: Sun,
              offsetY: 0,
              width: 30,
              height: 30,
            },
          });
        }
      });

      return () => {
        if (chart) {
          chart.destroy();
        }
      };
    }
  }, [chartRef.current, display]);

  return (
    <div>
      {!display ? <div>loading..</div> : <div id="chart" ref={chartRef} />}
    </div>
  );
};

export default MatahariLineChart;
