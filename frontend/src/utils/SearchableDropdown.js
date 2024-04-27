import { useEffect, useState } from "react";

const SearchableDropdown = ({ options, label, selectedVal, handleChange,which }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectOption = (option) => {
    setQuery(() => "");
    handleChange(option);
    setIsOpen((isOpen) => !isOpen);
  };

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;

    return "";
  };

  const filter = (options) => {
    return options.filter(
      (option) => option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  useEffect(() => {
    if (query) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query]);

  return (
    <div>
      <div>
        <div className=" w-fit p-1 flex items-center mb-3 border border-solid ">
          <input
            className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
            type="text"
            value={selectedVal?selectedVal.name:query}
            name="product"
            placeholder="Select Product"
            onChange={(e) => {
              setQuery(e.target.value);
              handleChange(null);
            }}
          />
        </div>
      </div>
      {isOpen && <div className={`${which==="Expenses"?"h-[100px]":"h-[300px]"}  overflow-auto border border-solid border-spacing-1`}>
        {
          filter(options).map((option, index) => {
            return (
              <div
                onClick={() => selectOption(option)}
                className={`w-full p-2 mb-3${which==="Expenses"?'':'border-b-2'}`}
              >
                {option[label]}
              </div>
            );
          })}
      </div>}
    </div>
  );
};

export default SearchableDropdown;
