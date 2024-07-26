import ReactApexChart from "react-apexcharts";

const ApexChart = ({ data, categories, colors }) => {
  const series = data;
  const options = {
    chart: {
      type: "polarArea",
    },
    labels: categories,
    stroke: {
      colors: ["#fff"],
      width: 3,
    },
    colors: colors,
    fill: {
      opacity: 0.8,
    },
    legend: {
      position: "right",
      //   customLegendItems: categories,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="polarArea" />
    </div>
  );
};

export default ApexChart;
