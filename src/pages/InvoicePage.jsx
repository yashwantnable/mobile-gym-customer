import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { BookingApi } from "../Api/Booking.api";
import html2pdf from "html2pdf.js";
import { useLoading } from "../loader/LoaderContext";

const InvoicePage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState({});
  const { handleLoading } = useLoading();
  const componentRef = useRef();

  const getInvoiceBooking = async (term) => {
    handleLoading(true);
    try {
      const res = await BookingApi.getBookingByid(term);
      // The new API response has data at res.data.data
      setBooking(res?.data?.data || {});
    } catch (error) {
      console.error("Error fetching invoice", error);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    getInvoiceBooking(id);
  }, [id]);

  const handleDownloadPDF = () => {
    const element = componentRef.current;
    const opt = {
      margin: 0.3,
      filename: `Invoice-${id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  if (!booking)
    return <div className="flex justify-center py-12">Loading invoice...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div
        ref={componentRef}
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        {/* Invoice Header */}
        <div className="bg-gradient-to-r bg-primary text-white p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-third">OutBox</h1>
              <p className="text-third mt-1">Professional Training Services</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <h2 className="text-2xl font-bold text-third">INVOICE</h2>
              <p className="text-third mt-1">#{booking.invoiceNumber || id}</p>
              <p className="mt-2">
                {booking.createdAt
                  ? new Date(booking.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Company and Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div className="border-l-4 border-primary pl-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">From:</h3>
            <p className="font-bold text-gray-900">OutBox</p>
            <p className="text-gray-600">Govind Nagar, Green Park</p>
            <p className="text-gray-600">Bilaspur, India 495001</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Bill To:
            </h3>
            {/* No user object in new response, so skip user name */}
            {/* Address from subscription.Address */}
            {booking.subscription && booking.subscription.Address ? (
              <>
                <p className="font-bold text-gray-900">
                  {/* No customer name in response, so leave blank or N/A */}
                  N/A
                </p>
                <p className="text-gray-600">
                  {booking.subscription.Address.streetName || "N/A"}
                </p>
                <p className="text-gray-600">
                  {booking.subscription.Address.landmark &&
                    `${booking.subscription.Address.landmark}, `}
                  {booking.subscription.Address.city?.name || "N/A"}
                </p>
                <p className="text-gray-600">
                  {booking.subscription.Address.country?.name || "N/A"}{" "}
                  {booking.subscription.Address.zipCode || ""}
                </p>
              </>
            ) : (
              <p className="text-gray-600">N/A</p>
            )}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">
                  {/* No paymentMethod in new response, so N/A */}
                  N/A
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span
                    className={`px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800`}
                  >
                    {/* No status in new response, so N/A */}
                    N/A
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details Table */}
        <div className="px-8 pb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">
                    Trainer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 px-4 border-b">
                    <p className="font-medium text-gray-800">
                      {booking.subscription && booking.subscription.sessionType
                        ? booking.subscription.sessionType.sessionName
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking.subscription && booking.subscription.categoryId
                        ? booking.subscription.categoryId.cName
                        : "Personal Training Session"}
                    </p>
                  </td>
                  <td className="py-4 px-4 border-b">
                    {booking.subscription && booking.subscription.trainer ? (
                      <>
                        <p className="font-medium">
                          {booking.subscription.trainer.first_name}{" "}
                          {booking.subscription.trainer.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.subscription.trainer.email}
                        </p>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-4 px-4 border-b">
                    {booking.createdAt ? (
                      <>
                        <p>
                          {new Date(booking.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-sm text-gray-500">-</p>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-4 px-4 border-b font-medium text-gray-800">
                    {booking.subscription && booking.subscription.price != null
                      ? `AED ${booking.subscription.price.toFixed(2)}`
                      : "AED 0.00"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Amount */}
          <div className="flex justify-end mt-6">
            <div className="w-full md:w-1/3">
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg p-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total:</span>
                  <span className="text-2xl font-sm text-third">
                    {booking.subscription && booking.subscription.price != null
                      ? `AED ${booking.subscription.price.toFixed(2)}`
                      : "AED 0.00"}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>Tax (0%):</span>
                  <span>AED 0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-6">
          <h4 className="font-semibold text-primary mb-2">Notes & Policies:</h4>
          <p className="text-gray-600 text-sm">
            Thank you for your business. Payment is due within 15 days of
            invoice date. Late payments are subject to fees. Please contact us
            at billing@outbox.com with any questions regarding this invoice.
          </p>
          {/* <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <img
                src="/path/to/company/signature.png"
                alt="Signature"
                className="h-10 w-auto mb-2 mx-auto md:mx-0"
              />
              <p className="text-gray-600 text-sm">Authorized Signature</p>
            </div>
            <div className="mt-4 md:mt-0 text-center">
              <div className="w-32 h-32 bg-gray-200 border-2 border-dashed rounded-xl mx-auto" />
              <p className="text-gray-600 text-sm mt-2">Company Stamp</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-gradient-to-r bg-primary  text-third font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
              clipRule="evenodd"
            />
          </svg>
          Download PDF Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
