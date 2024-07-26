import React from "react";

const LineChartTest = ({
  start,
  finish,
  data = [],
  color,
  maxHeight = 100,
  maxWeight = 1250,
}) => {
  const mapDataToCoordinates = (data, width, height) => {
    const maxValue = Math.max(
      ...data.map((item) => (item.value ? item.value : 1))
    );
    const xInterval = (width - 40) / (data.length - 1);
    const yInterval = (height - 40) / maxValue;

    return data.slice(start, finish).map((item, index) => ({
      x: 10 + index * xInterval,
      y: 10 + height - 20 - (item.value ? item.value : 1) * yInterval,
      value: item.value ? item.value : 1,
      name: item.name,
    }));
  };

  const coordinates = mapDataToCoordinates(data, maxWeight, maxHeight);

  const linePath = coordinates.reduce(
    (path, coord, index) =>
      index === 0
        ? `M${coord.x},${coord.y}`
        : `${path} C${coord.x - 10},${coord.y} ${coord.x - 10},${coord.y} ${
            coord.x
          },${coord.y}`,
    ""
  );

  return (
    <div className="" style={{ width: "100%", height: "100%" }}>
      <svg style={{ width: "100%", height: "100%" }}>
        <path d={linePath} fill="none" stroke={color} strokeWidth="3" />

        {coordinates.map((coord, index, row) => (
          <text
            key={index}
            x={coord.x}
            y={coord.y - 5}
            textAnchor="middle"
            fill="black"
            fontSize="12px"
          >
            {index % 2 === 0
              ? coord.value
              : coord.name === "Dec" || coord.name === "2020"
              ? coord.value
              : ""}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default LineChartTest;
