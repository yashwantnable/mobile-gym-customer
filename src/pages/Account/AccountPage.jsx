import { FaUser, FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  return (
    <>
      <div className="min-h-[90vh] py-12 px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-3">My Account</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your profile, wishlist, and saved addresses
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AccountCard
            icon={<FaUser className="text-white" size={24} />}
            label="Profile"
            path="profile"
            description="Update personal information"
            bgColor="bg-blue-700"
          />
          <AccountCard
            icon={<FaHeart className="text-white" size={24} />}
            label="Wishlist"
            path="wishlist"
            description="Your saved favorites"
            bgColor="bg-pink-600"
          />

          {/* <AccountCard
          icon={<FaCartFlatbedSuitcase className="text-white" size={24} />}
          label="Order"
          path="order"
          description="Your orders"
          bgColor="bg-teal-600"
        /> */}

          <AccountCard
            icon={<FaMapMarkerAlt className="text-white" size={24} />}
            label="My Address"
            path="address"
            description="Saved locations"
            bgColor="bg-amber-600"
          />
        </div>
      </div>
    </>
  );
};

const AccountCard = ({ icon, label, path, description, bgColor }) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
        // onClick={() =>
        //   navigate(label === "Wishlist" ? `/${path}` : `/account/${path}`)
        // }
        onClick={() => navigate(path)}
      >
        <div className="bg-white p-6 h-full">
          <div
            className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}
          >
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">{label}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
