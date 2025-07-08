import React, { useEffect, useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
// import InputField from "../../Components/InputField";
// import SidebarField from "../../Components/SideBarField";
// import Button from "../../Components/Button";
// import { savedAddress } from "./DummyData";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import ParentControlledMap from "./map";
// import { AddressApi } from "../../Api/Address.api";
// import { MasterApi } from "../../Api/Master.api";
import toast from "react-hot-toast";
import { useLoading } from "../../context/LoadingContext";
import InputField from "../../components/InputField";
import SidebarField from "../../components/SideBarField";
import Button from "../../components/Button";

const AddressSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  flat_no: Yup.string().required("Flat number is required"),
  street: Yup.string().required("Street is required"),
  // landmark: Yup.string().required("Landmark is required"),
  pin_code: Yup.string().required("Pin Code is required"),
});

const savedAddress = [
  {
    _id: "1",
    name: "John Doe",
    phone_number: "1234567890",
    country: { _id: "c1", name: "India" },
    city: { _id: "ct1", name: "Mumbai" },
    flat_no: "A-101",
    street: "Main Street",
    landmark: "Near Central Park",
    pin_code: "400001",
    make_default_address: true,
    coordinates: {
      coordinates: [72.8777, 19.076],
    },
  },
  {
    _id: "2",
    name: "Jane Smith",
    phone_number: "0987654321",
    country: { _id: "c2", name: "USA" },
    city: { _id: "ct2", name: "New York" },
    flat_no: "22B",
    street: "5th Avenue",
    landmark: "Opposite Empire State",
    pin_code: "10001",
    make_default_address: false,
    coordinates: {
      coordinates: [-74.006, 40.7128],
    },
  },
  {
    _id: "3",
    name: "Robert Johnson",
    phone_number: "5551234567",
    country: { _id: "c3", name: "UK" },
    city: { _id: "ct3", name: "London" },
    flat_no: "Flat 5",
    street: "Baker Street",
    landmark: "Near Sherlock Museum",
    pin_code: "NW1 6XE",
    make_default_address: false,
    coordinates: {
      coordinates: [-0.1638, 51.5238],
    },
  },
];

