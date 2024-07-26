import React from "react";
// Import Highcharts
import Highcharts from "highcharts/highstock";
import HcMore from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";

HcMore(Highcharts);

const Windrose = ({ data, colors }) => {
  const options = {
    series: data,

    chart: {
      polar: true,
      type: "column",
    },

    colors: colors,

    // title: {
    //   text: "Wind rose for South Shore Met Station, Oregon",
    // },

    pane: {
      size: "85%",
    },

    legend: {
      align: "right",
      verticalAlign: "top",
      y: 100,
      layout: "vertical",
    },

    xAxis: {
      tickmarkPlacement: "on",
      categories: [
        "N",
        "",
        "",
        "",
        "E",
        "",
        "",
        "",
        "S",
        "",
        "",
        "",
        "W",
        "",
        "",
        "",
      ],
      lineWidth: 0,
    },

    yAxis: {
      min: 0,
      // max: 6,
      endOnTick: false,
      showLastLabel: true,
      title: {
        text: "Frequency (%)",
      },
      labels: {
        formatter: function () {
          return this.value + "%";
        },
      },
      reversedStacks: false,
    },

    // colors: ["rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.2)"],

    tooltip: {
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
    },

    plotOptions: {
      series: {
        stacking: "normal",
        shadow: false,
        groupPadding: 0,
        pointPlacement: "on",
        // events: {
        //   click: function (event) {
        //     console.log(event);
        //     // Tampilkan pesan peringatan saat mengklik data
        //     alert(
        //       `Anda mengklik data dengan nilai: ${event.point.y} pada seri: ${event.point.series.name}`
        //     );
        //   },
        // },
      },
    },
  };
  return (
    <div className="">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Windrose;
