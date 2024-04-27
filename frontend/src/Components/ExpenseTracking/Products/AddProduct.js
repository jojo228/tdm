import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import axiosInstance from "../../../axiosAPI";
import SearchableDropdown from "../../../utils/SearchableDropdown";

function AddProduct({ which }) {
  const [tab, setTab] = useState("Outside");

  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [product, setProduct] = useState("");
  const [variants, setVariants] = useState([]);
  const [variant, setVariant] = useState("");

  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("");
  const [quantity, setQuantity] = useState();
  const [amount, setAmount] = useState();
  const [charges, setCharges] = useState();
  const [type, setType] = useState("");
  const [unit, setUnit] = useState("");

  const submitData = (e) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    if (which === "Purchasing") {
      let itemData = {
        name: name,
        vendor_name: vendor,
        quantity: quantity,
        unit_price: amount,
        extracharges: charges,
        hotel: hotel_id,
        payment_type: type,
        // "related_to_product": 1
        uom: unit,
      };

      axiosInstance
        .post(`expense_purchase_products/?hotel=${hotel_id}`, itemData)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let itemData = {
        vendor_name: vendor,
        quantity: quantity,
        unit_price: amount,
        extracharges: charges,
        hotel: hotel_id,
        payment_type: type,
        uom: unit,
        variant: variant!==""?variant:null,
      };

      console.log(product);

      if (product && product.id) {
        itemData["related_to_product"] = product.id;
      }

      console.log(itemData);

      axiosInstance
        .post(`expense_reselling_products/?hotel=${hotel_id}`, itemData)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getVariants = (id) => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/product/variants/addons/?hotel=${hotel_id}&product=${id}`)
      .then((response) => {
        setVariants(
          response.data[0].variant_details
            ? response.data[0].variant_details
            : []
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(product);
    if (product) {
      getVariants(product.id);
    }
  }, [product]);

  const getAllData = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/items/?id=${hotel_id}`)
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPaymentTypes = async () => {
    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    await axiosInstance
      .get(`/get_payment_types/?hotel=${hotel_id}`)
      .then((res) => {
        setTypes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllData();
    getPaymentTypes();
  }, []);

  const inputData = () => {
    return (
      <>
        {variants.length > 0 && (
          <>
            <select
              id="variants"
              value={variant}
              onChange={(e) => {
                setVariant(e.target.value);
              }}
              className={`form-control my-4 block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
            >
              <option selected>Choose Variant</option>

              {variants.map((b, i) => (
                <option value={b.variant_id}>
                  {`${b.variant_value}`}- &#8377;{b.price}
                </option>
              ))}
            </select>
          </>
        )}
        <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
          <input
            type="vendor name"
            className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
            placeholder="Vendor Name"
            value={vendor}
            onChange={(e) => {
              setVendor(e.target.value);
            }}
          />
        </div>

        <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
          <input
            type="number"
            className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
        </div>

        <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
          <input
            type="text"
            className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
            placeholder="Units of Measurements"
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value);
            }}
          />
        </div>

        <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
          <BiRupee className="text-gray-400 border-r" />
          <input
            type="number"
            className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
            placeholder="Unit Price"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>

        <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
          <BiRupee className="text-gray-400 border-r" />
          <input
            type="number"
            className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
            placeholder="Extra Charges"
            value={charges}
            onChange={(e) => {
              setCharges(e.target.value);
            }}
          />
        </div>

        <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
          <BiRupee className="text-gray-400 border-r" />
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={` w-full form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
          >
            <option selected>Select Payment Type</option>

            {types.map((b, i) => (
              <option value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </>
    );
  };

  return (
    <div>
      {/* <div className="mb-4">
        <button
          className={`p-2 ${
            tab === "Outside" ? "bg-white font-semibold" : "bg-[#f9fafb]"
          } border`}
          onClick={(e) => {
            e.preventDefault();
            setTab("Outside");
          }}
        >
          Outside
        </button>
        <button
          className={`p-2 ${
            tab === "Hotel" ? "bg-white font-semibold" : "bg-[#f9fafb]"
          } border`}
          onClick={(e) => {
            e.preventDefault();
            setTab("Hotel");
          }}
        >
          Hotel
        </button>
      </div> */}

      {tab === "Outside" ? (
        <>
          {which === "Purchasing" ? (
            <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
              <input
                type="name"
                className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                placeholder="Product Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          ) : (
            <div className="mb-2">
              <SearchableDropdown
                options={products}
                label="name"
                selectedVal={product}
                handleChange={(val) => setProduct(val)}
                which="Expenses"
              />
            </div>
          )}

          {which === "Purchasing" ? inputData() : product ? inputData() : <></>}
        </>
      ) : (
        <></>
      )}

      <button
        className="w-18 bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
        onClick={(e) => {
          submitData(e);
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default AddProduct;
