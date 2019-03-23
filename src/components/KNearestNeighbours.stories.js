import React from "react";
import "../index.css";
import { storiesOf } from "@storybook/react";
import { withKnobs, select } from "@storybook/addon-knobs";
import { jsxDecorator } from "storybook-addon-jsx";
import { KNearestNeighbours } from "../components/KNearestNeighbours";
import irisData from "../data/iris.json";
import winesData from "../data/wines.json";

storiesOf("KNearestNeighbours", module)
  .addDecorator(withKnobs)
  .addDecorator(jsxDecorator)
  .add("irisData", () => <KNearestNeighbours data={irisData} />)
  .add("winesData", () => <KNearestNeighbours data={winesData} />);
