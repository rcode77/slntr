import React from "react";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import PolarChart from "./PolarChart";
import LineChart from "./LineChart";

const Chart = ({
  data,
  categories,
  height,
  bar,
  line,
  area,
  polar,
  wind,
  title,
  styleTitle,
  colors,
  positionTitle,
  sizeMarker,
  colorsMarker,
  sizeWind,
  minLineChartValue,
  maxLineChartValue,
  maxCount,
  columnWidth,
  gridColor,
  showYAxis,
  customColors,
  curentTime,
  ...props
}) => {
  return bar ? (
    <BarChart
      data={data}
      categories={categories}
      height={height}
      title={title}
      maxCount={maxCount}
      colors={colors}
      styleTitle={styleTitle}
      columnWidth={columnWidth}
      showYAxis={showYAxis}
      customColors={customColors}
      curentTime={curentTime}
      {...props}
    />
  ) : area ? (
    <AreaChart
      data={data}
      height={height}
      colors={colors}
      title={title}
      styleTitle={styleTitle}
      positionTitle={positionTitle}
      sizeMarker={sizeMarker}
      colorsMarker={colorsMarker}
      minLineChartValue={minLineChartValue}
      maxLineChartValue={maxLineChartValue}
      {...props}
    />
  ) : line ? (
    <LineChart
      data={data}
      categories={categories}
      colors={colors}
      title={title}
      styleTitle={styleTitle}
      positionTitle={positionTitle}
      sizeMarker={sizeMarker}
      colorsMarker={colorsMarker}
      minLineChartValue={minLineChartValue}
      maxLineChartValue={maxLineChartValue}
      gridColor={gridColor}
      height={height}
      {...props}
    />
  ) : polar ? (
    <PolarChart data={data} categories={categories} colors={colors} />
  ) : (
    <div className="flex justify-center w-full text-xs text-red-600 font-semibold">
      Please select bar/line
    </div>
  );
};

export default Chart;
