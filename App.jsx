import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/components/Home";
import Register from "../src/components/Register";
import Login from "../src/components/Login";
import IndividualDashboard from "../src/components/IndividualDashboard";
import BusinessDashboard from "../src/components/BusinessDashboard";
import IndividualEwasteForm from "../src/components/IndividualEwasteForm";
import IndividualRecyclerSuggestion from "../src/components/IndividualRecyclerSuggestion";
import IndividualTracking from "../src/components/IndividualTracking";
import BusinessCompanyDetails from "../src/components/BusinessCompanyDetails";
import BusinessInventory from "../src/components/BusinessInventory";
import BusinessPickupRequests from "../src/components/BusinessPickupRequests";
import BusinessTracking from "../src/components/BusinessTracking";
import ForgotPassword from "../src/components/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/individual-dashboard" element={<IndividualDashboard />} />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
        <Route path="/individual-ewaste-form" element={<IndividualEwasteForm />} />
        <Route path="/individual-recycler-suggestion" element={<IndividualRecyclerSuggestion />} />
        <Route path="/individual-tracking" element={<IndividualTracking />} />
        <Route path="/business-company-details" element={<BusinessCompanyDetails />} />
        <Route path="/business-inventory" element={<BusinessInventory />} />
        <Route path="/business-pickup-request/:requestId" element={<BusinessPickupRequests />} />
        <Route path="/business-tracking" element={<BusinessTracking />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