const AddressForm = () => {
  const [open, setOpen] = useState(false);
  const [deleteaddress, setaddressPop] = useState("");
  const [address, setAddress] = useState(null);
  const [edit, setEdit] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [AddressData, setAddressData] = useState([]);
  const [citydata, setCityData] = useState([]);
  const { showLoading, hideLoading } = useLoading();

  // const handleGetAddress = async () => {
  //   try {
  //     const res = await AddressApi.getAddress();
  //     setAddressData(res.data.data);
  //   } catch (err) {
  //     console.log("err", err);
  //   }
  // };

  const handleGetAddress = async () => {
    setAddressData(savedAddress);
  };

  const handleEdit = (address) => {
    console.log("edit click ka address", address.city._id);

    const cityId = address.city._id;
    formik.setValues({
      name: address.name,
      phone_number: address.phone_number,
      country: address.country._id,
      city: address.city._id,
      flat_no: address.flat_no,
      street: address.street,
      landmark: address.landmark,
      pin_code: address.pin_code,
      make_default_address: address.make_default_address,
    });
    setAddress(address);
    setEdit(true);
    setOpen(true);
  };
  console.log("address state ka data ", AddressData);
  const handleDelete = (address) => {
    setaddressPop(address);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      phone_number: "",
      country: "",
      city: "",
      flat_no: "",
      street: "",
      landmark: "",
      pin_code: "",
      make_default_address: false,
    },
    validationSchema: AddressSchema,
    onSubmit: async (values) => {
      try {
        if (edit) {
          console.log("enter");
          try {
            showLoading();
            const payload = {
              ...values,
              coordinates: address.coordinates,
            };

            const res = await AddressApi.updateAddress(address._id, payload);
            toast.success(res.data.message);
            handleGetAddress();
            formik.resetForm();
            setEdit(false);
            setOpen(false);
            hideLoading();
          } catch (e) {
            hideLoading();
            toast.error("Error updating address");
          }
        } else {
          try {
            showLoading();
            const payload = {
              ...values,
              coordinates: address.coordinates?.coordinates,
            };
            const res = await AddressApi.createAddress(payload);
            toast.success(res.data.message);
            formik.resetForm();
            handleGetAddress();
            setAddress(null);
            setEdit(false);
            setOpen(false);

            hideLoading();
          } catch (e) {
            hideLoading();

            toast.error("Error creating address");
          }
        }
      } catch (err) {
        console.error("Failed to save address:", err);
      }
    },
  });

  const handleCountry = async () => {
    try {
      const res = await MasterApi.country();
      setCountryData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCity = async (id) => {
    try {
      const res = await MasterApi.city(id);
      setCityData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    formik.setFieldValue("city", address?.city._id);
    formik.setFieldValue("address", address?.fullAddress);
    formik.setFieldValue("pinCode", address?.pincode);
    handleGetAddress();
    handleCountry();
    handleCity(formik.values.country);
  }, [address, formik.values.country]);

  const countryOptions = countryData.map((item) => {
    return {
      value: item?._id,
      label: `${item?.name}`,
    };
  });

  const cityOptions = citydata.map((item) => {
    return {
      value: item?._id,
      label: `${item?.name}`,
    };
  });

  return (
    <>
      <div className="relative p-6 min-h-[80vh] ">
        <div className="w-full max-w-7xl mx-auto relative">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">My Addresses</h1>
              <p className="text-gray-500 mt-2">Manage your saved addresses</p>
            </div>
            <button
              onClick={() => {
                setOpen(true);
                formik.setFieldValue("city", "");
              }}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <FiPlus size={18} />
              Add New Address
            </button>
          </div>

          {AddressData.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-700">
                  No saved addresses
                </h3>
                <p className="mt-2 text-gray-500">
                  You haven't added any addresses yet. Add your first address to
                  get started.
                </p>
                <button
                  onClick={() => setOpen(true)}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none"
                >
                  Add Address
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {AddressData?.map((address) => (
                <AddressCard
                  key={address?._id || address.created_by}
                  address={address}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Address Sidebar */}
        {open && (
          <SidebarField
            title={edit ? "Edit Address" : "Add New Address"}
            handleClose={() => {
              setOpen(false);
              formik.resetForm();
            }}
            button1={
              <Button type="submit" onClick={formik.handleSubmit} text="Save" />
            }
            button2={
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  formik.resetForm();
                }}
                text="Cancel"
              />
            }
          >
            <form onSubmit={formik.handleSubmit} className="space-y-5 p-4">
              <InputField
                name="name"
                isRequired
                label=" Name"
                placeholder="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && formik.errors.name}
              />

              <InputField
                name="phone_number"
                isRequired
                label=" Phone number"
                placeholder=" Enter your phone number"
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.phone_number && formik.errors.phone_number
                }
              />

              <InputField
                name="country"
                label="Country"
                type="select"
                options={countryOptions}
                isRequired
                value={formik.values.country}
                error={formik.touched.country && formik.errors.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <InputField
                name="city"
                label="City"
                type="select"
                options={cityOptions}
                isRequired
                value={formik.values.city}
                error={formik.touched.city && formik.errors.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <InputField
                name="flat_no"
                label="Flat No"
                placeholder="Flat No"
                value={formik.values.flat_no}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.flat_no && formik.errors.flat_no}
                isRequired
              />
              <InputField
                name="street"
                label="Street"
                placeholder="Street"
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.street && formik.errors.street}
                isRequired
              />
              <InputField
                name="landmark"
                label="Landmark"
                placeholder="Landmark"
                value={formik.values.landmark}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.landmark && formik.errors.landmark}
              />

              <InputField
                name="pin_code"
                label="Pin Code"
                placeholder="Enter pincode"
                value={formik.values.pin_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pin_code && formik.errors.pin_code}
                isRequired
              />

              <InputField
                name="make_default_address"
                type="checkbox"
                label="Make this my default addresss"
                placeholder="Enter pincode"
                value={formik.values.make_default_address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.make_default_address &&
                  formik.errors.make_default_address
                }
                isRequired
              />
            </form>
            <ParentControlledMap address={address} setAddress={setAddress} />
          </SidebarField>
        )}

        {/* Delete Confirmation Modal */}
        {deleteaddress && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fade-in">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">
                  Delete Address
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete the address for{" "}
                  <span className="font-semibold text-gray-900">
                    {deleteaddress.buildingName}
                  </span>
                  ? This action cannot be undone.
                </div>
              </div>
              <div className="mt-5 flex justify-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => setaddressPop("")}
                >
                  Cancel
                </button>
                {/* <button
                type="button"
                className="px-4 py-2 rounded-md border border-transparent shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => {
                  console.log("Deleted:", deleteaddress.buildingName);
                  setaddressPop("");
                }}
              >
                Delete
              </button> */}
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-transparent shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={async () => {
                    try {
                      showLoading();
                      const res = await AddressApi.deleteAddress(
                        deleteaddress._id
                      );
                      toast.success("Address deleted successfully"); // Use the correct API call
                      handleGetAddress(); // Refresh the address list
                      setaddressPop("");
                      hideLoading(); // Close the modal
                    } catch (err) {
                      toast.error("Failed to delete address");
                      console.error("Failed to delete address:", err);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const AddressCard = ({ address, handleDelete, handleEdit }) => {
  return (
    <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-primary/50 transition-all duration-200 hover:shadow-md group cursor-pointer">
      {/* Badge for default address */}
      {address.make_default_address && (
        <span className="absolute top-2 left-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Default
        </span>
      )}

      {/* Action buttons */}
      <div className="absolute top-4 right-4 mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => handleEdit(address)}
          className="p-2 rounded-lg bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm border border-gray-200"
          aria-label="Edit address"
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={() => handleDelete(address)}
          className="p-2 rounded-lg bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm border border-gray-200"
          aria-label="Delete address"
        >
          <MdDeleteOutline size={18} />
        </button>
      </div>

      {/* Address content */}
      <div className="space-y-4 mt-2">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-3">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {address.name}
        </h2>

        <div className="space-y-3 text-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-gray-500 mt-0.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span>
              {address.flat_no}, {address.street}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-gray-500 mt-0.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span>
              {address.city.name}, {address.country.name}
            </span>
          </div>

          {address.landmark && (
            <div className="flex items-start gap-3">
              <span className="text-gray-500 mt-0.5">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M10 2a8 8 0 00-8 8c0 1.892.402 3.7 1.123 5.335l.015.027.002.005A10.96 10.96 0 0010 18a10.96 10.96 0 006.86-2.633l.002-.005.015-.027A7.955 7.955 0 0018 10a8 8 0 00-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
              </span>
              <span>Near {address.landmark}</span>
            </div>
          )}

          <div className="flex items-start gap-3">
            <span className="text-gray-500 mt-0.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="font-medium">PIN: {address.pin_code}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
