import { useState } from "react";
import { 
  Download, 
  FileText, 
  CreditCard, 
  Smartphone, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer,
  Send
} from "lucide-react";

// Mock invoice data - will be replaced with API data
const mockInvoices = [
  {
    id: "INV-001",
    bookingRef: "SER-2026-001",
    room: { name: "Room 205", type: "double" },
    checkIn: "2026-04-10",
    checkOut: "2026-04-13",
    nights: 3,
    issueDate: "2026-04-13",
    dueDate: "2026-04-13",
    status: "paid",
    paymentMethod: "mpesa",
    items: [
      { description: "Room charge - Double Room", quantity: 3, unitPrice: 4000, total: 12000 },
      { description: "Room Service - Dinner", quantity: 1, unitPrice: 1500, total: 1500 },
      { description: "Laundry Service", quantity: 1, unitPrice: 800, total: 800 },
    ],
    subtotal: 14300,
    tax: 0,
    total: 14300,
    payments: [
      { date: "2026-04-10", method: "mpesa", amount: 14300, reference: "MPESA-ABC123" }
    ]
  },
  {
    id: "INV-002",
    bookingRef: "SER-2026-002",
    room: { name: "Room 101", type: "single" },
    checkIn: "2026-05-15",
    checkOut: "2026-05-17",
    nights: 2,
    issueDate: "2026-05-17",
    dueDate: "2026-05-17",
    status: "pending",
    paymentMethod: null,
    items: [
      { description: "Room charge - Single Room", quantity: 2, unitPrice: 2500, total: 5000 },
    ],
    subtotal: 5000,
    tax: 0,
    total: 5000,
    payments: []
  },
  {
    id: "INV-003",
    bookingRef: "SER-2026-003",
    room: { name: "Room 301", type: "suite" },
    checkIn: "2026-03-20",
    checkOut: "2026-03-22",
    nights: 2,
    issueDate: "2026-03-22",
    dueDate: "2026-03-22",
    status: "paid",
    paymentMethod: "card",
    items: [
      { description: "Room charge - Suite", quantity: 2, unitPrice: 7500, total: 15000 },
      { description: "Minibar", quantity: 1, unitPrice: 1200, total: 1200 },
      { description: "Spa Service", quantity: 1, unitPrice: 3000, total: 3000 },
    ],
    subtotal: 19200,
    tax: 0,
    total: 19200,
    payments: [
      { date: "2026-03-22", method: "card", amount: 19200, reference: "CARD-XXXX-1234" }
    ]
  },
  {
    id: "INV-004",
    bookingRef: "SER-2026-004",
    room: { name: "Room 102", type: "single" },
    checkIn: "2026-02-10",
    checkOut: "2026-02-12",
    nights: 2,
    issueDate: "2026-02-12",
    dueDate: "2026-02-12",
    status: "refunded",
    paymentMethod: "mpesa",
    items: [
      { description: "Room charge - Single Room", quantity: 2, unitPrice: 2500, total: 5000 },
    ],
    subtotal: 5000,
    tax: 0,
    total: 5000,
    payments: [
      { date: "2026-02-12", method: "mpesa", amount: 5000, reference: "MPESA-DEF456" }
    ]
  }
];

// Current active stay (for checkout billing)
const activeStay = {
  id: "ACT-001",
  bookingRef: "SER-2026-005",
  room: { name: "Room 205", type: "double" },
  checkIn: "2026-04-10",
  checkOut: "2026-04-13",
  nights: 3,
  items: [
    { id: 1, description: "Room charge - Double Room", quantity: 3, unitPrice: 4000, total: 12000, date: "2026-04-10" },
    { id: 2, description: "Room Service - Breakfast", quantity: 2, unitPrice: 500, total: 1000, date: "2026-04-11" },
    { id: 3, description: "Room Service - Dinner", quantity: 1, unitPrice: 1500, total: 1500, date: "2026-04-11" },
    { id: 4, description: "Laundry Service", quantity: 1, unitPrice: 800, total: 800, date: "2026-04-12" },
  ],
  subtotal: 15300,
  tax: 0,
  total: 15300,
  paid: 5000,
  remaining: 10300,
};

const statusConfig = {
  paid: { label: "Paid", color: "bg-green-500/10 text-green-600", icon: CheckCircle },
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600", icon: Clock },
  refunded: { label: "Refunded", color: "bg-gray-500/10 text-gray-500", icon: AlertCircle },
};

const paymentMethodConfig = {
  mpesa: { label: "M-Pesa", icon: Smartphone, color: "text-green-600" },
  card: { label: "Card", icon: CreditCard, color: "text-blue-600" },
  cash: { label: "Cash", icon: CreditCard, color: "text-gray-600" },
};

