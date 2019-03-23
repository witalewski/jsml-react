import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { SLR } from "ml-regression";
import { colors } from "../utils/colors";

export const LinearRegression = ({ data, seriesKey, labelKey }) => {
  let [X, y] = data.reduce(
    (acc, el) => [[...acc[0], el[labelKey]], [...acc[1], el[seriesKey]]],
    [[], []]
  );
  const benchmarkStart = performance.now();
  let regressionModel = new SLR(X, y);
  const benchmarkEnd = performance.now();
  const log = [`Time: ${benchmarkEnd - benchmarkStart} ms`];
  let predictionLabel = `${seriesKey}PredictedBy${labelKey[0].toUpperCase()}${labelKey.substr(
    1
  )}`;
  const processedData = data
    .sort((a, b) => a[labelKey] - b[labelKey])
    .map(el => ({
      ...el,
      [predictionLabel]: regressionModel.predict(el[seriesKey])
    }));
  return (
    <AutoSizer>
      {({ height, width }) => (
        <div>
          <LineChart
            width={width}
            height={height}
            data={processedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={labelKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={seriesKey}
              stroke={colors[0]}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey={predictionLabel}
              stroke={colors[1]}
              dot={false}
            />
          </LineChart>
          <div
            style={{
              position: "absolute",
              background: "#ffffff",
              padding: "10px"
            }}
          >
            {log.map(el => (
              <p>{el}</p>
            ))}
          </div>
        </div>
      )}
    </AutoSizer>
  );
};
