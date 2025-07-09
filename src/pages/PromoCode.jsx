import { useEffect, useState } from "react";

import CouponDetail from "../components/CouponDetail";
import CouponCard from "../components/CouponCard";
import Header from "../components/Header";
import toast from "react-hot-toast";
import { useLoading } from "../loader/LoaderContext";
import { PromocodeApi } from "../Api/Promocode.api";

// Main PromoCode component
export default function PromoCode() {
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [copied, setCopied] = useState(false);
    const [coupons, setCoupons] = useState([])
    const {handleLoading} = useLoading()

    console.log("selectedCoupon>>",selectedCoupon)

    // const coupons = [
    //     {
    //         title: "Starbucks",
    //         discount: "Buy 1 Get 1 Free",
    //         code: "BOGO2023",
    //         expiry: "05 April 2024",
    //         terms: `Purchase any Starbucks beverage and receive a complimentary second beverage. 
    // - Redeemable at all Starbucks Coffee stores. 
    // - Not valid with other discounts.`,
    //         logo: "https://cdn.create.vista.com/downloads/c5fcab60-b3c9-4f85-b5a3-85c28899963d_1024.jpeg",
    //     },
    // ];

    const handleGetAllPromoCode = async () => {
        handleLoading(true)
        try{
            const res = await PromocodeApi.getAllPromoCodes();
            console.log(res.data?.data)
            setCoupons(res.data?.data)
        }
        catch(err){
            console.log(err)
        }finally{
            handleLoading(false)
        }
    }

    useEffect(() => {
        handleGetAllPromoCode()
    },[])

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Copied Successfully")
    };

    const fallbackMessage = "Select a coupon to view details";
    const noCouponsMessage = "No coupons available";

    return (
        <div className="min-h-screen bg-[#FCEEE5] py-8">
            <div className="container mx-auto px-4">
                <Header content={"Exclusive Coupons"} />
                <div className="flex flex-col lg:flex-row gap-6 -mt-8">
                    {/* Coupons List */}
                    <div className="w-full lg:w-2/5 bg-white p-6 rounded-2xl shadow-lg h-[100vh] overflow-auto">
                        <h2 className="text-xl font-bold mb-6 text-[#353535] border-b pb-2">Available Coupons</h2>
                        {coupons.length > 0 ? (
                            <div className="grid gap-4">
                                {coupons.map((coupon, index) => (
                                    <CouponCard
                                        key={index}
                                        title={coupon.code}
                                        discount={coupon.description}
                                        expiry={coupon.endDate}
                                        logo={coupon.image}
                                        isSelected={selectedCoupon?.code === coupon.code}
                                        onClick={() => setSelectedCoupon(coupon)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-[#99928D] py-8">{noCouponsMessage}</div>
                        )}
                    </div>

                    {/* Coupon Details */}
                    <div className="w-full lg:w-3/5 bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-6 text-[#353535] border-b pb-2">Coupon Details</h2>

                        {selectedCoupon ? (
                            <CouponDetail
                                title={selectedCoupon.code}
                                offer={selectedCoupon.description}
                                code={selectedCoupon.code}
                                terms={selectedCoupon.termsAndConditions}
                                expiry={selectedCoupon.endDate}
                                logo={selectedCoupon.image}
                                onCopy={() => handleCopyCode(selectedCoupon.code)}
                                copied={copied}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-64 text-[#99928D]">
                                {fallbackMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}