const GuestBilling = () => {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filter, setFilter] = useState("all"); // all, paid, pending
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter invoices
  const getFilteredInvoices = () => {
    switch (filter) {
      case "paid":
        return invoices.filter(inv => inv.status === "paid");
      case "pending":
        return invoices.filter(inv => inv.status === "pending");
      default:
        return invoices;
    }
  };

  const filteredInvoices = getFilteredInvoices();

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Toggle expanded invoice
  const toggleExpand = (invoiceId) => {
    setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
  };

  // Handle download PDF (BP-03)
  const handleDownloadPDF = (invoice) => {
    console.log("Downloading PDF for invoice:", invoice.id);
    // In production: Generate and download PDF
    alert(`Downloading invoice ${invoice.id}...`);
  };

  // Handle print invoice
  const handlePrint = (invoice) => {
    console.log("Printing invoice:", invoice.id);
    window.print();
  };

  // Handle M-Pesa payment (BP-05)
  const handleMpesaPayment = () => {
    if (!mpesaNumber || mpesaNumber.length < 10) {
      alert("Please enter a valid M-Pesa number");
      return;
    }
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowMpesaModal(false);
      setShowSuccessModal(true);
      setMpesaNumber("");
      
      // Update invoice status
      setTimeout(() => {
        setShowSuccessModal(false);
        // In production: Update actual invoice
      }, 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Billing & Invoices</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage your payments and invoices
        </p>
      </div>

      {/* Active Stay / Checkout Section (BP-02: Add extra charges) */}
      {activeStay && (
        <div className="bg-card border border-primary/30 rounded-lg overflow-hidden">
          <div className="bg-primary/5 px-6 py-4 border-b border-primary/30">
            <h2 className="text-lg font-semibold text-foreground">Current Stay</h2>
            <p className="text-sm text-muted-foreground">
              {activeStay.room.name} - {formatDate(activeStay.checkIn)} to {formatDate(activeStay.checkOut)}
            </p>
          </div>
          <div className="p-6">
            {/* Bill Items */}
            <div className="space-y-3 mb-6">
              {activeStay.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-border-light">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × KES {item.unitPrice.toLocaleString()} • {item.date}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    KES {item.total.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-2 mb-6 pt-3 border-t border-border-light">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">KES {activeStay.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">KES {activeStay.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2">
                <span className="text-foreground">Total</span>
                <span className="text-primary">KES {activeStay.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="text-green-600">KES {activeStay.paid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-1">
                <span className="text-foreground">Remaining Balance</span>
                <span className="text-destructive">KES {activeStay.remaining.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Actions (BP-04, BP-05) */}
            {activeStay.remaining > 0 && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowMpesaModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  Pay with M-Pesa
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                  <CreditCard className="w-4 h-4" />
                  Pay at Reception
                </button>
              </div>
            )}

            {activeStay.remaining === 0 && (
              <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Fully Paid - Thank you!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoice History Section */}
      <div className="bg-card border border-border-light rounded-lg overflow-hidden">
        <div className="border-b border-border-light px-6 py-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Invoice History</h2>
              <p className="text-sm text-muted-foreground">View and download past invoices</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2">
              {[
                { id: "all", label: "All" },
                { id: "paid", label: "Paid" },
                { id: "pending", label: "Pending" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors
                    ${filter === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-border-light">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          ) : (
            filteredInvoices.map((invoice) => {
              const StatusIcon = statusConfig[invoice.status]?.icon || FileText;
              const isExpanded = expandedInvoice === invoice.id;
              
              return (
                <div key={invoice.id} className="transition-all">
                  {/* Invoice Header */}
                  <div 
                    className="px-6 py-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => toggleExpand(invoice.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-semibold text-foreground">
                            Invoice #{invoice.id}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${statusConfig[invoice.status]?.color}`}>
                            {statusConfig[invoice.status]?.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>{invoice.room.name}</span>
                          <span>•</span>
                          <span>{formatDate(invoice.checkIn)} → {formatDate(invoice.checkOut)}</span>
                          <span>•</span>
                          <span>{invoice.nights} nights</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">
                            KES {invoice.total.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Issued: {formatDate(invoice.issueDate)}
                          </p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Invoice Details */}
                  {isExpanded && (
                    <div className="border-t border-border-light px-6 py-4 bg-secondary/10">
                      {/* Items Table */}
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                          Charges Breakdown
                        </h4>
                        <div className="space-y-2">
                          {invoice.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {item.description} × {item.quantity}
                              </span>
                              <span className="text-foreground">KES {item.total.toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="border-t border-border-light pt-2 mt-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="text-foreground">Total</span>
                              <span className="text-primary font-bold">KES {invoice.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Details */}
                      {invoice.payments.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                            Payment Details
                          </h4>
                          {invoice.payments.map((payment, idx) => {
                            const PaymentIcon = paymentMethodConfig[payment.method]?.icon || CreditCard;
                            return (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                  <PaymentIcon className="w-4 h-4" />
                                  <span className="text-muted-foreground">
                                    {paymentMethodConfig[payment.method]?.label || payment.method}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Ref: {payment.reference}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <p className="text-foreground">KES {payment.amount.toLocaleString()}</p>
                                  <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Action Buttons (BP-03) */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleDownloadPDF(invoice)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download PDF
                        </button>
                        <button
                          onClick={() => handlePrint(invoice)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-secondary transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print
                        </button>
                        {invoice.status === "pending" && (
                          <button
                            onClick={() => setShowMpesaModal(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* M-Pesa Payment Modal (BP-05) */}
      {showMpesaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-foreground">M-Pesa Payment</h3>
              </div>
              <button
                onClick={() => setShowMpesaModal(false)}
                className="p-1 hover:bg-secondary rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  placeholder="0712345678"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You will receive an STK push on this number
                </p>
              </div>

              <div className="bg-secondary/30 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Amount to pay:</span>
                  <span className="font-bold text-foreground">
                    KES {activeStay?.remaining?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowMpesaModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleMpesaPayment}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay with M-Pesa"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg max-w-sm w-full mx-4 p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your payment has been processed successfully.
              A confirmation has been sent to your email.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestBilling;