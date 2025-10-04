import React, { useState } from "react";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import { Controller, useForm } from "react-hook-form";
import FloatingInput from "../FloatingInput/FloatingInput";
import { yupResolver } from "@hookform/resolvers/yup";
import BankAnsarLogo from "../../assets/Icons/BankCards/IconBankAnsarLogo";
import BankMellatLogo from "../../assets/Icons/BankCards/IconBankMellatLogo";
import BankMelliLogo from "../../assets/Icons/BankCards/IconBankMelliLogo";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import Accordion from "../Withdrawal/Accordion";
import { toast } from "react-toastify";

export default function CardToCardTransfer() {
  const amounts = [5, 10, 20, 50];
  const [showSummary, setShowSummary] = useState(false);

  const { control, setValue, watch } = useForm({
    resolver: yupResolver(),
  });

  const selectedAmount = watch("amount");
  const selectedBank = watch("bank");

  const bankOptions = {
    meli: { label: "بانک ملی ایران", icon: <BankMelliLogo /> },
    mellat: { label: "بانک ملت ایران", icon: <BankMellatLogo /> },
    noor: { label: "بانک انصار", icon: <BankAnsarLogo /> },
    melal: { label: "مؤسسه اعتباری ملل", icon: <BankAnsarLogo /> },
  };

  const transactionData = {
    bank: selectedBank ? bankOptions[selectedBank]?.label : "—",
    bankIcon: selectedBank ? bankOptions[selectedBank]?.icon : null,
    fromCard: "۸۳۷۸۳۷۸۳۸۸۱۴۷۷۴۶۴۷",
    toCard: "۸۳۷۸۳۷۸۳۸۸۱۴۷۷۴۶۴۷",
    owner: "گروه فرهنگی و هنری",
    amount: selectedAmount || 0,
    finalAmount: selectedAmount
      ? (selectedAmount - 100000).toLocaleString()
      : "0",
  };

  const handleSubmit = () => {
    if (!selectedBank || !selectedAmount) {
      toast.error("لطفاً بانک و مبلغ واریزی را انتخاب کنید");
      return;
    }
    setShowSummary(true);
  };

  return (
    <div className="w-full lg:px-7" dir="rtl">
      {!showSummary ? (
        <>
          {/* فرم اولیه */}
          <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
            <span className="icon-wrapper w-6 h-6 text-blue2">
              <IconVideo />
            </span>
            <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
          </div>

          {/* انتخاب بانک */}
          <div className="mb-12 ">
            <Controller
              name="bank"
              control={control}
              render={({ field }) => (
                <FloatingSelect
                  placeholder="بانک مبدا را انتخاب کنید"
                  label="انتخاب بانک مبدا"
                  value={field.value}
                  onChange={field.onChange}
                  options={Object.keys(bankOptions).map((key) => ({
                    value: key,
                    label: bankOptions[key].label,
                    icon: (
                      <span className="w-6 h-6">{bankOptions[key].icon}</span>
                    ),
                  }))}
                />
              )}
            />
          </div>

          {/* مقدار واریزی */}
          <div dir="rtl" className="mb-1.5 z-0 text-black0">
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <FloatingInput
                  label="مقدار واریزی"
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                  placeholder="0 تومان "
                  placeholderColor="text-black0"
                />
              )}
            />
          </div>

          {/* دکمه‌های سریع انتخاب مبلغ */}
          <div className="flex gap-2 items-center mb-12 mt-5 flex-wrap justify-center">
            {amounts.map((amount, index) => (
              <button
                key={index}
                onClick={() => setValue("amount", amount * 1000000)}
                className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm"
              >
                {amount} میلیون
              </button>
            ))}
          </div>

          {/* دکمه درخواست */}
          <div className="mt-40">
            <button
              onClick={handleSubmit}
              className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg"
            >
              درخواست کارت به کارت
            </button>

            <div className="mt-4" dir="ltr">
              <Accordion title="راهنمای واریز کارت به کارت ">
                <ul className="list-disc pr-5 space-y-2 text-black1">
                  <li>
                    از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی
                    شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)
                  </li>
                  <li>
                    مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.
                  </li>
                </ul>
              </Accordion>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* بخش رسید */}
          <div className="rounded-lg p-1 text-black0 space-y-8">
            <div className="flex flex-col gap-3 text-black0 bg-white5 rounded-xl p-4 lg:my-8 items-center">
              <span className="text-gray5 lg:text-lg text-xs">فرصت باقی مانده برای انجام کارت به کارت</span>
              <span className="font-bold lg:text-xl text-xs">25:13:45</span>
            </div>
<div className="space-y-6 lg:text-lg text-xs ">

           <div className="flex justify-between items-center">
                <span> کارت مبدا</span>
              <div className="flex gap-2 items-center">
              <span>{transactionData.fromCard}</span>
                <span className="icon-wrapper w-7 h-7 ">
                  {transactionData.bankIcon}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>مبلغ تراکنش</span>
              <span>{transactionData.amount.toLocaleString()} تومان</span>
            </div>

            <div className="flex justify-between items-center">
                <span>شماره کارت مقصد</span>
              <div className="flex gap-2 items-center">
              <span>{transactionData.toCard}</span>
                <span className="icon-wrapper w-7 h-7 ">
                  {transactionData.bankIcon}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>نام صاحب کارت مقصد</span>
              <span>{transactionData.owner}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>مبلغ نهایی با کسر کارمزد</span>
              <span>{transactionData.finalAmount} تومان</span>
            </div>
</div>
            <ul className="list-disc lg:text-lg text-xs space-y-1 pr-4">
              <li>
                حتماً باید کارت مقصدی که انتخاب کرده‌اید و مبلغی که درج کرده‌اید
                تراکنش انجام شود.
              </li>
              <li>
                پس از انجام کارت به کارت به صورت خودکار کیف پول تومانی شما شارژ
                می‌شود.
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
