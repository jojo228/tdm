import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import axiosInstance from "../../axiosAPI";

function PieChart({ outlet }) {
  let COLORS = ["#EF476F", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"];

  let labelColors = {};

  const [data, setData] = useState({});

  function intersect(a, b) {
    var setA = new Set(a);
    var setB = new Set(b);
    var intersection = new Set([...setA].filter((x) => setB.has(x)));
    return Array.from(intersection);
  }

  const mapColorsToLabels = (labels, item) => {
    const usedKeys = intersect(Object.keys(item), labels);
    let firstAvailColor = usedKeys.length; // sensible place to start looking for new colors

    let chartColors = [];
    let usedColors = {};

    // get previously used colors for all labels in current report
    usedKeys.forEach((label) => {
      usedColors[item[label]] = true;
    });

    labels.forEach((label) => {
      // if we've never seen this label before
      if (!item[label]) {
        while (usedColors[COLORS[firstAvailColor]]) {
          // if we are already using this color, get the next color
          firstAvailColor += 1;
        }
        // if we are not already using this color, save it
        item[label] = COLORS[firstAvailColor];
        firstAvailColor += 1;
      }

      // add color for new label to array that we will push to Chart.js
      chartColors.push(item[label]);
    });

    // return 1D array of colors assigned to current labels
    return chartColors;
  };

  let colors = mapColorsToLabels(
    Object.keys(data).map((o) => o),
    labelColors
  );

  const getData = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;
    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(
        `/expense_dashboard?hotel=${outlet !== undefined ? outlet : hotel_id}`
      )
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, [outlet]);

  return (
    <div className="w-1/4 m-1 p-1 py-4 h-fit bg-white rounded-md">
      <Pie
        data={{
          labels: Object.keys(data).map((o) => o),

          datasets: [
            {
              label: "Amount Spent",
              data: Object.values(data).map((o) => o),
              backgroundColor: colors,
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Categorical Expenses",
            },
            legend: {
              display: true,
            },
          },
        }}
      />
    </div>
  );
}

export default PieChart;
