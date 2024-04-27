import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";

function RequestModal() {
  const [products, setProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [UOMS, setUOMS] = useState([]);
  const [requests, setRequests] = useState([]);

  const [nodes, setNodes] = useState([]);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const updateCheckedState = (node) => {
    const childValues = [];
    const isParent = node.isParent;

    const updatedValues = isParent
      ? node.children.map((v) => v.value)
      : [node.value];

    //  const updatedValues = [node.value];

    if (node.checked) {
      setChecked([...checked, ...updatedValues]);
      let newAll = [...checked, ...updatedValues];
      let result = products.filter((o) => newAll.some((p) => o.id === p));
      setSelectedProducts(result);
    } else {
      const filteredChecks = checked.filter((check) => {
        return !updatedValues.includes(check);
      });
      let newAll = filteredChecks;
      let result = products.filter((o) => newAll.some((p) => o.id === p));
      setSelectedProducts(result);
      setChecked(filteredChecks);
    }
  };

  const handleInputChange = (e, index, type) => {
    if (type === "product") {
      const list = [...selectedProducts];
      list[index] = e.target.value;
      setSelectedProducts(list);
    } else if (type === "quantity") {
      const list = [...quantities];
      list[index] = parseInt(e.target.value);
      setQuantities(list);
    } else if (type === "uom") {
      const list = [...UOMS];
      list[index] = e.target.value;
      setUOMS(list);
    } else {
      const list = [...requests];
      list[index] = e.target.value;
      setRequests(list);
    }
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index, type) => {
    if (type === "product") {
      let len = selectedProducts.length;
      const list = [...selectedProducts];
      list.splice(index, 1);
      setSelectedProducts(list);
      if (len == 1) {
        setSelectedProducts([""]);
      }
    } else if (type === "quantity") {
      let len = quantities.length;
      const list = [...quantities];
      list.splice(index, 1);
      setQuantities(list);
      if (len == 1) {
        setQuantities([""]);
      }
    } else if (type === "uom") {
      let len = UOMS.length;
      const list = [...UOMS];
      list.splice(index, 1);
      setUOMS(list);
      if (len == 1) {
        setUOMS([""]);
      }
    } else {
      let len = requests.length;
      const list = [...requests];
      list.splice(index, 1);
      setRequests(list);
      if (len == 1) {
        setRequests([""]);
      }
    }
  };

  // handle click event of the Add button
  const handleAddClick = (type) => {
    if (type === "product") {
      setSelectedProducts([...selectedProducts, ""]);
    } else if (type === "quantity") {
      setQuantities([...quantities, 0]);
    } else if (type === "uom") {
      setUOMS([...UOMS, ""]);
    } else {
      setRequests([...requests, ""]);
    }
  };

  const getItemsData = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/inventory/?hotel=${hotel_id}`)
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getItemsData();
  }, []);

  useEffect(() => {
    let newData = {};
    for (let i = 0; i < products.length; i++) {
      if (!newData[products[i].product_info.item_category_name]) {
        newData[products[i].product_info.item_category_name] = [];
      }
      newData[products[i].product_info.item_category_name].push(products[i]);
    }
    setCategoryProducts(newData);
  }, [products]);

  const getChildren = (cps) => {
    let result = [];
    cps.map((cp, i) => {
      result.push({
        value: cp.id,
        label:
          cp.product_info.name +
          `${cp.variant_name ? " - " + cp.variant_name : ""}`,
      });
    });
    return result;
  };

  useEffect(() => {
    if (categoryProducts) {
      let NODES = [];
      Object.keys(categoryProducts).map((cp, i) => {
        NODES.push({
          value: cp,
          label: cp,
          children: getChildren(categoryProducts[cp]),
        });
      });

      console.log(NODES);
      setNodes(NODES);
    }
  }, [categoryProducts]);

  const submitData = (e) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel = localStorage.getItem("hotel_id");

    let itemData = [];

    for (let i = 0; i < selectedProducts.length; i++) {
      let ids = {
        request: requests[i],
        status: "sent",
        hotel: hotel,
        type: "request",
        product: selectedProducts[i].id,
        quantity: quantities[i],
        uom: UOMS[i],
      };
      itemData.push(ids);
    }

    console.log(itemData);

    axiosInstance
      .post(`/notification/?hotel=${hotel}/`, itemData)
      .then((response) => {
        window.location.href = "./notifications";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Send Request</h1>

      <div className="mt-2">
        <div className="flex flex-col items-center">
          {selectedProducts.map((x, i) => {
            return (
              <div className="w-full my-2 flex items-center justify-between">
                <div className="w-1/4">
                  <p>{x.product_info.name}</p>
                  <span className="text-sm">
                    {x.variant_name ? "variant : " + x.variant_name : ""}
                  </span>
                </div>

                <input
                  type="number"
                  className={`form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                  placeholder="Quantity"
                  value={quantities[i]}
                  onChange={(e) => handleInputChange(e, i, "quantity")}
                />

                <input
                  type="text"
                  className={`form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                  placeholder="UOM"
                  value={UOMS[i]}
                  onChange={(e) => handleInputChange(e, i, "uom")}
                />

                <input
                  type="text"
                  className={`w-1/4 form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                  placeholder="Request"
                  value={requests[i]}
                  onChange={(e) => handleInputChange(e, i, "request")}
                />

                {/* <div className="flex items-center w-fit">
                  <AiOutlineMinusCircle
                    size={"25px"}
                    color="red"
                    className="mr-2 cursor-pointer"
                    onClick={() => {
                      handleRemoveClick(i, "product");
                      handleRemoveClick(i, "quantity");
                      handleRemoveClick(i, "uom");
                      handleRemoveClick(i, "request");
                    }}
                  />

                  {selectedProducts.length - 1 === i && (
                    <AiOutlinePlusCircle
                      size={"25px"}
                      color="blue"
                      className="ml-2 cursor-pointer"
                      onClick={() => {
                        handleAddClick("product");
                        handleAddClick("quantity");
                        handleAddClick("uom");
                        handleAddClick("request");
                      }}
                    />
                  )}
                </div> */}
              </div>
            );
          })}
        </div>

        <div className="m-4 ml-0 flex ">
          <button
            className="bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
            onClick={(e) => {
              submitData(e);
            }}
          >
            Submit
          </button>
        </div>

        <CheckboxTree
          iconsClass="fa5"
          nodes={nodes}
          checked={checked}
          expanded={expanded}
          onCheck={(nodes, node) => {
            updateCheckedState(node);
          }}
          onExpand={(expanded) => setExpanded(expanded)}
          icons={{
            check: <span className="rct-icon rct-icon-check rct-white" />,
            uncheck: <span className="rct-icon rct-icon-uncheck" />,
            halfCheck: <span className="rct-icon rct-icon-half-check" />,
            expandClose: <span className="rct-icon rct-icon-expand-close" />,
            expandOpen: <span className="rct-icon rct-icon-expand-open" />,
            expandAll: <span className="rct-icon rct-icon-expand-all" />,
            collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
            parentClose: <span className="rct-icon rct-icon-parent-close" />,
            parentOpen: <span className="rct-icon rct-icon-parent-open" />,
            leaf: <span className="rct-icon rct-icon-leaf" />,
          }}
        />
      </div>
    </div>
  );
}

export default RequestModal;
