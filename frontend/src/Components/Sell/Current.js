import React, { useEffect, useState } from "react";
import Card from "./Card";
import Customer from "./Customer";
import Modal from "./Modal";
import Payment from "./Payment";
import axiosInstance from "./../../axiosAPI";
import SideMenuCurrents from "./SideMenuCurrents";
import {
  AiOutlineDelete,
  AiOutlineMinusCircle,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import OptionsModal from "./OptionsModal";

function Current({ type, current, tableIndex, deliveryType }) {
  const [isCharged, setIsCharged] = useState(false);

  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState();
  const [total, setTotal] = useState(0);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);

  const [customer, setCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);

  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const [orders, setOrders] = useState([]);
  const [mobile, setMobile] = useState("");
  const [isPrinted, setIsPrinted] = useState(false);

  const [ticket, setTicket] = useState(null);

  const [variantProduct, setVariantProduct] = useState(null);
  const [variantsOfProduct, setVariantsOfProduct] = useState([]);
  const [addOnsOfProduct, setAddOnsOfProduct] = useState([]);
  const [optionsModal, setOptionsModal] = useState(false);

  const [existingOrders, setExistingOrders] = useState([]);
  const [existingCustomer, setExistingCustomer] = useState(null);
  const [billId, setBillId] = useState(null);
  const [existingPrice, setExistingPrice] = useState(0);

  const addOrders = (item) => {
    // e.preventDefault();

    var added = false;

    var newOrders = [];
    var newTotal = 0;

    for (let i = 0; i < orders.length; i++) {
      if (
        orders[i].name === item.name &&
        orders[i].variant === item.variant &&
        orders[i].add_on === item.add_on
      ) {
        const newOrderItem = {
          id: orders[i].id,
          name: orders[i].name,
          item_quantity: orders[i].item_quantity + 1,
          net_price: orders[i].net_price,
          item_category_id: orders[i].item_category_id,
          tax_group_id: orders[i].tax_group_id,
          add_on: orders[i].add_on ? orders[i].add_on : [],
          variant: orders[i].variant ? orders[i].variant : -1,
          variant_name: orders[i].variant_name ? orders[i].variant_name : "",
          add_on_name: orders[i].add_on_name ? orders[i].add_on_name : [],
        };
        newTotal =
          newTotal + newOrderItem.item_quantity * newOrderItem.net_price;
        newOrders.push(newOrderItem);
        added = true;
      } else if (orders[i].name === item.name) {
        const newOrderItem = {
          id: orders[i].id,
          name: orders[i].name,
          item_quantity: orders[i].item_quantity,
          net_price: orders[i].net_price,
          item_category_id: orders[i].item_category_id,
          tax_group_id: orders[i].tax_group_id,
          add_on: orders[i].add_on ? orders[i].add_on : [],
          variant: orders[i].variant ? orders[i].variant : -1,
          variant_name: orders[i].variant_name ? orders[i].variant_name : "",
          add_on_name: orders[i].add_on_name ? orders[i].add_on_name : [],
        };
        newTotal =
          newTotal + newOrderItem.item_quantity * newOrderItem.net_price;
        newOrders.push(newOrderItem);
        added = true;
      } else {
        const newOrderItem = {
          id: orders[i].id,
          name: orders[i].name,
          item_quantity: orders[i].item_quantity,
          net_price: orders[i].net_price,
          item_category_id: orders[i].item_category_id,
          tax_group_id: orders[i].tax_group_id,
          add_on: orders[i].add_on ? orders[i].add_on : [],
          variant: orders[i].variant ? orders[i].variant : -1,
          variant_name: orders[i].variant_name ? orders[i].variant_name : "",
          add_on_name: orders[i].add_on_name ? orders[i].add_on_name : [],
        };
        newTotal =
          newTotal + newOrderItem.item_quantity * newOrderItem.net_price;
        newOrders.push(newOrderItem);
      }
    }

    console.log(newTotal);

    if (!added) {
      const newItem = {
        id: item.id,
        name: item.name,
        item_quantity: 1,
        net_price: item.net_price,
        item_category_id: getCategoryId(item.item_category_name),
        tax_group_id: getTaxId(item.tax_group_name),
        add_on: [],
        variant: -1,
        variant_name: "",
        add_on_name: [],
      };
      newTotal = newTotal + newItem.net_price;
      setOrders((prevOrders) => [...prevOrders, newItem]);
    } else {
      setOrders(newOrders);
    }

    setTotal(newTotal);
    setVariantProduct(null);
  };

  const removeOrders = (e, item) => {
    e.preventDefault();

    var removed = false;

    var newOrders = [];
    var newTotal = 0;

    for (let i = 0; i < orders.length; i++) {
      if (orders[i].name === item.name && orders[i].item_quantity > 1) {
        console.log(
          orders[i].variant,
          item.variant,
          orders[i].add_on,
          item.add_on
        );

        if (
          (orders[i].variant === -1 && orders[i].add_on.length === 0) ||
          (orders[i].variant === item.variant &&
            JSON.stringify(orders[i].add_on) === JSON.stringify(item.add_on))
        ) {
          const newOrderItem = {
            id: orders[i].id,
            name: orders[i].name,
            item_quantity: orders[i].item_quantity - 1,
            net_price: orders[i].net_price,
            item_category_id: orders[i].item_category_id,
            tax_group_id: orders[i].tax_group_id,
            add_on: orders[i].add_on ? orders[i].add_on : [],
            variant: orders[i].variant ? orders[i].variant : -1,
            variant_name: orders[i].variant_name ? orders[i].variant_name : "",
            add_on_name: orders[i].add_on_name ? orders[i].add_on_name : [],
          };
          newTotal =
            newTotal + newOrderItem.item_quantity * newOrderItem.net_price;
          newOrders.push(newOrderItem);
          removed = true;
        } else {
          const newOrderItem = {
            id: orders[i].id,
            name: orders[i].name,
            item_quantity: orders[i].item_quantity,
            net_price: orders[i].net_price,
            item_category_id: orders[i].item_category_id,
            tax_group_id: orders[i].tax_group_id,
            add_on: orders[i].add_on ? orders[i].add_on : [],
            variant: orders[i].variant ? orders[i].variant : -1,
            variant_name: orders[i].variant_name ? orders[i].variant_name : "",
            add_on_name: orders[i].add_on_name ? orders[i].add_on_name : [],
          };
          newTotal =
            newTotal + newOrderItem.item_quantity * newOrderItem.net_price;
          newOrders.push(newOrderItem);
        }
      } else if (orders[i].name !== item.name) {
        const newOrderItem = {
          id: orders[i].id,
          name: orders[i].name,
          item_quantity: orders[i].item_quantity,
          net_price: orders[i].net_price,
          item_category_id: orders[i].item_category_id,
          tax_group_id: orders[i].tax_group_id,
          add_on: orders[i].add_on ? orders[i].add_on : [],
          variant: orders[i].variant ? orders[i].variant : -1,
          variant_name: orders[i].variant_name ? orders[i].variant_name : "",
          add_on_name: orders[i].add_on_name ? orders[i].add_on_name : [],
        };
        newTotal =
          newTotal + newOrderItem.item_quantity * newOrderItem.net_price;
        newOrders.push(newOrderItem);
      } else {
        console.log(
          orders[i].variant,
          item.variant,
          orders[i].add_on,
          item.add_on
        );

        if (
          (orders[i].variant === -1 && orders[i].add_on.length === 0) ||
          (orders[i].variant === item.variant &&
            JSON.stringify(orders[i].add_on) === JSON.stringify(item.add_on))
        ) {
          removed = true;
        } else {
          const newOrderItem = {
            id: orders[i].id,
            name: orders[i].name,
            item_quantity: orders[i].item_quantity,
            net_price: orders[i].net_price,
            item_category_id: orders[i].item_category_id,
            tax_group_id: orders[i].tax_group_id,
            add_on: orders[i].add_on ? orders[i].add_on : [],
            variant: orders[i].variant ? orders[i].variant : -1,
            variant_name: orders[i].variant_name ? orders[i].variant_name : "",
            add_on_name: orders[i].add_on_name ? orders[i].add_on_name : [],
          };
          newTotal =
            newTotal + newOrderItem.item_quantity * newOrderItem.net_price;
          newOrders.push(newOrderItem);
        }
      }
    }

    console.log(newTotal);

    // if (!removed) {
    //   const newItem = {
    //     id: item.id,
    //     hotel_id: 1,
    //     hotel_name: "Hotel Combermere",
    //     name: item.name,
    //     item_quantity: 1,
    //     net_price: item.net_price,
    //     item_category_id: getCategoryId(item.item_category_name),
    //     tax_group_id: getTaxId(item.tax_group_name),
    //   };
    //   newTotal = newTotal + newItem.net_price;
    //   setOrders((prevOrders) => [...prevOrders, newItem]);
    // } else {
    setOrders(newOrders);
    // }

    setTotal(newTotal);
  };

  const deleteOrders = (e, item) => {
    e.preventDefault();

    var deleted = false;

    var newOrders = [];
    var newTotal = 0;

    for (let i = 0; i < orders.length; i++) {
      if (
        orders[i].name === item.name &&
        orders[i].variant === item.variant &&
        orders[i].add_on === item.add_on
      ) {
        deleted = true;
      } else {
        const newOrderItem = {
          id: orders[i].id,
          name: orders[i].name,
          item_quantity: orders[i].item_quantity,
          net_price: orders[i].net_price,
          item_category_id: orders[i].item_category_id,
          tax_group_id: orders[i].tax_group_id,
          add_on: orders[i].add_on ? orders[i].add_on : [],
          variant: orders[i].variant ? orders[i].variant : -1,
          variant_name: orders[i].variant_name ? orders[i].variant_name : "",
          add_on_name: orders[i].add_on_name ? orders[i].add_on_name : [],
        };
        newTotal =
          newTotal + newOrderItem.item_quantity * newOrderItem.net_price;
        newOrders.push(newOrderItem);
      }
    }

    console.log(newTotal);

    // if (!deleted) {
    //   const newItem = {
    //     id: item.id,
    //     hotel_id: 1,
    //     hotel_name: "Hotel Combermere",
    //     name: item.name,
    //     item_quantity: 1,
    //     net_price: item.net_price,
    //     item_category_id: getCategoryId(item.item_category_name),
    //     tax_group_id: getTaxId(item.tax_group_name),
    //   };
    //   newTotal = newTotal + newItem.net_price;
    //   setOrders((prevOrders) => [...prevOrders, newItem]);
    // } else {
    setOrders(newOrders);
    // }

    setTotal(newTotal);
  };

  const getCustomerByMobileNumber = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    await axiosInstance
      .get(`/customer/?hotel=${hotel_id}&mobile=${mobile}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.length > 0) {
          setCustomer(res.data[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategories = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;
    let hotel_id = localStorage.getItem("hotel_id");

    await axiosInstance
      .get(`/hotel/item_category/?id=${hotel_id}`)
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTaxes = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance
      .get("/tax_groups/")
      .then((res) => {
        setTaxes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getItems = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;
    let hotel_id = localStorage.getItem("hotel_id");

    await axiosInstance
      .get(`/items/?id=${hotel_id}`)
      .then((res) => {
        console.log(res.data);
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategoryId = (categoryName) => {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].item_category_name === categoryName) {
        return categories[i].item_category_id;
      }
    }
    return -1;
  };

  const getTaxId = (taxName) => {
    for (let i = 0; i < taxes.length; i++) {
      if (taxes[i].tax_group_name === taxName) {
        return taxes[i].tax_group_id;
      }
    }
    return -1;
  };

  useEffect(() => {
    if (mobile.length == 10) {
      console.log("hi");
      getCustomerByMobileNumber();
    }
  }, [mobile]);

  useEffect(() => {
    if (search !== "") {
      let tabs = Object.keys(menu);
      let newMenu = {};

      for (let i = 0; i < tabs.length; i++) {
        let newTabData = menu[tabs[i]].filter((value) =>
          value.name.toLowerCase().includes(search.toLowerCase())
        );
        newMenu[tabs[i]] = newTabData;
      }

      console.log(menu);
      console.log(newMenu);

      setFilteredMenu(newMenu);
    }
  }, [search]);

  useEffect(() => {
    let newMenu = {};
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < categories.length; j++) {
        if (items[i].item_category_name === categories[j].item_category_name) {
          if (!newMenu[categories[j].item_category_name]) {
            newMenu[categories[j].item_category_name] = [];
          }
          newMenu[categories[j].item_category_name].push(items[i]);
        }
      }
    }

    setMenu(newMenu);

    console.log(newMenu);
  }, [items]);

  useEffect(() => {
    getCategories();
    getItems();
    getTaxes();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setSelected(categories[0].item_category_name);
    }
  }, [categories]);

  useEffect(() => {
    console.log(variantProduct);

    if (variantProduct && variantProduct.id) {
      axiosInstance.defaults.headers["Authorization"] =
        "Bearer " + localStorage.access_token;

      let hotel_id = parseInt(localStorage.getItem("hotel_id"));

      axiosInstance
        .get(
          `/product/variants/addons/?hotel=${hotel_id}&product=${variantProduct.id}`
        )
        .then((response) => {
          if (response.data.length > 0) {
            setVariantsOfProduct(
              response.data[0].variant_details
                ? response.data[0].variant_details
                : []
            );
            setAddOnsOfProduct(
              response.data[0].add_on_details
                ? response.data[0].add_on_details
                : []
            );
            setOptionsModal(true);
          } else if (variantProduct.net_price != 0) {
            addOrders(variantProduct);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [variantProduct]);

  useEffect(() => {
    if (
      deliveryType === "table order" &&
      current &&
      current.progress &&
      current.progress.toLowerCase() === "occupied"
    ) {
      axiosInstance.defaults.headers["Authorization"] =
        "Bearer " + localStorage.access_token;

      let hotel_id = localStorage.getItem("hotel_id");
      let url = `/table_orders/${current.name}/?hotel=${hotel_id}&status=occupied`;
      console.log(url);
      axiosInstance
        .get(`${url}`)
        .then((res) => {
          console.log(res.data);
          setExistingOrders(res.data.orders);
          setBillId(res.data.orders[0].bill_id);
          setExistingCustomer(res.data.customer_id);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (deliveryType === "takeaway") {
      axiosInstance.defaults.headers["Authorization"] =
        "Bearer " + localStorage.access_token;

      let hotel_id = localStorage.getItem("hotel_id");
      let url = `/takeaway_orders/${current}/?hotel=${hotel_id}`;
      console.log(url);
      axiosInstance
        .get(url)
        .then((res) => {
          console.log(res.data);
          setExistingOrders(res.data.orders);
          setBillId(res.data.orders[0].bill_id);
          setExistingCustomer(res.data.customer);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [current]);

  const getCustomers = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");
    await axiosInstance
      .get(`/customers/?hotel=${hotel_id}`)
      .then((res) => {
        setCustomers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    console.log(existingCustomer);

    for (let i = 0; i < customers.length; i++) {
      if (customers[i].customer_id === parseInt(existingCustomer)) {
        setCustomer(customers[i]);
      }
    }
  }, [existingCustomer]);

  const calculateOptionsPrice = (order, id) => {
    console.log(order);
    let totalPrice = order.products.net_price;

    if (order.variant) {
      totalPrice = totalPrice + order.variant.price;
    }

    if (order.addon.length > 0) {
      for (let i = 0; i < order.addon.length; i++) {
        totalPrice = totalPrice + order.addon[i].price;
      }
    }

    return totalPrice * order.quantity;
  };

  const calculateExistingOrdersPrice = () => {
    let completeTotal = 0;

    for (let i = 0; i < existingOrders.length; i++) {
      if (existingOrders[i].status === "rejected") {
        continue;
      }
      let totalPrice = existingOrders[i].products.net_price
        ? existingOrders[i].products.net_price
        : 0;

      if (existingOrders[i].variant) {
        totalPrice = totalPrice + existingOrders[i].variant.price;
      }

      if (existingOrders[i].addon.length > 0) {
        for (let j = 0; j < existingOrders[i].addon.length; j++) {
          totalPrice = totalPrice + existingOrders[i].addon[j].price;
        }
      }

      totalPrice = totalPrice * existingOrders[i].quantity;

      completeTotal = completeTotal + totalPrice;
    }

    setExistingPrice(completeTotal);
  };

  useEffect(() => {
    calculateExistingOrdersPrice();
  }, [existingOrders]);

  useEffect(() => {
    if (ticket) {
      setBillId(ticket.bill_id);
    }
  }, [ticket]);

  return (
    <div>
      {!isCharged ? (
        <div>
          <form>
            <label
              for="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border-none outline-none rounded-lg bg-gray-50 "
                placeholder="Search Name"
                required
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <div className="p-2 flex bg-white">
            <SideMenuCurrents
              categories={categories}
              setSelected={setSelected}
            />
            <div className="ml-4 h-full lg:flex lg:justify-center lg:items-center">
              <div className="grid lg:grid-cols-3 gap-12 lg:gap-2 max-h-[75vh] overflow-auto">
                {search !== ""
                  ? Object.keys(filteredMenu).length > 0 &&
                    filteredMenu[selected] &&
                    filteredMenu[selected].map((item, i) => (
                      <div
                        onClick={(e) => {
                          if (
                            typeof item.quantity === typeof 1 &&
                            item.quantity <= 0
                          ) {
                            console.log("hi");
                          } else {
                            // if (item.net_price === 0) {
                            setVariantProduct(item);
                            // } else {
                            //   addOrders(e, item);
                            // }
                          }
                        }}
                      >
                        <Card data={item} type={type} />
                      </div>
                    ))
                  : Object.keys(menu).length > 0 &&
                    menu[selected] &&
                    menu[selected].map((item, i) => (
                      <div
                        onClick={(e) => {
                          if (
                            typeof item.quantity === typeof 1 &&
                            item.quantity <= 0
                          ) {
                            console.log("hi2");
                          } else {
                            // if (item.net_price === 0) {
                            setVariantProduct(item);
                            // } else {
                            //   addOrders(e, item);
                            // }
                          }
                        }}
                      >
                        <Card data={item} type={type} />
                      </div>
                    ))}
              </div>
            </div>
            <div className="w-1/3 p-2 border mx-2 rounded-md">
              <div className="flex items-center justify-between w-full">
                <div className="flex">
                  <p className="mr-2">
                    {deliveryType[0].toUpperCase() + deliveryType.slice(1)}{" "}
                    <span>{current.name}</span>
                    &nbsp;
                  </p>
                  {!customer ? (
                    <button
                      className="text-docs-blue"
                      onClick={(e) => {
                        e.preventDefault();
                        setAddCustomerModal(true);
                      }}
                    >
                      Add Customer
                    </button>
                  ) : (
                    <p className="text-docs-blue">{customer.customer_name}</p>
                  )}
                </div>
                <div className="flex">
                  <button
                    className="text-docs-blue"
                    onClick={(e) => {
                      setOrders([]);
                      setTotal(0);
                      setCustomer(null);
                    }}
                  >
                    Clear
                  </button>
                  &nbsp;
                  <button className="text-docs-blue">Swap</button>
                </div>
              </div>
              <form className="mt-2">
                <table className="min-w-full leading-normal block max-h-[400px] overflow-auto">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {existingOrders.map((order, i) => {
                      return (
                        <tr>
                          <td
                            className={`px-5 py-5 border-b border-gray-200 ${
                              order.status === "rejected"
                                ? "bg-red-200"
                                : "bg-white"
                            } text-sm`}
                          >
                            <p className="text-[#4338ca] whitespace-no-wrap ml-2">
                              {order.products.name}
                            </p>
                            {order.variant && (
                              <p className=" whitespace-no-wrap ml-2 text-[12px]">
                                {order.variant.variant_value} - &#8377;
                                {order.variant.price}
                              </p>
                            )}
                            {order.addon &&
                              order.addon.map((order, i) => (
                                <p className=" whitespace-no-wrap ml-2 text-[12px]">
                                  {order.add_on_value} - &#8377;{order.price}
                                </p>
                              ))}
                          </td>
                          <td
                            className={`px-5 py-5 border-b border-gray-200 ${
                              order.status === "rejected"
                                ? "bg-red-200"
                                : "bg-white"
                            } test-sm`}
                          >
                            <p className="whitespace-no-wrap w-fit p-1">
                              {order.quantity}
                            </p>
                          </td>
                          <td
                            className={`px-5 py-5 border-b border-gray-200 ${
                              order.status === "rejected"
                                ? "bg-red-200"
                                : "bg-white"
                            } test-sm`}
                          >
                            <p
                              id={order.id}
                              className="whitespace-no-wrap w-fit p-1"
                            >
                              {calculateOptionsPrice(order, order.id)}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                    {orders.map((order, index) => (
                      <tr className="w-full">
                        <td className="w-full px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            <AiOutlineDelete
                              className="cursor-pointer"
                              color="red"
                              size={"16px"}
                              onClick={(e) => {
                                deleteOrders(e, order);
                              }}
                            />
                            <div>
                              <p
                                className=" text-[#4338ca] whitespace-no-wrap ml-2"
                                // href="/rn1000"
                              >
                                {order.name}
                              </p>
                              <p className=" whitespace-no-wrap ml-2 text-[12px]">
                                {order.variant_name}
                              </p>
                              {order.add_on_name &&
                                order.add_on_name.map((add_on, i) => (
                                  <p className=" whitespace-no-wrap ml-2 text-[12px]">
                                    {add_on}
                                  </p>
                                ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-lg">
                          <div className="flex items-center justify-between">
                            <AiOutlineMinusCircle
                              className="cursor-pointer"
                              color="red"
                              size={"25px"}
                              onClick={(e) => {
                                removeOrders(e, order);
                              }}
                            />
                            <p
                              className={` whitespace-no-wrap w-fit p-1 rounded-md `}
                            >
                              {order.item_quantity}
                            </p>
                            <AiOutlinePlusCircle
                              className="cursor-pointer"
                              color="blue"
                              size={"25px"}
                              onClick={(e) => {
                                e.preventDefault();
                                addOrders(order);
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p
                            className={` whitespace-no-wrap w-fit p-1 rounded-md`}
                          >
                            {order.net_price * order.item_quantity}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="w-full flex items-center justify-between">
                  <button
                    className="w-1/2 bg-docs-blue text-white p-2"
                    onClick={(e) => {
                      e.preventDefault();

                      if (!ticket && orders.length > 0) {
                        setShowTicketModal(true);
                      }
                    }}
                  >
                    Order Ticket
                  </button>

                  <button
                    className="w-1/2 bg-dark-purple text-white p-2"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(ticket);
                      if (
                        (ticket && orders.length > 0) ||
                        (existingOrders.length > 0)
                      ) {
                        setIsCharged(true);
                      }
                    }}
                  >
                    Charge &#8377;{total + existingPrice}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white">
          <div className=" py-4 flex ">
            <div className="m-4 w-1/2">
              <div>
                <Payment
                  amount={total}
                  setIsCharged={setIsCharged}
                  customer={customer}
                  billId={billId}
                  table={current.name}
                  deliveryType={deliveryType}
                  current={current}
                />
              </div>
            </div>

            <Customer
              isCharged={isCharged}
              setCustomer={setCustomer}
              customer={customer}
            />
          </div>
        </div>
      )}

      <Modal
        modalOf="Ticket"
        data={orders}
        tableId={current.name}
        tableIndex={tableIndex}
        showModal={showTicketModal}
        setShowModal={setShowTicketModal}
        customer={customer ? customer : ""}
        setTicket={setTicket}
        deliveryType={deliveryType}
      />

      <Modal
        modalOf="Customer"
        name="ReceiptName"
        showModal={addCustomerModal}
        setShowModal={setAddCustomerModal}
        setCustomer={setCustomer}
        mobile={mobile}
      />

      <OptionsModal
        showModal={optionsModal}
        setShowModal={setOptionsModal}
        variants={variantsOfProduct}
        addons={addOnsOfProduct}
        orders={orders}
        categories={categories}
        taxes={taxes}
        setOrders={setOrders}
        setTotal={setTotal}
        item={variantProduct}
        setVariantProduct={setVariantProduct}
      />
    </div>
  );
}

export default Current;
