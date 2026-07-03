"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultCustomers, readStoredCustomers, type Customer } from "@/lib/customer-storage";
import { shareWhatsAppImage, sendSms } from "@/lib/payment-actions";

export default function AllDues() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>(defaultCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    setCustomers(readStoredCustomers());
  }, []);

  return (
    <div className="w-full max-w-[412px] h-[892px] bg-[#F8FAFC] rounded-[40px] shadow-2xl border-8 border-[#1E293B] relative overflow-hidden flex flex-col select-none">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-[#2563EB] to-[#4F46E5] pt-14 pb-10 px-6 rounded-b-[32px] text-center shadow-lg relative">
        <div className="absolute inset-0 bg-white/5 opacity-20 rounded-b-[32px] pointer-events-none" />
        <button
          type="button"
          aria-label="Go back to home"
          onClick={() => router.push("/")}
          className="absolute top-12 left-5 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-white text-xl font-bold tracking-wide drop-shadow-sm">
          All Pending Dues
        </h1>
        <p className="text-blue-100/90 text-sm font-medium tracking-wider mt-1">
          {customers.length} customers
        </p>
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

      {/* List */}
      <div className="w-full flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-12">
        <div className="space-y-1">
          {customers.map((customer, i) => (
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
