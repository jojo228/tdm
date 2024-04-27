import React, { useEffect, useState } from "react";

function OptionsModal({
  showModal,
  setShowModal,
  variants,
  addons,
  orders,
  categories,
  taxes,
  setOrders,
  setTotal,
  item,
  setVariantProduct,
}) {
  const [addOn, setAddOn] = useState([0]);

  const [variant, setVariant] = useState(null);

  const [variant_name, setVariant_name] = useState("");
  const [add_on_names, setAdd_on_names] = useState([0]);

  const handleInputChange = (e, index, type) => {
    const list = [...addOn];
    const namesList = [...add_on_names];

    list[index] = parseInt(e.target.value);
    console.log(e.target.options[e.target.selectedIndex].text);
    namesList[index] = e.target.options[e.target.selectedIndex].text;

    setAddOn(list);
    setAdd_on_names(namesList);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index, type) => {
    let len = addOn.length;

    const list = [...addOn];
    list.splice(index, 1);
    setAddOn(list);

    const namesList = [...add_on_names];
    namesList.splice(index, 1);
    setAdd_on_names(namesList);

    if (len == 1) {
      setAddOn([""]);
      setAdd_on_names([""]);
    }
  };

  // handle click event of the Add button
  const handleAddClick = (type) => {
    setAddOn([...addOn, 0]);
    setAdd_on_names([...add_on_names, 0]);
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

  const getVariantPrice = (vid) => {
    console.log(variant, variants);
    for (let i = 0; i < variants.length; i++) {
      if (variants[i].variant_id === parseInt(vid)) {
        console.log(variants[i].price);
        return variants[i].price;
      }
    }
    return 0;
  };

  const getAddOnPrice = (aid) => {
    for (let i = 0; i < addons.length; i++) {
      if (addons[i].add_on_id === aid) {
        console.log(addons[i].price);
        return addons[i].price;
      }
    }
    return 0;
  };

  const addOrders = (e) => {
    e.preventDefault();

    var added = false;

    var newOrders = [];
    var newTotal = 0;

    let uniqueAddons = addOn.filter(function (val) {
      return val !== 0;
    });
    uniqueAddons = [...new Set(uniqueAddons)];

    for (let i = 0; i < orders.length; i++) {
      console.log(i);
      console.log(orders[i].name, item.name);
      console.log(orders[i].variant, variant);
      console.log(orders[i].add_on, uniqueAddons);

      if (
        orders[i].name === item.name &&
        orders[i].variant === variant &&
        JSON.stringify(orders[i].add_on) == JSON.stringify(uniqueAddons)
      ) {
        console.log(orders[i].add_on_name);

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
      } else {
        const newOrderItem = {
          id: orders[i].id,
          hotel_id: orders[i].hotel_id,
          hotel_name: orders[i].hotel_name,
          name: orders[i].name,
          item_quantity: orders[i].item_quantity,
          net_price: orders[i].net_price,
          item_category_id: orders[i].item_category_id,
          tax_group_id: orders[i].tax_group_id,
          add_on: orders[i].add_on ? orders[i].add_on : [],
          variant: orders[i].variant ? orders[i].variant : -1,
          variant_name: orders[i].variant_name ? orders[i].variant_name : "",
          add_on_name: orders[i].add_on_name ? orders[i].add_on_name : "",
        };
        newTotal =
          newTotal + newOrderItem.item_quantity * newOrderItem.net_price;
        newOrders.push(newOrderItem);
      }
    }

    console.log(newTotal);

    if (!added) {
      let currTotal = 0;
      for (let i = 0; i < uniqueAddons.length; i++) {
        currTotal = currTotal + getAddOnPrice(uniqueAddons[i]);
      }
      currTotal = currTotal + getVariantPrice(variant);

      const newItem = {
        id: item.id,
        name: item.name,
        item_quantity: 1,
        net_price: item.net_price + currTotal,
        item_category_id: getCategoryId(item.item_category_name),
        tax_group_id: getTaxId(item.tax_group_name),
      };

      if (variant) {
        newItem["variant"] = variant;
        newItem["variant_name"] = variant_name;
      }

      if (uniqueAddons.length > 0) {
        newItem["add_on"] = uniqueAddons;
        newItem["add_on_name"] =
          add_on_names.length > 1
            ? add_on_names
            : add_on_names[0] === 0
            ? []
            : add_on_names;
      }

      newTotal = newTotal + newItem.net_price;

      console.log(newItem);

      setOrders((prevOrders) => [...prevOrders, newItem]);
    } else {
      setOrders(newOrders);
    }

    setShowModal(false);
    setTotal(newTotal);
    setVariantProduct(null);
    setVariant(null);
    setVariant_name("");
    setAdd_on_names([0]);
    setAddOn([0]);
  };

  return (
    <>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={(e) => {
                e.preventDefault();
                setVariantProduct(null);
                setVariant(null);
                setAddOn([0]);
                setShowModal(false);
              }}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                <div className="mt-3 sm:flex flex-col">
                  {variants.length > 0 && (
                    <>
                      <h1 className="text-xl font-semibold">Select Variant</h1>
                      <select
                        id="variants"
                        value={variant}
                        onChange={(e) => {
                          setVariant_name(
                            e.target.options[e.target.selectedIndex].text
                          );
                          setVariant(e.target.value);
                        }}
                        className={`form-control my-4 block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                      >
                        <option disabled selected value={null}>
                          Choose Variant
                        </option>

                        {variants.map((b, i) => {
                          return item.quantity[b.variant_id] &&
                            item.quantity[b.variant_id].quantity == 0 ? (
                            <></>
                          ) : (
                            <option value={b.variant_id}>
                              {`${b.variant_value}${
                                item.quantity[b.variant_id]
                                  ? "(" +
                                    item.quantity[b.variant_id].quantity +
                                    ")"
                                  : ""
                              }`}{" "}
                              - &#8377;{b.price}
                            </option>
                          );
                        })}
                      </select>
                    </>
                  )}

                  {addons.length > 0 && (
                    <>
                      <h1 className="text-xl font-semibold">Add Addons</h1>

                      {addOn.map((x, i) => {
                        return (
                          <div className="w-full my-2 flex items-center justify-around">
                            <select
                              id="addOn"
                              value={x}
                              onChange={(e) => handleInputChange(e, i, "addOn")}
                              className={`form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                            >
                              <option selected>Choose AddOn</option>

                              {addons.map((b, i) => (
                                <option value={b.add_on_id}>
                                  {b.add_on_value} - &#8377;{b.price}
                                </option>
                              ))}
                            </select>

                            <div className="w-full ml-8">
                              <button
                                className="mr10"
                                onClick={() => handleRemoveClick(i, "addOn")}
                              >
                                Remove
                              </button>

                              {addOn.length - 1 === i && (
                                <button
                                  className="ml-8"
                                  onClick={() => {
                                    handleAddClick("addon");
                                  }}
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}

                  <button
                    className="w-1/2 bg-dark-purple text-white p-2"
                    onClick={(e) => {
                      if (variants.length > 0 && variant === null) {
                      } else {
                        addOrders(e);
                      }
                    }}
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default OptionsModal;
