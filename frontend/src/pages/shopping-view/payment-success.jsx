import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckIcon, CreditCardIcon } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    if (countdown === 0) {
      navigate("/shop/home");
    }

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="max-w-md w-full mx-4 py-8 px-4 text-center flex flex-col items-center shadow-md">
        <div className="w-24 h-24 rounded-full bg-emerald-400 flex items-center justify-center mb-6">
          <div className="flex items-center justify-center text-white">
            <CheckIcon className="h-10 w-10" />
            <CreditCardIcon className="h-8 w-8 ml-1" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-emerald-400 mb-2">Thank You!</h1>
        <p className="text-gray-700 mb-6">Payment done Successfully</p>
        <button
          className="mt-4 text-sm text-emerald-500 hover:text-emerald-600 hover:underline"
          onClick={() => navigate("/shop/account")}
        >
          View My Orders
        </button>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;