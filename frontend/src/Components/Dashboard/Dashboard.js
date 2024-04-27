import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import axiosInstance from "../../axiosAPI";

function Dashboard({ isParent,setMainData }) {
  let COLORS = [
    "#EF476F",
    "#FFD166",
    "#06D6A0",
    "#118AB2",
    "#073B4C",
    "#8093f1",
    "#25a18e",
    "#ffcad4",
    "#EF476F",
    "#FFD166",
    "#06D6A0",
    "#118AB2",
    "#073B4C",
    "#8093f1",
    "#25a18e",
    "#ffcad4",
    "#EF476F",
    "#FFD166",
    "#06D6A0",
    "#118AB2",
    "#073B4C",
    "#8093f1",
    "#25a18e",
    "#ffcad4",
  ];

  const [numericData, setNumericData] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState(null);
  const [timelySales, setTimelySales] = useState(null);
  const [category, setCategory] = useState({});
  const [topSelling, setTopSelling] = useState([]);

  const getDashboardData = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/dashboard/?hotel=${hotel_id}`)
      .then((res) => {
        console.log(res.data);
        if(setMainData){
          setMainData(res.data)
        }
        setPaymentTypes(res.data["payment types"]);
        setNumericData({
          customers: res.data.customers,
          orders: res.data.number_of_orders,
          sales: res.data["total sales"][0],
        });
        setTopSelling(res.data["top_5"]);
        setCategory(res.data["category_data"]);
        setTimelySales(res.data["hourly_sales"]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  let labelCategoryColors = {}; // colors used for each label
  let labelTimelyColors = {};

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

  function renderCategoryData() {
    let colors = mapColorsToLabels(
      Object.keys(category).map((o) => o),
      labelCategoryColors
    );
    return (
      <div className="w-1/2 max-h-[50vh] m-1 flex flex-col items-center justify-around bg-white rounded-md">
        <Doughnut
          data={{
            labels: Object.keys(category).map((o) => o),

            datasets: [
              {
                label: "Categorical Sales",
                data: Object.values(category).map((o) => o),
                backgroundColor: colors,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Categorical Revenue",
              },
              legend: {
                display: false,
                // position: 'right',
                // rtl : true,
                // labels: {
                //   usePointStyle: true,
                //   pointStyle: 'circle',
                //   padding: 20,
                // }
              },
            },
          }}
        />
      </div>
    );
  }

  function renderTimelySales() {
    let colors = mapColorsToLabels(
      Object.keys(timelySales).map((o) => o),
      labelTimelyColors
    );
    return (
      <div className="w-1/2 m-1 flex flex-col items-center justify-around bg-white rounded-md">
        <Bar
          data={{
            labels: Object.keys(timelySales),

            datasets: [
              {
                label: "Timely Sales",
                data: Object.values(timelySales).map((o) => o),
                backgroundColor: colors,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Hourly Sales",
              },
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {!isParent ? (
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      ) : (
        <></>
      )}

      <div className="mx-4 mt-5 mb-4 h-[35vh] flex justify-between">
        <div className="w-1/4 m-1 bg-white rounded-md p-4 flex flex-col items-center justify-around">
          <p className="text-lg font-semibold">Day Sales Value</p>
          <p>
            {numericData && numericData["sales"] ? numericData["sales"] : "0"}
          </p>
          <p className="text-lg font-semibold">Number of Orders</p>
          <p>{numericData ? numericData["orders"] : "-"}</p>
          <p className="text-lg font-semibold">Added Customers</p>
          <p>{numericData ? numericData["customers"] : "-"}</p>
        </div>

        <div className="w-1/4 h-fit bg-white rounded-md m-1 flex flex-col items-center justify-around">
          <p className="text-lg font-semibold m-2">Payments Summary</p>
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentTypes &&
                paymentTypes.map((paymentType, index) => (
                  paymentType.payment_type && <tr>
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                      {paymentType.payment_type}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                      {paymentType.total}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {timelySales && renderTimelySales()}
      </div>

      <div className="mx-4 mb-2  flex">
        <div className="w-1/2 h-fit bg-white rounded-md m-1 flex flex-col items-center justify-around">
          <p className="text-lg font-semibold m-2">Top 5 Selling Products</p>
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Units Sold
                </th>
              </tr>
            </thead>
            <tbody>
              {topSelling &&
                topSelling.map((product, index) => (
                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {product.products}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {product.total_quantity}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {category && renderCategoryData()}
      </div>
    </div>
  );
}

export default Dashboard;
