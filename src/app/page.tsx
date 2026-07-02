"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addCustomer, readStoredCustomers, type Customer } from "@/lib/customer-storage";
import { shareWhatsAppImage, sendSms } from "@/lib/payment-actions";

export default function Home() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const customerNameRef = useRef<HTMLInputElement>(null);

  const isNameValid = customerName.trim().length > 0;
  const isAmountValid = dueAmount.trim().length > 0 && parseFloat(dueAmount) > 0;
  const isMobileValid = mobileNumber.trim().length === 10;
  const isFormValid = isNameValid && isAmountValid && isMobileValid;

  useEffect(() => {
    customerNameRef.current?.focus();

    const loadCustomers = async () => {
      const storedCustomers = await readStoredCustomers();
      setCustomers(storedCustomers);
    };

    loadCustomers();
  }, []);

  useEffect(() => {
    if (dueAmount.length > 0 && !isAmountValid) {
      setAmountError(true);
    } else {
      setAmountError(false);
    }

    if (mobileNumber.length > 0 && mobileNumber.length < 10) {
      setMobileError(true);
    } else {
      setMobileError(false);
    }
  }, [dueAmount, mobileNumber, isAmountValid]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isNameValid) {
      e.preventDefault();
      document.getElementById("dueAmount")?.focus();
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueAmount(e.target.value);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^0-9]/g, "");
    setMobileNumber(filtered);
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isAmountValid) {
      e.preventDefault();
      document.getElementById("mobileNumber")?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isProcessing) return;

    setIsProcessing(true);

    const newCustomer: Customer = {
      name: customerName.trim(),
      amount: parseFloat(dueAmount),
      mobile: mobileNumber,
      days: 0,
    };

    await addCustomer(newCustomer);
    setCustomers((prev) => [newCustomer, ...prev]);
    setIsProcessing(false);
    setCustomerName("");
    setDueAmount("");
    setMobileNumber("");
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      customerNameRef.current?.focus();
    }, 3500);
  };

  return (
    <div className="w-full max-w-[412px] h-[892px] bg-[#F8FAFC] rounded-[40px] shadow-2xl border-8 border-[#1E293B] relative overflow-hidden flex flex-col justify-between select-none">
      {/* Success Toast */}
      <div
        className={`absolute top-4 left-5 right-5 z-30 p-4 bg-emerald-50 border border-emerald-200 rounded-[18px] flex items-center gap-3 transition-all duration-300 pointer-events-none ${
          showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="bg-emerald-500 text-white rounded-full p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-900">Reminder Processed</h4>
          <p className="text-xs text-emerald-700 font-medium">
            Notification successfully queued for delivery.
          </p>
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-auto no-scrollbar pb-12">
        {/* Header */}
        <div className="w-full bg-gradient-to-b from-[#2563EB] to-[#4F46E5] pt-14 pb-20 px-6 rounded-b-[32px] text-center shadow-lg relative">
          <div className="absolute inset-0 bg-white/5 opacity-20 rounded-b-[32px] pointer-events-none" />
          <h1 className="text-white text-2xl font-bold tracking-wide drop-shadow-sm">
            KHERWAL BAZAAR
          </h1>
          <p className="text-blue-100/90 text-sm font-medium tracking-wider uppercase mt-1">
            Payment Reminder
          </p>
        </div>

        {/* Form card */}
        <div className="px-5 -mt-12 relative z-10">
          <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-2 tracking-wide">
                  Customer Name
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#9CA3AF] transition-colors group-focus-within:text-[#2563EB]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </span>
                  <input
                    ref={customerNameRef}
                    type="text"
                    value={customerName}
                    onChange={handleNameChange}
                    onKeyDown={handleNameKeyDown}
                    required
                    placeholder="Enter Customer Name"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[16px] text-[#111827] font-medium placeholder-[#9CA3AF] text-sm outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              {/* Due Amount */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-2 tracking-wide">
                  Due Amount
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-lg font-semibold text-[#111827] transition-colors group-focus-within:text-[#2563EB]">
                    ₹
                  </span>
                  <input
                    id="dueAmount"
                    type="number"
                    value={dueAmount}
                    onChange={handleAmountChange}
                    onKeyDown={handleAmountKeyDown}
                    required
                    placeholder="Enter Due Amount"
                    className="w-full pl-9 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[16px] text-[#111827] font-medium placeholder-[#9CA3AF] text-sm outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </div>
                <p className={`text-xs text-rose-500 font-medium mt-1.5 ${amountError ? "" : "hidden"}`}>
                  Please enter a valid amount.
                </p>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-2 tracking-wide">
                  Mobile Number
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#9CA3AF] transition-colors group-focus-within:text-[#2563EB]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H13.5M10.5 22.5H13.5M19.5 4.5V19.5C19.5 20.8807 18.3807 22 17.5 22H6.5C5.61929 22 4.5 20.8807 4.5 19.5V4.5C4.5 3.11929 5.61929 2 6.5 2H17.5C18.3807 2 19.5 3.11929 19.5 4.5Z" />
                    </svg>
                  </span>
                  <input
                    id="mobileNumber"
                    type="tel"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    required
                    maxLength={10}
                    placeholder="Enter Mobile Number"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[16px] text-[#111827] font-medium placeholder-[#9CA3AF] text-sm outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </div>
                <p className={`text-xs text-rose-500 font-medium mt-1.5 ${mobileError ? "" : "hidden"}`}>
                  Mobile number must be exactly 10 digits.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isFormValid || isProcessing}
                  className="w-full h-[56px] rounded-[16px] font-bold text-white tracking-wide shadow-md transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 active:scale-[0.98] disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  <span>{isProcessing ? "Processing..." : "Send Reminder"}</span>
                  {isProcessing && (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-5 mt-4 flex gap-3">
          <div className="flex-1 bg-white rounded-xl p-4 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <p className="text-[11px] font-semibold text-[#9CA3AF] tracking-wide uppercase mb-1">You Gave</p>
            <p className="text-lg font-bold text-rose-500">₹{customers.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</p>
            <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">{customers.length} customers</p>
          </div>
          <div className="flex-1 bg-white rounded-xl p-4 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <p className="text-[11px] font-semibold text-[#9CA3AF] tracking-wide uppercase mb-1">You Got</p>
            <p className="text-lg font-bold text-emerald-500">₹0</p>
            <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">0 customers</p>
          </div>
        </div>

        {/* Pending Dues List */}
        <div className="px-5 mt-4">
          <h3 className="text-xs font-bold text-[#111827] tracking-wide mb-3">Pending Dues</h3>
          <div className="space-y-1">
            {customers.slice(0, 5).map((customer, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center text-white text-xs font-bold">
                      {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{customer.name}</p>
                      <p className="text-[11px] text-[#9CA3AF] font-medium">{customer.mobile}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#111827]">₹{customer.amount.toLocaleString()}</p>
                    <p className={`text-[11px] font-semibold ${customer.days > 7 ? "text-rose-500" : customer.days > 3 ? "text-amber-500" : "text-emerald-500"}`}>
                      {customer.days}d overdue
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`View details for ${customer.name}`}
                    onClick={() => setSelectedCustomer(customer)}
                    className="ml-3 w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {customers.length > 5 && (
            <button
              onClick={() => router.push("/all-dues")}
              className="w-full mt-3 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-[#2563EB] hover:bg-slate-50 transition-colors"
            >
              See All ({customers.length})
            </button>
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedCustomer && (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedCustomer(null)} />
          <div className="relative w-full bg-white rounded-t-[28px] p-6 pb-8 animate-slide-up">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center text-white text-sm font-bold">
                {selectedCustomer.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-base font-bold text-[#111827]">{selectedCustomer.name}</p>
                <p className="text-xs text-[#9CA3AF] font-medium">+91 {selectedCustomer.mobile}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[16px] p-4 mb-5 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[#9CA3AF] font-medium">Due Amount</span>
                <span className="text-sm font-bold text-[#111827]">₹{selectedCustomer.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#9CA3AF] font-medium">Overdue</span>
                <span className={`text-sm font-bold ${selectedCustomer.days > 7 ? "text-rose-500" : selectedCustomer.days > 3 ? "text-amber-500" : "text-emerald-500"}`}>
                  {selectedCustomer.days} days
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => shareWhatsAppImage(selectedCustomer.amount, selectedCustomer.mobile)}
                className="flex-1 h-[52px] rounded-[14px] font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-[#25D366] text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => sendSms(selectedCustomer.amount, selectedCustomer.mobile, selectedCustomer.name, selectedCustomer.days)}
                className="flex-1 h-[52px] rounded-[14px] font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-[#2563EB] text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                SMS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
