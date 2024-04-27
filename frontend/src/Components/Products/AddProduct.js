import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../axiosAPI";

function AddProduct({ modal, editid, mname, mcategory, mtaxGroup, mprice }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [taxGroup, setTaxGroup] = useState("");
  const [price, setPrice] = useState(0);
  const [hasVariant, setHasVariant] = useState(false);
  // const [quantity, setQuantity] = useState(1);

  const [categories, setCategories] = useState([]);
  const [taxGroups, setTaxGroups] = useState([]);

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

  const getTaxGroups = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;
    let hotel_id = localStorage.getItem("hotel_id");
    await axiosInstance
      .get(`/tax_groups/?hotel=${hotel_id}`)
      .then((res) => {
        console.log(res.data);
        setTaxGroups(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCategories();
    getTaxGroups();
  }, []);

  // useEffect(()=>{
  //   if(modal){
  //     setName(mname)
  //     setPrice(mprice)
  //     setCategory(mcategory)
  //     setTaxGroup(mtaxGroup)
  //     setQuantity(mquantity?mquantity:1)
  //   }
  // },[modal])

  const submitData = (e) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    let itemData = {
      name: name,
      unit_price: parseInt(price ? price : 0),
      hotel_id: hotel_id,
      item_category_id: parseInt(category),
      tax_group_id: parseInt(taxGroup),
      // quantity: parseInt(quantity),
    };

    axiosInstance
      .post("/add_item/", itemData)
      .then((res) => {
        window.location.href = "/products";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editData = (e) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;
    let hotel_id = localStorage.getItem("hotel_id");

    let itemData = {
      id: parseInt(editid),
      name: name,
      unit_price: parseInt(price),
      hotel_id: hotel_id,
      item_category_id: parseInt(category),
      tax_group_id: parseInt(taxGroup),
      // quantity: parseInt(quantity),
    };

    axiosInstance
      .post(`/items/update/${editid}/`, itemData)
      .then((res) => {
        window.location.href = "/products";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        {modal ? `Edit Product - ${editid}` : "Add Products"}
      </h1>
      <div className="w-full my-4">
        {!modal && (
          <div className="m-4 flex">
            <Link
              to="/addProductCategory"
              className="w-18 h-18 text-docs-blue p-2 pl-0 pr-4 rounded-sm"
            >
              Add Product Category
            </Link>

            <Link
              to="/addTax"
              className="w-18 h-18 text-docs-blue p-2 pl-0 pr-4 rounded-sm"
            >
              Add Tax Group
            </Link>
          </div>
        )}
        <div className={`m-4 ${modal ? "flex-col w-full" : "flex"}`}>
          <div className="flex w-full items-center">
            {mname && (
              <p className="text-base w-full font-normal text-gray-700">
                {mname}
              </p>
            )}
            <input
              type="text"
              className={`form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex w-full items-center">
            {mcategory && (
              <p className="text-base w-full font-normal text-gray-700">
                {mcategory}
              </p>
            )}

            <select
              id="categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`form-control block ${
                modal ? "mt-4" : "ml-4"
              } px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
            >
              <option selected>Choose Category</option>

              {categories.map((b, i) => (
                <option value={b.item_category_id}>
                  {b.item_category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full items-center">
            {mtaxGroup && (
              <p className="text-base w-full font-normal text-gray-700">
                {mtaxGroup}
              </p>
            )}

            <select
              id="taxgroups"
              value={taxGroup}
              onChange={(e) => setTaxGroup(e.target.value)}
              className={`form-control block ${
                modal ? "mt-4" : "ml-4"
              } px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
            >
              <option selected>Choose Tax Group</option>

              {taxGroups.map((b, i) => (
                <option value={b.tax_group_id}>
                  {b.tax_group_name + " - " + b.tax_value + "%"}
                </option>
              ))}
            </select>
          </div>

          {!modal && (
            <div className="flex w-full items-center">
              <select
                id="variant"
                value={hasVariant}
                onChange={(e) => {
                  setHasVariant(e.target.value);
                }}
                className={`form-control block ${
                  modal ? "mt-4" : "ml-4"
                } px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
              >
                <option selected value={false}>
                  Has Variant
                </option>

                {["Yes", "No"].map((b, i) => (
                  <option value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}
          {/* <div className="flex w-full items-center">
            {mquantity && (
              <p className="text-base w-full font-normal text-gray-700">
                {mquantity}
              </p>
            )}

            <input
              type="number"
              className={`form-control block ${
                modal ? "mt-4" : "ml-4"
              } px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div> */}
          <div className="flex w-full items-center mt-4">
            {mprice !== 0 && (
              <p className="text-base w-full font-normal text-gray-700">
                {mprice}
              </p>
            )}

            {(hasVariant==="No" || (mprice && mprice !== 0)) && (
              <input
                type="number"
                className={`form-control block ${
                  modal ? "mt-4" : "ml-4"
                }ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                placeholder="Price"
                value={price}
                disabled={hasVariant === "Yes"}
                onChange={(e) => setPrice(e.target.value)}
              />
            )}
          </div>
        </div>

        {modal ? (
          <div className="m-4 h-full flex ">
            <button
              className="w-18 h-18 bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
              onClick={(e) => {
                editData(e);
              }}
            >
              Edit Data
            </button>
          </div>
        ) : (
          <div className="m-4 h-full flex ">
            <button
              className="w-18 h-18 bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
              onClick={(e) => {
                submitData(e);
              }}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddProduct;
