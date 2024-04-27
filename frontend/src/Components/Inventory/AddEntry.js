import React, { useEffect, useState } from "react";
import SearchableDropdown from "../../utils/SearchableDropdown";
import axiosInstance from "../../axiosAPI";
import { useSelector } from "react-redux";

function AddEntry() {
  const auth = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState();
  const [variants, setVariants] = useState();
  const [variant, setVariant] = useState("");

  const getItemsData = () => {
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

  useEffect(() => {
    getItemsData();
  }, []);

  const getOptionsData = (id) => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/product/variants/addons/?hotel=${hotel_id}&product=${id}`)
      .then((response) => {
        if (response.data[0].variant_details.length > 0) {
          setVariants(response.data[0].variant_details);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (product) {
      getOptionsData(product.id);
    }
  }, [product]);

  const submitData = (e) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    let itemData = {
      quantity: parseInt(quantity),
      hotel: parseInt(hotel_id),
      user: auth.user.user_id,
      product_id: product.id,
      action: "created",
      variant: parseInt(variant),
    };

    if(date){
      itemData['expiry_date']=date
    }

    console.log(itemData);

    axiosInstance
      .post(`inventory/?hotel=${hotel_id}`, itemData)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <p className="mb-2">Select Product</p>
      <div className="">
        <SearchableDropdown
          options={products}
          label="name"
          selectedVal={product}
          handleChange={(val) => setProduct(val)}
        />
      </div>
      {variants && (
        <>
          <p className="mb-2">Select Variant</p>
          <div className="w-full ml-0 my-2">
            <select
              id="variants"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              className={`form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
            >
              <option selected>Choose Variant</option>

              {variants.map((b, i) => (
                <option value={b.variant_id}>
                  {b.variant_value} - {b.variant_desc}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <p className="mb-2">Quantity</p>
      <div className="p-1 flex items-center mb-3 border border-solid ">
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
      <p className="mb-2">Expiry Date</p>
      <div className="p-1 flex items-center mb-3 border border-solid ">
        <input
          type="date"
          className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
          placeholder="Expiry Date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
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
    </div>
  );
}

export default AddEntry;
