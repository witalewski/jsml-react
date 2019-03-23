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

  let benchmarkStart = performance.now();
  let knnModel = new KNN(trainingSetX, trainingSetY, { k: 3 });
  let benchmarkEnd = performance.now();

  const result = knnModel.predict(testSetX);
  const misclassifications = result.filter((el, i) => el !== testSetY[i])
    .length;

  const log = [
    `Test Set Size = ${testSetX.length}`,
    `Number of Misclassifications = ${misclassifications}`,
    `Time: ${benchmarkEnd - benchmarkStart} ms`
  ];

  const chartData = testSetX.map((el, i) => ({
    ...keysHead.reduce(
      (acc, key) => ({
        ...acc,
        [key]: el[keys.indexOf(key)]
      }),
      {}
    ),
    [keysTail]: types[result[i]],
    isPredictionCorrect: result[i] === testSetY[i]
  }));
  console.log(chartData);

  let subChartsIndices = keysHead
    .map(i => keysHead.map(j => [i, j]))
    .reduce((a, b) => [...a, ...b])
    .filter(el => el[0] !== el[1]);

  return (
    <AutoSizer style={{ width: "100%" }}>
      {({ height, width }) => (
        <div>
          {subChartsIndices.map(ch => {
            return (
              <>
                <h2 style={{ textAlign: "center" }}>{`${ch[1]} (y) vs. ${
                  ch[0]
                } (x)`}</h2>
                <ScatterChart
                  key={`${ch[0]}-${ch[1]}`}
                  data={chartData}
                  width={width}
                  height={300}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis dataKey={ch[0]} type="number" name={ch[0]} />
                  <YAxis dataKey={ch[1]} type="number" name={ch[1]} />

                  {[
                    ...types.map((type, i) => ({
                      key: `${ch[0]}-${ch[1]}-expected-${type}`,
                      fill: colors[i],
                      shape: "wye",
                      type,
                      data: chartData.filter(
                        (_, j) =>
                          types[testSetY[j]] === type &&
                          result[j] !== testSetY[j]
                      )
                    })),
                    ...types.map((type, i) => ({
                      key: `${ch[0]}-${ch[1]}-results-${type}`,
                      fill: colors[i],
                      shape: "triangle",
                      type,
                      data: chartData.filter(el => el[keysTail] === type)
                    }))
                  ]
                    .filter(serie => serie.data.length > 0)
                    .map(serie => (
                      <Scatter {...serie} />
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
              </>
            );
          })}
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
