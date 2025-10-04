import React, { useState } from "react";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import { Controller, useForm } from "react-hook-form";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";
import BankMellatLogo from "../../assets/icons/BankCards/IconBankMellatLogo";
import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
import { yupResolver } from "@hookform/resolvers/yup";
import Accordion from "../Withdrawal/Accordion";
import { toast } from "react-toastify";
import IconCopy from "../../assets/Icons/AddFriend/IconCopy";

export default function DepositwithIdentifier() {
  const { control, watch } = useForm({
    resolver: yupResolver(),
  });

  const [showReceipt, setShowReceipt] = useState(false);

  // دریافت مقدار انتخاب‌شده از بانک
  const selectedBank = watch("bank");

  return (
    <div className="w-full lg:px-7 " dir="rtl">
      <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
        <span className="icon-wrapper w-6 h-6 text-blue2">
          <IconVideo />
        </span>
        <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
      </div>

      {/* =================== */}
      <div className="mb-12">
        <Controller
          name="bank"
          control={control}
          render={({ field }) => (
            <FloatingSelect
              placeholder="حساب بانکی را انتخاب کنید "
              label="حساب بانکی "
              value={field.value}
              onChange={field.onChange}
              options={[
                {
                  value: "meli",
                  label: "بانک ملی ایران",
                  icon: (
                    <span className="w-6 h-6 icon-wrapper">
                      <BankMelliLogo />
                    </span>
                  ),
                },
                {
                  value: "mellat",
                  label: "بانک ملت ایران",
                  icon: (
                    <span className="w-6 h-6 icon-wrapper">
                      <BankMellatLogo />
                    </span>
                  ),
                },
                {
                  value: "noor",
                  label: "بانک انصار",
                  icon: (
                    <span className="w-6 h-6 icon-wrapper">
                      <BankAnsarLogo />
                    </span>
                  ),
                },
                {
                  value: "melal",
                  label: "مؤسسه اعتباری ملل",
                  icon: (
                    <span className="w-6 h-6 icon-wrapper">
                      <BankAnsarLogo />
                    </span>
                  ),
                },
              ]}
            />
          )}
        />
      </div>

      {/* =================== */}
      {showReceipt && (
        <>
          <p className=" text-sm text-gray5 mt-6 mb-2">مشخصات حساب گیرنده</p>
          <div className=" p-4 border rounded-lg border-gray19  flex w-full justify-between">
            {/* right */}
            <div className="flex flex-col gap-5 text-gray5 text-sm">
              <span>بانک</span>
              <span>نام صاحب حساب</span>
              <span>شبا</span>
              <span>شماره حساب</span>
              <span>شناسه واریز</span>
            </div>
            {/* left */}
            <div className="flex flex-col gap-5 items-end text-sm text-black0">
              <div className="flex gap-1 items-center">
                <span>بانک ملی</span>
                <span className="icon-wrapper w-5 h-5">
                  <BankMellatLogo />
                </span>
              </div>
              <span>گروه فرهنگی و هنری </span>
              <div className="flex gap-1 items-center">
                <span>152898338738846474981</span>
                <span className="icon-wrapper w-5 h-5 text-gray5">
                  <IconCopy />
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <span>833873884647</span>
                <span className="icon-wrapper w-5 h-5 text-gray5">
                  <IconCopy />
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <span>8384647</span>
                <span className="icon-wrapper w-5 h-5 text-gray5">
                  <IconCopy />
                </span>
              </div>
            </div>
          </div>
        </>
      )}
      <div className={`${showReceipt ? "mt-6" : "mt-80"}`}>
        <button
          onClick={() => {
            if (selectedBank) {
              setShowReceipt(true);
            } else {
              {
                toast.error("لطفا ابتدا کارت بانکی خود را انتخاب کنید ");
              }
            }
          }}
          className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg"
        >
          ساخت شناسه واریز
        </button>

        {/* نمایش بخش وسط فقط بعد از انتخاب بانک و کلیک روی دکمه */}

        <div className="mt-4" dir="ltr">
          <Accordion title="راهنمای واریز با شناسه">
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
    </div>
  );
}
