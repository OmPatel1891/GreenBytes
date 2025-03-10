import { useNavigate } from "react-router-dom";

function BusinessCompanyDetails() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/business-inventory");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto border rounded">
      <h2 className="text-2xl font-bold mb-4">Business Details</h2>
      <input type="text" placeholder="Company Name" required className="w-full p-2 mb-2 border rounded"/>
      <input type="text" placeholder="Location" required className="w-full p-2 mb-2 border rounded"/>
      <button type="submit" className="bg-green-600 text-white w-full p-2 rounded">Next</button>
    </form>
  );
}

export default BusinessCompanyDetails;
