import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Offer from "./pages/Offer";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import Categories from "./pages/Categories";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import { PrivateRoute } from "./components/PrivateRoute";

import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";
import CreateListing from "./pages/CreateListing";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/createlisting" element={<CreateListing/>} />
          <Route path="/editlisting/:listingId" element={<EditListing />} />
          <Route path="/Category/:categoryName" element={<Categories />} />
          <Route path="/contact/:landlordId" element={<Contact />} />
          <Route path="/Category/:categoryName/:listingId" element={<Listing />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
