import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import axiosInstance from "../../axiosAPI";
import Dashboard from "./Dashboard";
import { BiShow } from "react-icons/bi";

function ParentDashboard() {
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

  const [outlets, setOutlets] = useState([]);
  const [outlet, setOutlet] = useState("main");
  const [dashboardData, setDashboardData] = useState(null);
  const [mainData, setMainData] = useState(null);
  const [allData, setAllData] = useState(null);

  const [selectedItems, setSelectedItems] = useState(["main"]);
  const [showFilters, setShowFilters] = useState(false);

  //   const [numericData, setNumericData] = useState(null);
  //   const [paymentTypes, setPaymentTypes] = useState(null);
  //   const [timelySales, setTimelySales] = useState(null);
  //   const [category, setCategory] = useState({});
  //   const [topSelling, setTopSelling] = useState([]);

  const getOutlets = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/hotel_outlets/?hotel=${hotel_id}`)
      .then((res) => {
        setOutlets(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDashboardData = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/dashboard_outlets/?hotel=${hotel_id}`)
      .then((res) => {
        setDashboardData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMainDashboardData = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/dashboard/?hotel=${hotel_id}`)
      .then((res) => {
        setMainData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDashboardData();
    getMainDashboardData();
  }, []);

  useEffect(() => {
    getOutlets();
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
    let data = allData;
    let colors = mapColorsToLabels(
      Object.keys(data["category_data"]).map((o) => o),
      labelCategoryColors
    );
    return (
      <div className="w-1/2 max-h-[50vh] m-1 flex flex-col items-center justify-around bg-white rounded-md">
        <Doughnut
          data={{
            labels: Object.keys(data["category_data"]).map((o) => o),

            datasets: [
              {
                label: "Categorical Sales",
                data: Object.values(data["category_data"]).map((o) => o),
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
              },
            },
          }}
        />
      </div>
    );
  }

  function renderTimelySales() {
    let data = allData;

    let colors = mapColorsToLabels(
      Object.keys(data["hourly_sales"]).map((o) => o),
      labelTimelyColors
    );
    return (
      <div className="w-1/2 m-1 flex flex-col items-center justify-around bg-white rounded-md">
        <Bar
          data={{
            labels: Object.keys(data["hourly_sales"]),

            datasets: [
              {
                label: "Timely Sales",
                data: Object.values(data["hourly_sales"]).map((o) => o),
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

  const sumObjectsByKey = (...objs) => {
    const res = objs.reduce((a, b) => {
      for (let k in b) {
        if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
      }
      return a;
    }, {});
    return res;
  };

  function compareTQ(a, b) {
    const q1 = a.total_quantity;
    const q2 = b.total_quantity;

    let comparison = 0;

    if (q1 < q2) {
      comparison = 1;
    } else if (q1 > q2) {
      comparison = -1;
    }
    return comparison;
  }

  useEffect(() => {
    console.log(dashboardData);
    if (mainData) {
      let AllData = {};
      let categoryData = {};
      let hourlySalesData = {};
      let top5DataDict = {};
      let paymentsDataDict = {};
      let customers = 0;
      let number_of_orders = 0;
      let total_sales = 0;

      if (selectedItems.includes("main")) {
        categoryData = mainData.category_data;
        hourlySalesData = mainData.hourly_sales;
        top5DataDict = Object.assign(
          {},
          ...mainData["top_5"].map((x) => ({ [x.products]: x.total_quantity }))
        );
        paymentsDataDict = Object.assign(
          {},
          ...mainData["payment types"]
            .filter((element) => {
              return element.payment_type !== null;
            })
            .map((x) => ({ [x.payment_type]: x.total }))
        );
        customers = mainData.customers ? mainData.customers : 0;
        number_of_orders = mainData.number_of_orders
          ? mainData.number_of_orders
          : 0;
        total_sales = mainData["total sales"] ? mainData["total sales"][0] : 0;
      }

      for (
        let i = 0;
        i < outlets.length && selectedItems.includes(outlets[i].hotel_name);
        i++
      ) {
        let OPDD = Object.assign(
          {},
          ...dashboardData[outlets[i].hotel_name]["payment types"].map((x) => ({
            [x.payment_type]: x.total,
          }))
        );
        let t5DD = Object.assign(
          {},
          ...dashboardData[outlets[i].hotel_name]["top_5"].map((x) => ({
            [x.products]: x.total_quantity,
          }))
        );

        categoryData = sumObjectsByKey(
          categoryData,
          dashboardData[outlets[i].hotel_name].category_data
        );
        hourlySalesData = sumObjectsByKey(
          hourlySalesData,
          dashboardData[outlets[i].hotel_name].hourly_sales
        );
        paymentsDataDict = sumObjectsByKey(paymentsDataDict, OPDD);
        top5DataDict = sumObjectsByKey(top5DataDict, t5DD);
        customers =
          customers +
          (dashboardData[outlets[i].hotel_name].customers
            ? dashboardData[outlets[i].hotel_name].customers
            : 0);
        number_of_orders =
          number_of_orders +
          (dashboardData[outlets[i].hotel_name].number_of_orders
            ? dashboardData[outlets[i].hotel_name].number_of_orders
            : 0);
        total_sales =
          total_sales +
          (dashboardData[outlets[i].hotel_name]["total sales"]
            ? dashboardData[outlets[i].hotel_name]["total sales"][0]
            : 0);
      }

      let T5A = Object.keys(top5DataDict).map((key) => ({
        products: key,
        total_quantity: top5DataDict[key],
      }));
      let OT5 = T5A.sort(compareTQ);

      AllData = {
        category_data: categoryData,
        hourly_sales: hourlySalesData,
        customers: customers,
        number_of_orders: number_of_orders,
        "total sales": [total_sales],
        "payment types": Object.keys(paymentsDataDict).map((key) => ({
          payment_type: key,
          total: paymentsDataDict[key],
        })),
        top_5: OT5.splice(0, 5),
      };

      setAllData(AllData);
    }
  }, [dashboardData, mainData, selectedItems]);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Main Dashboard</h1>
        {outlets && (
          <div className="flex flex-col items-end">
            <BiShow
              size="28px"
              className="text-docs-blue cursor-pointer relative bg-white px-1"
              onClick={(e) => setShowFilters(!showFilters)}
            />
            {showFilters && (
              <div className="bg-white p-2 pt-0 absolute top-12 border-2">
                <div
                  className="flex items-center"
                  onClick={(e) => {
                    if (selectedItems.includes("main")) {
                      if (selectedItems.length > 1) {
                        let si = selectedItems.filter(function (el) {
                          return el !== "main";
                        });
                        setSelectedItems(si);
                      }
                    } else {
                      setSelectedItems([...selectedItems, "main"]);
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={selectedItems.includes("main")}
                  />
                  <label className="text-docs-blue">Main</label>
                </div>

                {outlets.map((o, i) => (
                  <div
                    className="flex items-center"
                    onClick={(e) => {
                      if (selectedItems.includes(o.hotel_name)) {
                        let si = selectedItems.filter(function (el) {
                          return el !== o.hotel_name;
                        });
                        if (si.length === 0) {
                          setSelectedItems(["main"]);
                        } else {
                          setSelectedItems(si);
                        }
                      } else {
                        setSelectedItems([...selectedItems, o.hotel_name]);
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      className="mr-1"
                      checked={selectedItems.includes(o.hotel_name)}
                    />
                    <label className="text-docs-blue">{o.hotel_name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* {outlet === "main" ? (
        <Dashboard isParent={true} setMainData={setMainData} />
      ) : outlet === "combined" ? ( */}
      {allData ? (
        <>
          <div className="mx-4 mt-5 mb-4 h-[35vh] flex justify-between">
            <div className="w-1/4 m-1 bg-white rounded-md p-4 flex flex-col items-center justify-around">
              <p className="text-lg font-semibold">Day Sales Value</p>
              <p>
                {allData && allData["total sales"]
                  ? allData["total sales"]
                  : "0"}
              </p>
              <p className="text-lg font-semibold">Number of Orders</p>
              <p>
                {" "}
                {allData && allData["number_of_orders"]
                  ? allData["number_of_orders"]
                  : "0"}
              </p>
              <p className="text-lg font-semibold">Added Customers</p>
              <p>
                {" "}
                {allData && allData["customers"] ? allData["customers"] : "0"}
              </p>
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
                  {allData["payment types"] &&
                    allData["payment types"].map((paymentType, index) => (
                      <tr>
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

            {allData["hourly_sales"] && renderTimelySales()}
          </div>

          <div className="mx-4 mb-2  flex">
            <div className="w-1/2 h-fit bg-white rounded-md m-1 flex flex-col items-center justify-around">
              <p className="text-lg font-semibold m-2">
                Top 5 Selling Products
              </p>
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
                  {allData["top_5"] &&
                    allData["top_5"].map((product, index) => (
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

            {allData["category_data"] && renderCategoryData()}
          </div>
        </>
      ) : (
        <></>
      )}
      {/* ) : (
        <>
          <div className="mx-4 mt-5 mb-4 h-[35vh] flex justify-between">
            <div className="w-1/4 m-1 bg-white rounded-md p-4 flex flex-col items-center justify-around">
              <p className="text-lg font-semibold">Day Sales Value</p>
              <p>
                {dashboardData && dashboardData[outlet]["total sales"]
                  ? dashboardData[outlet]["total sales"]
                  : "0"}
              </p>
              <p className="text-lg font-semibold">Number of Orders</p>
              <p>
                {" "}
                {dashboardData && dashboardData[outlet]["number_of_orders"]
                  ? dashboardData[outlet]["number_of_orders"]
                  : "0"}
              </p>
              <p className="text-lg font-semibold">Added Customers</p>
              <p>
                {" "}
                {dashboardData && dashboardData[outlet]["customers"]
                  ? dashboardData[outlet]["customers"]
                  : "0"}
              </p>
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
                  {dashboardData[outlet]["payment types"] &&
                    dashboardData[outlet]["payment types"].map(
                      (paymentType, index) => (
                        <tr>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                            {paymentType.payment_type}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                            {paymentType.total}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>

            {dashboardData[outlet]["hourly_sales"] && renderTimelySales()}
          </div>

          <div className="mx-4 mb-2  flex">
            <div className="w-1/2 h-fit bg-white rounded-md m-1 flex flex-col items-center justify-around">
              <p className="text-lg font-semibold m-2">
                Top 5 Selling Products
              </p>
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
                  {dashboardData[outlet]["top_5"] &&
                    dashboardData[outlet]["top_5"].map((product, index) => (
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

            {dashboardData[outlet]["category_data"] && renderCategoryData()}
          </div>
        </>
      )} */}
    </div>
  );
}

export default ParentDashboard;
