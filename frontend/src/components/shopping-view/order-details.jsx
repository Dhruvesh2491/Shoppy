import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  const generateInvoice = () => {
    if (!orderDetails) return;

    try {
    
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

    
      doc.setFontSize(24);
      doc.setFont("helvetica", "normal");
      doc.text("INVOICE", margin, 40);

   
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Sender:", pageWidth - margin - 50, 30);
      doc.setFont("helvetica", "normal");
      doc.text("Your Store Name", pageWidth - margin - 50, 35);

    
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Invoice:", margin, 55);
      doc.text("Date:", margin, 60);
      doc.text("Payment Status:", margin, 65);

      doc.setFont("helvetica", "normal");
      doc.text(`#${orderDetails._id.substring(0, 7)}`, margin + 30, 55);
      doc.text(new Date(orderDetails.orderDate).toLocaleDateString(), margin + 30, 60);
      doc.text(orderDetails.paymentStatus, margin + 30, 65);

     
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Receiver:", pageWidth - margin - 50, 55);
      doc.setFont("helvetica", "normal");
      doc.text(user.userName, pageWidth - margin - 50, 60);
      doc.text(orderDetails.addressInfo?.address || "", pageWidth - margin - 50, 65);
      doc.text(orderDetails.addressInfo?.city || "", pageWidth - margin - 50, 70);
      doc.text(orderDetails.addressInfo?.pincode || "", pageWidth - margin - 50, 75);
      doc.text(orderDetails.addressInfo?.phone || "", pageWidth - margin - 50, 80);


      doc.setDrawColor(100, 100, 100);
      doc.line(margin, 90, pageWidth - margin, 90);


      let yPos = 100;
      doc.setFont("helvetica", "bold");
      doc.text("Item Description", margin, yPos);
      doc.text("Price ($)", margin + 100, yPos, { align: "right" });
      doc.text("Quantity", margin + 130, yPos, { align: "right" });
      doc.text("Subtotal ($)", pageWidth - margin, yPos, { align: "right" });

    
      yPos += 10;
      doc.setFont("helvetica", "normal");

      let totalAmount = 0;

      if (orderDetails.cartItems && orderDetails.cartItems.length > 0) {
        orderDetails.cartItems.forEach((item) => {
          doc.text(item.title, margin, yPos);
          doc.text(item.price.toString(), margin + 100, yPos, { align: "right" });
          doc.text(item.quantity.toString(), margin + 130, yPos, { align: "right" });

          const subtotal = (parseFloat(item.price) * item.quantity).toFixed(2);
          doc.text(subtotal.toString(), pageWidth - margin, yPos, { align: "right" });

          totalAmount += parseFloat(subtotal);
          yPos += 10;
        });
      }

     
      yPos += 5;
      doc.setDrawColor(100, 100, 100);
      doc.line(margin + 100, yPos, pageWidth - margin, yPos);
      yPos += 7;

      doc.setFont("helvetica", "bold");
      doc.text("Total ($)", margin + 130, yPos, { align: "right" });
      doc.text(totalAmount.toFixed(2), pageWidth - margin, yPos, { align: "right" });

      
      yPos += 10;
      doc.setDrawColor(100, 100, 100);
      doc.line(margin, yPos, pageWidth - margin, yPos);

     
      yPos += 15;
      doc.setFont("helvetica", "bold");
      doc.text("Kindly make your payment to:", margin, yPos);
      yPos += 7;

      doc.setFont("helvetica", "normal");
      doc.text(`Payment Method: ${orderDetails.paymentMethod}`, margin, yPos);

      
      yPos += 20;
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text("Note: Thank you for your purchase!", margin, yPos);

      
      doc.save(`Invoice-${orderDetails._id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!orderDetails) return null;

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Order Details</h3>
        <Button
          onClick={generateInvoice}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Download Invoice
        </Button>
      </div>

      <div
        className="overflow-y-auto"
        style={{ maxHeight: "70vh" }}
      >
        <div className="grid gap-6 p-1">
          <div className="grid gap-2">
            <div className="flex mt-6 items-center justify-between">
              <p className="font-medium">Order ID</p>
              <Label>{orderDetails?._id}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Date</p>
              <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Price</p>
              <Label>${orderDetails?.totalAmount}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment method</p>
              <Label>{orderDetails?.paymentMethod}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment Status</p>
              <Label>{orderDetails?.paymentStatus}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Status</p>
              <Label>
                <Badge
                  className={`py-1 px-3 ${orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                      ? "bg-red-600"
                      : "bg-black"
                    }`}
                >
                  {orderDetails?.orderStatus}
                </Badge>
              </Label>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Order Details</div>
              <ul className="grid gap-3">
                {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                  ? orderDetails?.cartItems.map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
                    </li>
                  ))
                  : null}
              </ul>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Shipping Info</div>
              <div className="grid gap-0.5 text-muted-foreground">
                <span>{user?.userName}</span>
                <span>{orderDetails?.addressInfo?.address}</span>
                <span>{orderDetails?.addressInfo?.city}</span>
                <span>{orderDetails?.addressInfo?.pincode}</span>
                <span>{orderDetails?.addressInfo?.phone}</span>
                <span>{orderDetails?.addressInfo?.notes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;