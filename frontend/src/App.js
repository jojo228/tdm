import { Route, Routes } from "react-router-dom";
import MainPage from "./Layout/MainPage";
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import AuthPage from "./Components/Auth/AuthPage";
import PrivateRoute from "./Components/private-route/PrivateRoute";

console.log(localStorage);
if (localStorage.access_token) {
  const token = localStorage.access_token;
  // setAuthToken(token);
  const decoded = jwt_decode(token);
  console.log(decoded);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "./login";
  }

  const hotel_id=localStorage.hotel_id;
  const pathname = window.location.pathname
  console.log(pathname);
  if(pathname!=='/register' && hotel_id==-1){
    window.location.href = "./register";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route exact path="/auth" element={<AuthPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="*" element={<MainPage />} />
        </Route>
         {/* <Route exact path="/auth" element={<AuthPage />} />  
        <Route path="*" element={<MainPage />} /> */}
      </Routes>
    </Provider>
  );
}

export default App;
