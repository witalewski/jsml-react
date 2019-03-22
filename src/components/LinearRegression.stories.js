import React from "react";
import "../index.css";
import { storiesOf } from "@storybook/react";
import { withKnobs, select } from "@storybook/addon-knobs";
import { jsxDecorator } from "storybook-addon-jsx";
import { LinearRegression } from "../components/LinearRegression";
import advertisingData from "../data/advertising.json";

storiesOf("LinearRegression", module)
  .addDecorator(withKnobs)
  .addDecorator(jsxDecorator)
  .add("advertisingData", () => (
    <LinearRegression
      data={advertisingData}
      seriesKey={select("seriesKey", Object.keys(advertisingData[0]), "sales")}
      labelKey={select("labelKey", Object.keys(advertisingData[0]), "radio")}
    />
  ));
