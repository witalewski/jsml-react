import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import KNN from "ml-knn";
import { colors } from "../utils/colors";

const data = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 }
];

const shuffleArray = arr => {
  let targetArr = [...arr];
  for (var i = targetArr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = targetArr[i];
    targetArr[i] = targetArr[j];
    targetArr[j] = temp;
  }
  return targetArr;
};

export const KNearestNeighbours = ({ data }) => {
  const seperationSize = 0.7 * data.length;

  const shuffledData = shuffleArray(data);

  let keys = Object.keys(shuffledData[0]);
  let keysHead = keys.slice(0, keys.length - 1);
  let keysTail = keys[keys.length - 1];

  let X = shuffledData.map(el => keysHead.map(key => el[key]));

  let types = [...new Set(shuffledData.map(el => el[keysTail]))];
  let y = shuffledData.map(el => types.indexOf(el[keysTail]));

  let trainingSetX = X.slice(0, seperationSize);
  let trainingSetY = y.slice(0, seperationSize);
  let testSetX = X.slice(seperationSize);
  let testSetY = y.slice(seperationSize);

  let knnModel = new KNN(trainingSetX, trainingSetY, { k: 7 });

  const result = knnModel.predict(testSetX);
  const misclassifications = result.filter((el, i) => el !== testSetY[i])
    .length;

  console.clear();
  console.log(
    `Test Set Size = ${
      testSetX.length
    } and number of Misclassifications = ${misclassifications}`
  );

  const chartData = testSetX.map((el, i) => ({
    ...keysHead.reduce(
      (acc, key) => ({
        ...acc,
        [key]: el[keys.indexOf(key)]
      }),
      {}
    ),
    [keysTail]: types[result[i]]
  }));

  console.log(chartData);
  let subChartsIndices = keysHead.map((_, i) => i).filter(i => i % 2 === 0);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div>
          {subChartsIndices.map(i => {
            const labels = [keysHead[i], keysHead[(i + 1) % keysHead.length]];
            return (
              <ScatterChart
                key={`${labels[0]}-${labels[1]}`}
                data={chartData}
                width={width}
                height={height / subChartsIndices.length}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis dataKey={labels[0]} type="number" name={labels[0]} />
                <YAxis dataKey={labels[1]} type="number" name={labels[1]} />
                {types.map((type, i) => (
                  <Scatter
                    key={type}
                    data={chartData.filter(el => el.type === type)}
                    fill={colors[i]}
                  />
                ))}
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Legend
                  payload={types.map((type, i) => ({
                    value: type,
                    type: "circle",
                    color: colors[i]
                  }))}
                />
              </ScatterChart>
            );
          })}
        </div>
      )}
    </AutoSizer>
  );
};
