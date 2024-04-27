import React, { useEffect, useState } from "react";
import { loginUser, registerUser } from "../../actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRegEnvelope, FaMobileAlt } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function AuthPage() {
  const navigate = useNavigate();

  const errorMessage = useSelector((state) => state.errors);

  const [toggle, setToggle] = useState("login");
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [auth]);

  const submitDetails = (e) => {
    e.preventDefault();

    const newUser =
      toggle === "login"
        ? {
            email: email,
            password: password,
            username: username,
          }
        : {
            first_name: firstName,
            last_name: secondName,
            email: email,
            password: password,
            password2: cpassword,
            mobile_number: mobile,
            username: username,
          };
    console.log(newUser);

    dispatch(
      toggle === "register" ? registerUser(newUser) : loginUser(newUser)
    );
  };

  useEffect(() => {
    console.log(errorMessage);
    toast.error(errorMessage.errors.detail, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }, [errorMessage]);

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (toggle === "login") {
        submitDetails(e);
      } else if (step === 3) {
        submitDetails(e);
      } else {
        setStep(step + 1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl relative">
          <div className="w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-dark-purple flex items-center">
                <GiPerspectiveDiceSixFacesRandom />
                BIMS
              </span>
            </div>
            <div className="pt-10 pb-5">
              <h2 className="text-3xl font-semibold dark-purple mb-2">
                {toggle === "login" ? "Sign in to Account" : "Sign Up"}
              </h2>
              {toggle === "login" ? (
                <div className="my-6 w-full flex justify-center items-center">
                  <span className="mx-2 text-sm font-medium text-gray-900">
                    Login using Username
                  </span>
                </div>
              ) : (
                <div className="my-8 ml-32 w-1/2 flex items-center justify-around ">
                  <p
                    className={`border w-10 h-10 text-center p-2 rounded-full ${
                      step === 1 ? "bg-dark-purple text-white" : ""
                    }`}
                  >
                    1
                  </p>
                  <div className="border-b-2 w-10 border-dark-purple inline-block opacity-[50%]"></div>
                  <p
                    className={`border w-10 h-10 text-center p-2 rounded-full ${
                      step === 2 ? "bg-dark-purple text-white" : ""
                    }`}
                  >
                    2
                  </p>
                  <div className="border-b-2 w-10 border-dark-purple inline-block opacity-[50%]"></div>
                  <p
                    className={`border w-10 h-10 text-center p-2 rounded-full ${
                      step === 3 ? "bg-dark-purple text-white" : ""
                    }`}
                  >
                    3
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center mt-4">
                {toggle === "register" ? (
                  <>
                    {step === 1 ? (
                      <>
                        <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                          <BsFillPersonFill className="text-gray-400 m-2" />
                          <input
                            type="name"
                            name="firstName"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                            }}
                            className="bg-gray-100 outline-none text-sm flex-1"
                          />
                        </div>
                        <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                          <BsFillPersonFill className="text-gray-400 m-2" />
                          <input
                            type="name"
                            name="secondName"
                            placeholder="Second Name"
                            value={secondName}
                            onChange={(e) => {
                              setSecondName(e.target.value);
                            }}
                            className="bg-gray-100 outline-none text-sm flex-1"
                          />
                        </div>
                        <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                          <FaRegEnvelope className="text-gray-400 m-2" />
                          <input
                            type="name"
                            name="name"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => {
                              setUsername(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              handleKeypress(e);
                            }}
                            className="bg-gray-100 outline-none text-sm flex-1"
                          />
                        </div>
                      </>
                    ) : step === 2 ? (
                      <>
                        <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                          <FaMobileAlt className="text-gray-400 m-2" />
                          <input
                            type="tel"
                            name="mobile"
                            placeholder="Mobile"
                            value={mobile}
                            onChange={(e) => {
                              setMobile(e.target.value);
                            }}
                            className="bg-gray-100 outline-none text-sm flex-1"
                          />
                        </div>
                        <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                          <FaRegEnvelope className="text-gray-400 m-2" />
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              handleKeypress(e);
                            }}
                            className="bg-gray-100 outline-none text-sm flex-1"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                          <MdLockOutline className="text-gray-400 m-2" />
                          <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                            className="bg-gray-100 outline-none text-sm flex-1"
                          />
                        </div>
                        <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                          <MdLockOutline className="text-gray-400 m-2" />
                          <input
                            type="password"
                            name="cpassword"
                            placeholder="Confirm Password"
                            value={cpassword}
                            onChange={(e) => {
                              setCpassword(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              handleKeypress(e);
                            }}
                            className="bg-gray-100 outline-none text-sm flex-1"
                          />
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                      <FaRegEnvelope className="text-gray-400 m-2" />
                      <input
                        type="name"
                        name="name"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                        className="bg-gray-100 outline-none text-sm flex-1"
                      />
                    </div>

                    <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                      <MdLockOutline className="text-gray-400 m-2" />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          handleKeypress(e);
                        }}
                        className="bg-gray-100 outline-none text-sm flex-1"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            {toggle === "register" && step !== 1 && (
              <button
                className="mr-4 border-2 border-dark-purple rounded-full px-12 py-2 inline-block font-semibold hover:bg-dark-purple hover:text-white"
                onClick={(e) => {
                  setStep(step - 1);
                }}
              >
                Prev
              </button>
            )}
            <button
              className="border-2 border-dark-purple rounded-full px-12 py-2 inline-block font-semibold hover:bg-dark-purple hover:text-white"
              onClick={(e) => {
                if (toggle === "login") {
                  submitDetails(e);
                } else if (step === 3) {
                  submitDetails(e);
                } else {
                  setStep(step + 1);
                }
              }}
            >
              {toggle === "login" ? "Sign In" : step !== 3 ? "Next" : "Sign Up"}
            </button>
          </div>
          <div
            className={`absolute top-52 left-[52.5%] flex items-center justify-center`}
          >
            <button
              className="bg-dark-purple text-white rounded-tl-md rounded-bl-md p-2"
              onClick={() =>
                setToggle(toggle === "login" ? "register" : "login")
              }
            >
              {toggle === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
          <div className="w-2/5 bg-dark-purple text-white rounded-tr-2xl rounded-br-2xl py-36 px-12 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-semibold mb-2">BIMS</h2>
            <div className="border-b-4 w-10 inline-block mb-2"></div>
            <p className="mb-10">Billing and Inventory Management</p>
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}

export default AuthPage;
