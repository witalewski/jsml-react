import React from "react";
import "../index.css";
import { storiesOf } from "@storybook/react";
import { withKnobs, select } from "@storybook/addon-knobs";
import { jsxDecorator } from "storybook-addon-jsx";
import { KNearestNeighbours } from "../components/KNearestNeighbours";
import irisData from "../data/iris.json";

storiesOf("KNearestNeighbours", module)
  .addDecorator(withKnobs)
  .addDecorator(jsxDecorator)
  .add("irisData", () => <KNearestNeighbours data={irisData} />);
