// import { Controller, useForm } from "react-hook-form";
// import BankAnsarLogo from "../../assets/Icons/BankCards/IconBankAnsarLogo";
// import BankMellatLogo from "../../assets/Icons/BankCards/IconBankMellatLogo";
// import BankMelliLogo from "../../assets/Icons/BankCards/IconBankMelliLogo";
// import Accordion from "../Withdrawal/Accordion";
// import FloatingSelect from "../FloatingInput/FloatingSelect";
// import FloatingInput from "../FloatingInput/FloatingInput";
// import IconVideo from "../../assets/Icons/Deposit/IconVideo";
// import { yupResolver } from "@hookform/resolvers/yup";

// export default function DepositForm() {
//   const amounts = [5, 10, 20, 50];

//   const { control } = useForm({
//     resolver: yupResolver(),
//   });

//   return (
//     <>
//       <div className="w-full lg:px-7 " dir="rtl">
//         <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
//           <span className="icon-wrapper w-6 h-6 text-blue2">
//             <IconVideo />
//           </span>
//           <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
//         </div>

//         <div dir="rtl" className="mb-1.5">
//           <Controller
//             name="amount"
//             control={control}
//             rules={{ required: "لطفا مقدار برداشت را وارد کنید" }}
//             render={({ field }) => (
//               <>
//                 <FloatingInput
//                   label="مقدار واریزی"
//                   value={field.value}
//                   onChange={field.onChange}
//                   type="number"
//                   placeholder="0 تومان "
//                   placeholderColor="text-black0"
//                 />
//               </>
//             )}
//           />
//         </div>

//         <p className="text-gray12 text-sm mb-5">
//           میزان واریزی حداقل 25 هزار تومان و حداکثر تا سقف 25 میلیون تومان{" "}
//         </p>
//         <div className="flex gap-2 items-center mb-12 flex-wrap justify-center">
//           {amounts.map((amount, index) => (
//             <button
//               key={index}
//               className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm"
//             >
//               {amount} میلیون
//             </button>
//           ))}
//         </div>

      


//         <div className="mt-16">
//           <button className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg">
//             واریز
//           </button>

//           <div className="mt-4" dir="ltr">
//             <Accordion title="راهنمای واریز با درگاه پرداخت ">
//               <ul className="list-disc pr-5 space-y-2 text-black1">
//                 <li>
//                   از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی
//                   شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)
//                 </li>
//                 <li>
//                   مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.
//                 </li>
//               </ul>
//             </Accordion>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }





// import React, { useEffect } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "react-toastify";

// // ⚠️ مسیر ایمپورت apiRequest را با توجه به پروژه خود اصلاح کنید
// // فرض می‌کنیم apiClient شما از این مسیر قابل دسترسی است
// import { apiRequest } from "../../utils/apiClient"; 

// // کامپوننت‌های UI (بدون تغییر در استایل)
// import Accordion from "../Withdrawal/Accordion";
// import FloatingInput from "../FloatingInput/FloatingInput";
// import IconVideo from "../../assets/Icons/Deposit/IconVideo";


// interface PaymentGatewayRequestData {
//     amount: number; // مقدار واریزی (ریال)
//     card: string;   // فیلدی که ممکن است بک‌اند انتظارش را بکشد (حتی اگر خالی باشد)
// }

// interface PaymentGatewayResponse {
//     status: boolean;
//     msg: string;
//     link: string; // لینک هدایت به درگاه پرداخت
//     id: number;
// }

// // Schema اعتبارسنجی: فقط فیلد amount (مقدار) را بررسی می‌کند
// const validationSchema = yup.object().shape({
//     amount: yup
//         .number()
//         .typeError("مبلغ باید عدد باشد")
//         .required("وارد کردن مبلغ الزامی است")
//         // حداقل و حداکثر به تومان
//         .min(25000, "حداقل مبلغ واریز ۲۵,۰۰۰ تومان است") 
//         .max(25000000, "حداکثر مبلغ واریز ۲۵ میلیون تومان است"),
//     // فیلد bank را برای سازگاری اجباری نمی‌کنیم، اما در صورت نیاز به بک‌اند ارسال می‌شود.
//     bank: yup.string().nullable(), 
// });

// // --- ۲. کامپوننت اصلی ---

// export default function DepositForm() {
    
//     // مقادیر پیشنهادی به تومان 
//     const amounts = [5000000, 10000000, 20000000, 25000000]; 
    
//     const urlId = new URLSearchParams(window.location.search).get("id");

//     const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
//         resolver: yupResolver(validationSchema),
//         defaultValues: {
//             amount: "", 
//             bank: "", // مقدار پیش‌فرض خالی برای فیلد مخفی
//         }
//     });

//     const amountValue = watch("amount");
    
//     const setPresetAmount = (amount: number) => {
//         setValue("amount", amount, { shouldValidate: true });
//     };

//     // --- ۳. منطق بررسی نهایی تراکنش (Callback) ---
//     useEffect(() => {
//         if (!urlId) return;

//         const cleanUrl = () => {
//             const newUrl = window.location.origin + window.location.pathname;
//             window.history.replaceState({}, "", newUrl);
//         };
        
//         apiRequest<any>({
//             url: `/api/wallets/fiat/deposit/gateway/${urlId}`,
//             method: 'GET',
//         })
//         .then(res => {
//             if (res.status === 200 || res.status) {
//                  toast.success(res.msg || "تراکنش با موفقیت انجام شد. ✅");
//             } else {
//                  toast.error(res.msg || "تراکنش ناموفق بود. ❌");
//             }
//             cleanUrl();
//         })
//         .catch((error) => {
//             const errorMessage = error.response?.data?.msg || "خطا در بررسی وضعیت تراکنش.";
//             toast.error(errorMessage);
//             cleanUrl();
//         });
        
//     }, [urlId]);


//     // --- ۴. هندلر ارسال فرم و هدایت به درگاه ---
//     const onSubmit = async (data: any) => {
        
//         // 🔑 مهم‌ترین بخش: تبدیل تومان به ریال (احتمالاً سرور شما ریال می‌خواهد)
//         // اگر سرور شما تومان می‌خواهد، خط زیر را حذف کنید و از Number(data.amount) استفاده کنید.
//         const amountInRials = Number(data.amount); 
        
//         try {
//             const requestData: PaymentGatewayRequestData = {
//                 amount: amountInRials, 
//                 card: data.bank, // فیلد مخفی bank که ممکن است بک‌اند انتظارش را بکشد
//             };

//             const response = await apiRequest<PaymentGatewayResponse, PaymentGatewayRequestData>({
//                 url: "/api/wallets/fiat/deposit/gateway", 
//                 method: "POST",
//                 data: requestData,
//             });

//             if (response.status && response.url) {
//                 toast.info("در حال هدایت به درگاه پرداخت... 🚀");
//                 window.location.href = response.url; 
//             } else {
//                 toast.error(response.msg || "خطا: لینک درگاه پرداخت از سرور دریافت نشد. 🚫");
//             }

//         } catch (error: any) {
//              // نمایش پیام خطای ۴۰۰ که از بک‌اند برمی‌گردد
//             const serverMsg = error.response?.data?.msg || "خطا در اتصال به سرور. دوباره امتحان کنید. ⚠️";
//             toast.error(serverMsg);
//             console.error("خطای کامل درگاه:", error);
//         }
//     };
    
//     // --- ۵. رندر UI ---

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:px-7" dir="rtl">
            
//             <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
//                 <span className="icon-wrapper w-6 h-6 text-blue2"><IconVideo /></span>
//                 <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
//             </div>

//             <div dir="rtl" className="mb-1.5">
//                 <Controller
//                     name="amount"
//                     control={control}
//                     render={({ field }) => (
//                         <>
//                             <FloatingInput
//                                 label="مقدار واریزی (تومان)"
//                                 value={field.value}
//                                 onChange={field.onChange}
//                                 type="number"
//                                 placeholder="0 تومان "
//                                 placeholderColor="text-black0"
//                             />
//                             {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
//                         </>
//                     )}
//                 />
//             </div>
            
//             {/* 💡 فیلد کنترلر bank به صورت مخفی برای سازگاری با بک‌اند */}
//             <Controller name="bank" control={control} render={({ field }) => <input type="hidden" {...field} />} />


//             <p className="text-gray12 text-sm mb-5">
//                 میزان واریزی حداقل ۲۵ هزار تومان و حداکثر تا سقف ۲۵ میلیون تومان{" "}
//             </p>
            
//             {/* دکمه‌های مبلغ پیشنهادی */}
//             <div className="flex gap-2 items-center mb-12 flex-wrap justify-center">
//                 {amounts.map((amount, index) => (
//                     <button
//                         type="button" 
//                         key={index}
//                         onClick={() => setPresetAmount(amount)}
//                         className={`border rounded-lg px-7 py-2 text-sm transition ${
//                             Number(amountValue) === amount ? 'border-blue2 text-blue2' : 'border-gray12 text-gray12 hover:border-blue2 hover:text-blue2'
//                         }`}
//                     >
//                         {amount / 1000000} میلیون
//                     </button>
//                 ))}
//             </div>

//             <div className="mt-16">
//                 <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg ${
//                         isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
//                     }`}
//                 >
//                     {isSubmitting ? 'در حال اتصال...' : 'واریز'}
//                 </button>

//                 <div className="mt-4" dir="ltr">
//                     <Accordion title="راهنمای واریز با درگاه پرداخت ">
//                         <ul className="list-disc pr-5 space-y-2 text-black1">
//                             <li>از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)</li>
//                             <li>مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.</li>
//                         </ul>
//                     </Accordion>
//                 </div>
//             </div>
//         </form>
//     );
// }















// import React, { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "react-toastify"; // فرض می‌کنیم toastify نصب و تنظیم شده است

// // آیکون‌ها و کامپوننت‌های فرضی
// import BankMelliLogo from "../../assets/Icons/BankCards/IconBankMelliLogo";
// import BankMellatLogo from "../../assets/Icons/BankCards/IconBankMellatLogo";
// import BankAnsarLogo from "../../assets/Icons/BankCards/IconBankAnsarLogo";
// import Accordion from "../Withdrawal/Accordion";
// import FloatingSelect from "../FloatingInput/FloatingSelect";
// import FloatingInput from "../FloatingInput/FloatingInput";
// import IconVideo from "../../assets/Icons/Deposit/IconVideo";

// // تابع apiRequest که از ماژول همکارتان آمده است
// import { apiRequest } from "../../utils/apiClient"; // ✨ لطفا مسیر دقیق این فایل را اصلاح کنید

// // --- ۱. تعریف تایپ‌ها و Schema ---

// // نوع داده ارسالی به API
// interface PaymentGatewayRequestData {
//     amount: number; // مقدار واریزی (ریال)
//     card: string;   // شناسه یا شماره کارت مبدأ
// }

// // نوع پاسخ مورد انتظار از API
// interface PaymentGatewayResponse {
//     status: boolean;
//     msg: string;
//     url: string; // لینک هدایت به درگاه پرداخت (مثل زیبال)
//     id: number;
// }

// // Schema اعتبارسنجی با Yup
// const validationSchema = yup.object().shape({
//     amount: yup
//         .number()
//         .typeError("مبلغ باید عدد باشد")
//         .required("وارد کردن مبلغ الزامی است")
//         .min(25000, "حداقل مبلغ واریز ۲۵,۰۰۰ تومان است")
//         .max(25000000, "حداکثر مبلغ واریز ۲۵ میلیون تومان است"),
//     bank: yup.string().required("انتخاب کارت مبدأ الزامی است"),
// });

// // --- ۲. تابع فراخوانی API ---

// async function startPaymentGateway(data: PaymentGatewayRequestData): Promise<PaymentGatewayResponse> {
//     // مسیر API شما: /wallets/fiat/deposit/gateway
//     return apiRequest<PaymentGatewayResponse, PaymentGatewayRequestData>({
//         // ⚠️ توجه: مقدار amount در اینجا باید به **ریال** باشد
//         url: "/api/wallets/fiat/deposit/gateway", 
//         method: "POST",
//         data: data,
//     });
// }

// // --- ۳. کامپوننت اصلی ---

// export default function DepositForm() {
    
//     // مقادیر ثابت و فرضی
//     const amounts = [5000000, 10000000, 20000000, 50000000]; // مبلغ‌های پیشنهادی به تومان
//     const commission = 50000; // کارمزد ثابت (بر اساس UI شما)

//     const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
//         resolver: yupResolver(validationSchema),
//         defaultValues: {
//             amount: "", 
//             bank: "",
//         }
//     });

//     const amountValue = watch("amount");
    
//     // محاسبه مبلغ نهایی واریز به کیف پول
//     const finalAmount = amountValue ? Number(amountValue) - commission : 0;
//     const finalAmountDisplay = new Intl.NumberFormat('fa-IR').format(finalAmount);

//     // تابع برای ست کردن مبلغ با دکمه‌های پیشنهادی
//     const setPresetAmount = (amount: number) => {
//         setValue("amount", amount, { shouldValidate: true });
//     };

//     // --- ۴. هندلر ارسال فرم و هدایت ---

//     const onSubmit = async (data: any) => {
        
//         // 🚨 نکته حل خطای 400: مقدار در اینجا به ریال تبدیل می‌شود.
//         // اگر سرور شما تومان می‌خواهد، خط زیر را به: const amountInRials = Number(data.amount); تغییر دهید.
//         const amountInRials = Number(data.amount) * 10; 
        
//         try {
//             const requestData: PaymentGatewayRequestData = {
//                 amount: amountInRials,
//                 card: data.bank, // شناسه یا شماره کارت مبدأ
//             };

//             const response = await startPaymentGateway(requestData);

//             if (response.status && response.url) {
//                 toast.success("در حال هدایت به درگاه پرداخت... 🚀");
//                 // 🚀 هدایت کاربر به لینک درگاه پرداخت زیبال
//                 window.location.href = response.url; 
//             } else {
//                 // اگر status: true است ولی url نیست یا status: false است
//                 toast.error(response.msg || "خطا: لینک درگاه پرداخت از سرور دریافت نشد. 🚫");
//             }

//         } catch (error: any) {
//             // خطاهای Axios (شبکه، 400، 500 و ...)
//             const serverMsg = error.response?.data?.msg || "خطا در اتصال به درگاه پرداخت. ⚠️";
//             const statusCode = error.response?.status;
            
//             if (statusCode === 400) {
//                 toast.error(`خطای ۴۰۰ (داده نامعتبر): ${serverMsg}. لطفا مقادیر را بررسی کنید.`);
//             } else {
//                 toast.error(serverMsg);
//             }
//             console.error("خطای کامل:", error);
//         }
//     };
    
//     // --- ۵. رندر UI ---

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:px-7" dir="rtl">
//             <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
//                 <span className="icon-wrapper w-6 h-6 text-blue2"><IconVideo /></span>
//                 <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
//             </div>

//             <div dir="rtl" className="mb-1.5">
//                 <Controller
//                     name="amount"
//                     control={control}
//                     render={({ field }) => (
//                         <>
//                             <FloatingInput
//                                 label="مقدار واریزی (تومان)"
//                                 value={field.value}
//                                 onChange={field.onChange}
//                                 type="number"
//                                 placeholder="0 تومان"
//                                 placeholderColor="text-black0"
//                             />
//                             {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
//                         </>
//                     )}
//                 />
//             </div>
            
//             <p className="text-gray12 text-sm mb-5">
//                 میزان واریزی حداقل ۲۵ هزار تومان و حداکثر تا سقف ۲۵ میلیون تومان{" "}
//             </p>
            
//             {/* دکمه‌های مبلغ پیشنهادی */}
//             <div className="flex gap-2 items-center mb-12 flex-wrap justify-center">
//                 {amounts.map((amount, index) => (
//                     <button
//                         type="button"
//                         key={index}
//                         onClick={() => setPresetAmount(amount)}
//                         className={`border rounded-lg px-7 py-2 text-sm transition ${
//                             Number(amountValue) === amount ? 'border-blue2 text-blue2' : 'border-gray12 text-gray12 hover:border-blue2 hover:text-blue2'
//                         }`}
//                     >
//                         {new Intl.NumberFormat('fa-IR').format(amount / 1000000)} میلیون
//                     </button>
//                 ))}
//             </div>

//             {/* انتخاب بانک (کارت مبدأ) */}
//             <div className="mb-3">
//                 <Controller
//                     name="bank"
//                     control={control}
//                     render={({ field }) => (
//                         <>
//                             <FloatingSelect
//                                 placeholder="بانک خود را انتخاب کنید"
//                                 placeholderColor="text-sm text-gray12"
//                                 label="انتخاب کارت مبدأ (کارت‌های ثبت شده)"
//                                 value={field.value}
//                                 onChange={field.onChange}
//                                 options={[
//                                     // ⚠️ در محیط واقعی، این مقادیر باید از API خوانده شوند
//                                     { value: "1234...", label: "9303-9940-...-9504 بانک ملی ایران", icon: (<span className="w-6 h-6 icon-wrapper"><BankMelliLogo /></span>) },
//                                     { value: "5678...", label: "9303-9940-...-9504 بانک ملت ایران", icon: (<span className="w-6 h-6 icon-wrapper"><BankMellatLogo /></span>) },
//                                     { value: "9012...", label: "9303-9940-...-9504 بانک نور", icon: (<span className="w-6 h-6 icon-wrapper"><BankAnsarLogo /></span>) },
//                                 ]}
//                             />
//                             {errors.bank && <p className="text-red-500 text-sm mt-1">{errors.bank.message}</p>}
//                         </>
//                     )}
//                 />
//             </div>

//             {/* جزئیات کارمزد */}
//             <div className="flex items-center flex-col mt-3 mb-16 text-sm">
//                 <div className="flex w-full justify-between items-center py-1">
//                     <span className="text-gray5">کارمزد</span>
//                     <span className="text-black0">{new Intl.NumberFormat('fa-IR').format(commission)} تومان</span>
//                 </div>
//                 <div className="flex w-full justify-between items-center py-1 font-bold">
//                     <span className="text-gray5">مبلغ نهایی واریز به کیف پول</span>
//                     <span className="text-black0">{finalAmountDisplay} تومان</span>
//                 </div>
//             </div>

//             {/* دکمه واریز */}
//             <button 
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`w-full py-3 font-bold text-lg rounded-lg transition ${
//                     isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'text-white2 bg-blue2 hover:bg-blue-600'
//                 }`}
//             >
//                 {isSubmitting ? 'در حال اتصال به درگاه...' : 'واریز'}
//             </button>

//             {/* راهنمای واریز با درگاه پرداخت */}
//             <div className="mt-4" dir="ltr">
//                 <Accordion title="راهنمای واریز با درگاه پرداخت ">
//                     <ul className="list-disc pr-5 space-y-2 text-black1">
//                         <li>از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)</li>
//                         <li>مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.</li>
//                     </ul>
//                 </Accordion>
//             </div>
//         </form>
//     );
// }




















// import React, { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "react-toastify";

// // فرض می‌کنیم apiClient شما در این مسیر قرار دارد
// import { apiRequest } from "../../utils/apiClient"; 
// import FloatingSelect from "../FloatingInput/FloatingSelect";
// import FloatingInput from "../FloatingInput/FloatingInput";
// import IconVideo from "../../assets/Icons/Deposit/IconVideo";
// import Accordion from "../Withdrawal/Accordion";
// import IconCopy from "../../assets/Icons/AddFriend/IconCopy";

// // آیکون‌ها (فرضی)
// import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";
// import BankMellatLogo from "../../assets/icons/BankCards/IconBankMellatLogo";
// import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";


// interface DepositIdentifierRequestData {
//     id: number; // ID بانک مقصد که در API مورد نیاز است 
// }

// interface DepositIdentifierResponse {
//     bank: string; // نام بانک مقصد
//     ownerName: string; // نام صاحب حساب
//     shaba: string; // شماره شبا
//     accountNumber: string; // شماره حساب
//     identifier: string; // شناسه واریز
// }

// async function createDepositIdentifier(data: DepositIdentifierRequestData): Promise<DepositIdentifierResponse> {
//     // مسیر API ایجاد شناسه: /wallets/fiat/deposit/gateway-id
//     // توجه: در پاسخ موفقیت‌آمیز، مشخصات کامل حساب مقصد فرستاده شود.
//     // ما از داده‌های Mock (نمونه‌ای شبیه به تصویر شما) برای پر کردن UI استفاده می‌کنیم:
//     const mockResponse: DepositIdentifierResponse = {
//         bank: "بانک ملی",
//         ownerName: "گروه فرهنگی و هنری",
//         shaba: "152898338738846474981", 
//         accountNumber: "833873884647",
//         identifier: "8384647", 
//     };

//     const apiResult = await apiRequest<any, DepositIdentifierRequestData>({
//         url: "/api/wallets/fiat/deposit/gateway{id}", 
//         method: "POST",
//         data: data,
//     });
//     // در محیط واقعی، شما باید `apiResult.Data` را به نوع DepositIdentifierResponse نگاشت کنید.
//     return mockResponse; // موقتاً mock را برمی‌گردانیم
// }

// // --- ۱.۲. API واریز با درگاه (/wallets/fiat/deposit/gateway) ---
// interface PaymentGatewayRequestData {
//     amount: number; 
//     card: string; // شناسه یا شماره کارت مبدأ
// }

// interface PaymentGatewayResponse {
//     status: boolean;
//     msg: string;
//     link: string; // لینک هدایت به درگاه پرداخت
//     id: number; // شناسه تراکنش که بعداً برای تأیید استفاده می‌شود
// }

// async function startPaymentGateway(data: PaymentGatewayRequestData): Promise<PaymentGatewayResponse> {
//     // مسیر API درگاه: /wallets/fiat/deposit/gateway
//     return apiRequest<PaymentGatewayResponse, PaymentGatewayRequestData>({
//         url: "/api/wallets/fiat/deposit/gateway", 
//         method: "POST",
//         data: data,
//     });
// }

// // --- ۱.۳. Utility Functions و داده‌های ثابت ---
// // تعریف Schema اعتبارسنجی با Yup
// const validationSchema = yup.object().shape({
//     amount: yup
//         .number()
//         .typeError("مبلغ باید عدد باشد")
//         .required("وارد کردن مبلغ الزامی است")
//         .min(25000, "حداقل مبلغ واریز ۲۵,۰۰۰ تومان است")
//         .max(25000000, "حداکثر مبلغ واریز ۲۵ میلیون تومان است"),
//     bank: yup.string().required("انتخاب بانک (کارت مبدأ) الزامی است"),
// });

// // تابع کمکی کپی
// const copyToClipboard = (text: string | number, label: string) => {
//     const textToCopy = String(text);
//     navigator.clipboard.writeText(textToCopy)
//         .then(() => toast.info(`${label} کپی شد. ✅`))
//         .catch(() => toast.error(`خطا در کپی کردن ${label}. ❌`));
// };

// // =======================================================================
// //                        ۲. کامپوننت اصلی (DepositContainer)
// // =======================================================================

// type DepositMethod = 'GATEWAY' | 'IDENTIFIER';

// export default function DepositForm() {
//     // وضعیت حالت واریز
//     const [method, setMethod] = useState<DepositMethod>('GATEWAY'); // پیش‌فرض درگاه پرداخت

//     // وضعیت بارگذاری و داده‌های پاسخ API شناسه واریز
//     const [isLoading, setIsLoading] = useState(false);
//     const [identifierData, setIdentifierData] = useState<DepositIdentifierResponse | null>(null); 

//     // تعریف مقادیر پیش‌فرض فرم
//     const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
//         resolver: yupResolver(validationSchema),
//         defaultValues: {
//             amount: "", 
//             bank: "",
//         }
//     });

//     const amountValue = watch("amount");
//     const bankValue = watch("bank"); 
    
//     // مقادیر ثابت و فرضی (بر اساس UI شما)
//     const amounts = [5000000, 10000000, 20000000, 50000000]; // مبلغ‌های پیشنهادی به تومان
//     const commission = 50000; 
//     const finalAmount = amountValue ? Number(amountValue) - commission : 0;
//     const finalAmountDisplay = new Intl.NumberFormat('fa-IR').format(finalAmount);

//     // تابع برای ست کردن مبلغ با دکمه‌های پیشنهادی
//     const setPresetAmount = (amount: number) => {
//         setValue("amount", amount, { shouldValidate: true });
//     };

//     // --- ۲.۱. منطق واریز با درگاه پرداخت ---
//     const handleGatewaySubmit = async (data: any) => {
//         if (isLoading) return;
//         setIsLoading(true);

//         try {
//             const requestData: PaymentGatewayRequestData = {
//                 amount: Number(data.amount),
//                 card: data.bank, // شناسه یا شماره کارت مبدأ
//             };

//             const response = await startPaymentGateway(requestData);

//             if (response.status && response.link) {
//                 toast.success("در حال هدایت به درگاه پرداخت... 🚀");
//                 window.location.href = response.link; 
//             } else {
//                 toast.error(response.msg || "خطا: لینک درگاه پرداخت از سرور دریافت نشد. 🚫");
//             }

//         } catch (error: any) {
//             const errorMessage = error.response?.data?.msg || "خطا در اتصال به درگاه پرداخت. ⚠️";
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
//     // --- ۲.۲. منطق واریز با شناسه ---
//     const handleIdentifierSubmit = async (data: any) => {
//         if (isLoading) return;
//         setIsLoading(true);
//         setIdentifierData(null); 

//         // فرض می‌کنیم bankValue (مثلاً 'meli') با ID بانک مقصد نگاشت می‌شود
//         const bankIdMap: Record<string, number> = { meli: 12, mellat: 14, noor: 16, melal: 18 };
//         const bankId = bankIdMap[data.bank];

//         if (!bankId) {
//              toast.error("بانک انتخاب شده صحیح نیست.");
//              setIsLoading(false);
//              return;
//         }

//         try {
//             const response = await createDepositIdentifier({ id: bankId });

//             // توجه: در کد واقعی باید response را نگهداری کنید
//             setIdentifierData(response); 
//             toast.success("مشخصات حساب مقصد و شناسه واریز با موفقیت دریافت شد. 🎉");

//         } catch (error: any) {
//             // نمایش خطای احراز هویت
//             const errorMessage = error.response?.data?.msg || "خطا در ایجاد شناسه واریز. لطفاً سطح احراز هویت را بررسی کنید. ❌";
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // --- ۲.۳. رندر UI ---
//     return (
//         <div className="w-full lg:px-7" dir="rtl">
//             {/* انتخاب متد واریز (سوئیچ بین دو کامپوننت) */}
//             <div className="mb-4 flex gap-2 justify-center">
//                 <button 
//                     onClick={() => { setMethod('GATEWAY'); setIdentifierData(null); }}
//                     className={`px-4 py-2 rounded-full font-bold ${method === 'GATEWAY' ? 'bg-blue2 text-white' : 'bg-gray-100 text-gray-700'}`}
//                 >
//                     واریز با درگاه پرداخت
//                 </button>
//                 <button 
//                     onClick={() => { setMethod('IDENTIFIER'); setIdentifierData(null); }}
//                     className={`px-4 py-2 rounded-full font-bold ${method === 'IDENTIFIER' ? 'bg-blue2 text-white' : 'bg-gray-100 text-gray-700'}`}
//                 >
//                     واریز با شناسه
//                 </button>
//             </div>
            
//             <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
//                 <span className="icon-wrapper w-6 h-6 text-blue2"><IconVideo /></span>
//                 <span>ویدیو آموزشی واریز با {method === 'GATEWAY' ? 'درگاه پرداخت' : 'شناسه واریز'}</span>
//             </div>

//             {/* بخش واریز با شناسه و نمایش رسید */}
//             {method === 'IDENTIFIER' ? (
//                 // =============== UI واریز با شناسه (فقط انتخاب بانک) ===============
//                 <form onSubmit={handleSubmit(handleIdentifierSubmit)}>
//                     <div className="mb-12">
//                         <Controller
//                             name="bank"
//                             control={control}
//                             rules={{ required: "انتخاب بانک الزامی است" }}
//                             render={({ field }) => (
//                                 <FloatingSelect
//                                     placeholder="بانک خود را انتخاب کنید (مقصد)"
//                                     label="حساب بانکی مقصد"
//                                     value={field.value}
//                                     onChange={field.onChange}
//                                     options={[
//                                         { value: "meli", label: "بانک ملی ایران", icon: (<span className="w-6 h-6 icon-wrapper"><BankMelliLogo /></span>) },
//                                         { value: "mellat", label: "بانک ملت ایران", icon: (<span className="w-6 h-6 icon-wrapper"><BankMellatLogo /></span>) },
//                                         { value: "noor", label: "بانک نور", icon: (<span className="w-6 h-6 icon-wrapper"><BankAnsarLogo /></span>) },
//                                         { value: "melal", label: "مؤسسه اعتباری ملل", icon: (<span className="w-6 h-6 icon-wrapper"><BankAnsarLogo /></span>) },
//                                     ]}
//                                 />
//                             )}
//                         />
//                         {errors.bank && <p className="text-red-500 text-sm mt-1">{errors.bank.message}</p>}
//                     </div>

//                     {identifierData && (
//                          <div className="mb-8">
//                              <p className=" text-sm text-gray5 mb-2">مشخصات حساب گیرنده</p>
//                              {/* نمایش اطلاعات حساب گیرنده و شناسه واریز */}
//                              <div className=" p-4 border rounded-lg border-gray19 flex w-full justify-between">
//                                  <div className="flex flex-col gap-5 text-gray5 text-sm">
//                                      <span>بانک</span>
//                                      <span>نام صاحب حساب</span>
//                                      <span>شبا</span>
//                                      <span>شماره حساب</span>
//                                      <span>شناسه واریز</span>
//                                  </div>
//                                  <div className="flex flex-col gap-5 items-end text-sm text-black0">
//                                      <span>{identifierData.bank}</span> 
//                                      <span>{identifierData.ownerName}</span> 
//                                      <div className="flex gap-1 items-center"><span>{identifierData.shaba}</span> <button type="button" className="icon-wrapper w-5 h-5 text-gray5" onClick={() => copyToClipboard(identifierData.shaba, "شبا")}><IconCopy /></button></div>
//                                      <div className="flex gap-1 items-center"><span>{identifierData.accountNumber}</span> <button type="button" className="icon-wrapper w-5 h-5 text-gray5" onClick={() => copyToClipboard(identifierData.accountNumber, "شماره حساب")}><IconCopy /></button></div>
//                                      <div className="flex gap-1 items-center"><span>{identifierData.identifier}</span> <button type="button" className="icon-wrapper w-5 h-5 text-gray5" onClick={() => copyToClipboard(identifierData.identifier, "شناسه واریز")}><IconCopy /></button></div>
//                                  </div>
//                              </div>
//                          </div>
//                     )}
//                      <button
//                         type="submit"
//                         disabled={isLoading}
//                         className={`w-full py-3 font-bold text-lg rounded-lg transition ${
//                             isLoading ? 'bg-blue-300 cursor-not-allowed' : 'text-white2 bg-blue2 hover:bg-blue-600'
//                         }`}
//                     >
//                         {isLoading ? 'در حال ایجاد شناسه...' : 'ساخت شناسه واریز'}
//                     </button>
//                      <div className="mt-4" dir="ltr">
//                          <Accordion title="راهنمای واریز با شناسه">
//                              <ul className="list-disc pr-5 space-y-2 text-black1">
//                                  <li>فقط کاربران با سطح احراز هویت ۱ و بالاتر مجاز به انجام این عملیات هستند.</li>
//                                  <li>در صورت نیاز به ارتقاء، لطفاً سطح احراز هویت خود را بررسی کنید.</li>
//                              </ul>
//                          </Accordion>
//                      </div>
//                 </form>

//             ) : (
//                 // =============== UI واریز با درگاه پرداخت (شامل مبلغ و کارت مبدأ) ===============
//                 <form onSubmit={handleSubmit(handleGatewaySubmit)}>
//                     <div dir="rtl" className="mb-1.5">
//                         <Controller
//                             name="amount"
//                             control={control}
//                             render={({ field }) => (
//                                 <>
//                                     <FloatingInput
//                                         label="مقدار واریزی"
//                                         value={field.value}
//                                         onChange={field.onChange}
//                                         type="number"
//                                         placeholder="0 تومان"
//                                         placeholderColor="text-black0"
//                                     />
//                                     {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
//                                 </>
//                             )}
//                         />
//                     </div>
//                     <p className="text-gray12 text-sm mb-5">
//                         میزان واریزی حداقل ۲۵ هزار تومان و حداکثر تا سقف ۲۵ میلیون تومان{" "}
//                     </p>
                    
//                     {/* دکمه‌های مبلغ پیشنهادی */}
//                     <div className="flex gap-2 items-center mb-12 flex-wrap justify-center">
//                         {amounts.map((amount, index) => (
//                             <button
//                                 type="button"
//                                 key={index}
//                                 onClick={() => setPresetAmount(amount)}
//                                 className={`border rounded-lg px-7 py-2 text-sm transition ${
//                                      Number(amountValue) === amount ? 'border-blue2 text-blue2' : 'border-gray12 text-gray12 hover:border-blue2 hover:text-blue2'
//                                 }`}
//                             >
//                                 {new Intl.NumberFormat('fa-IR').format(amount / 1000000)} میلیون
//                             </button>
//                         ))}
//                     </div>

//                     {/* انتخاب بانک (کارت مبدأ) */}
//                     <div className="mb-3">
//                         <Controller
//                             name="bank"
//                             control={control}
//                             render={({ field }) => (
//                                 <>
//                                     <FloatingSelect
//                                         placeholder="بانک خود را انتخاب کنید"
//                                         placeholderColor="text-sm text-gray12"
//                                         label="انتخاب بانک (کارت مبدأ)"
//                                         value={field.value}
//                                         onChange={field.onChange}
//                                         options={[
//                                             { value: "1234...", label: "9303-9940-...-9504 بانک ملی ایران", icon: (<span className="w-6 h-6 icon-wrapper"><BankMelliLogo /></span>) },
//                                             { value: "5678...", label: "9303-9940-...-9504 بانک ملت ایران", icon: (<span className="w-6 h-6 icon-wrapper"><BankMellatLogo /></span>) },
//                                             { value: "9012...", label: "9303-9940-...-9504 بانک نور", icon: (<span className="w-6 h-6 icon-wrapper"><BankAnsarLogo /></span>) },
//                                             { value: "3456...", label: "9303-9940-...-9504 مؤسسه اعتباری ملل", icon: (<span className="w-6 h-6 icon-wrapper"><BankAnsarLogo /></span>) },
//                                         ]}
//                                     />
//                                     {errors.bank && <p className="text-red-500 text-sm mt-1">{errors.bank.message}</p>}
//                                 </>
//                             )}
//                         />
//                     </div>

//                     {/* جزئیات کارمزد */}
//                     <div className="flex items-center flex-col mt-3 mb-16 text-sm">
//                         <div className="flex w-full justify-between items-center py-1">
//                             <span className="text-gray5">کارمزد</span>
//                             <span className="text-black0">{new Intl.NumberFormat('fa-IR').format(commission)} تومان</span>
//                         </div>
//                         <div className="flex w-full justify-between items-center py-1 font-bold">
//                             <span className="text-gray5">مبلغ نهایی واریز به کیف پول</span>
//                             <span className="text-black0">{finalAmountDisplay} تومان</span>
//                         </div>
//                     </div>

//                     {/* دکمه واریز */}
//                     <button 
//                         type="submit"
//                         disabled={isLoading}
//                         className={`w-full py-3 font-bold text-lg rounded-lg transition ${
//                             isLoading ? 'bg-blue-300 cursor-not-allowed' : 'text-white2 bg-blue2 hover:bg-blue-600'
//                         }`}
//                     >
//                         {isLoading ? 'در حال اتصال به درگاه...' : 'واریز'}
//                     </button>

//                     {/* راهنمای واریز با درگاه پرداخت */}
//                     <div className="mt-4" dir="ltr">
//                         <Accordion title="راهنمای واریز با درگاه پرداخت ">
//                             <ul className="list-disc pr-5 space-y-2 text-black1">
//                                 <li>از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)</li>
//                                 <li>مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.</li>
//                             </ul>
//                         </Accordion>
//                     </div>
//                 </form>
//             )}
//         </div>
//     );
// }





import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

// ⚠️ مسیر ایمپورت apiRequest را با توجه به پروژه خود اصلاح کنید
import { apiRequest } from "../../utils/apiClient"; 

// کامپوننت‌های UI (بدون تغییر)
import Accordion from "../Withdrawal/Accordion";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";


interface PaymentGatewayRequestData {
    amount: number; // مقدار واریزی (تومان/ریال بسته به توافق با بک‌اند)
    card: string;   // فیلدی که ممکن است بک‌اند انتظارش را بکشد
}

interface PaymentGatewayResponse {
    status: boolean;
    msg: string;
    link?: string; // لینک هدایت به درگاه پرداخت
    url?: string; // ممکن است بک‌اند شما از 'url' به جای 'link' استفاده کند (من هر دو را می‌نویسم)
    id: number;
}

// Schema اعتبارسنجی: مبلغ به تومان (بر اساس مقادیر UI)
const validationSchema = yup.object().shape({
    amount: yup
        .number()
        .typeError("مبلغ باید عدد باشد")
        .required("وارد کردن مبلغ الزامی است")
        // حداقل و حداکثر به تومان (۲۵ هزار تا ۲۵ میلیون تومان)
        .min(25000, "حداقل مبلغ واریز ۲۵,۰۰۰ تومان است") 
        .max(25000000, "حداکثر مبلغ واریز ۲۵ میلیون تومان است"),
    bank: yup.string().nullable(), 
});


export default function DepositForm() {
    
    // مقادیر پیشنهادی به تومان 
    const amounts = [5000000, 10000000, 20000000, 25000000]; 
    
    // ۱. گرفتن ID از URL پس از بازگشت از درگاه (Callback)
    const urlId = new URLSearchParams(window.location.search).get("id");

    const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            amount: "", 
            bank: "",
        }
    });

    const amountValue = watch("amount");
    
    const setPresetAmount = (amount: number) => {
        setValue("amount", amount, { shouldValidate: true });
    };

    // --- ۲. منطق بررسی نهایی تراکنش (Callback) با درخواست GET ---
    useEffect(() => {
        // اگر id در URL وجود نداشت، از اجرای این تابع جلوگیری کن
        if (!urlId) return;

        // تابعی برای حذف پارامترهای اضافی از URL پس از پردازش
        const cleanUrl = () => {
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, "", newUrl);
        };
        
        // **درخواست GET برای نهایی‌سازی تراکنش**
        apiRequest<any>({
            // URL شما که حاوی id برگشتی از درگاه است
            url: `/api/wallets/fiat/deposit/gateway/${urlId}`,
            method: 'GET',
        })
        .then(res => {
            // بررسی وضعیت تراکنش از بک‌اند
            if (res.status === 200 || res.status) {
                 toast.success(res.msg || "تراکنش با موفقیت انجام شد. ✅");
            } else {
                 toast.error(res.msg || "تراکنش ناموفق بود. ❌");
            }
            cleanUrl();
        })
        .catch((error) => {
            const errorMessage = error.response?.data?.msg || "خطا در بررسی وضعیت تراکنش.";
            toast.error(errorMessage);
            cleanUrl();
        });
        
    }, [urlId]); // این useEffect فقط زمانی اجرا می‌شود که urlId تغییر کند (در بارگذاری اولیه صفحه Callback)


    // --- ۳. هندلر ارسال فرم و هدایت به درگاه (API اول: درخواست POST) ---
    const onSubmit = async (data: any) => {
        
        // 🔑 مهم: ارسال مقدار واریزی دقیقاً همانطور که کاربر وارد کرده (بدون ضرب در ۱۰)
        // با فرض اینکه بک‌اند شما این مقدار را می‌پذیرد.
        const amountToSend = Number(data.amount); 
        
        try {
            const requestData: PaymentGatewayRequestData = {
                amount: amountToSend, 
                card: data.bank, 
            };

            const response = await apiRequest<PaymentGatewayResponse, PaymentGatewayRequestData>({
                url: "/api/wallets/fiat/deposit/gateway", // API برای دریافت لینک درگاه
                method: "POST",
                data: requestData,
            });

            // هدایت کاربر به لینک درگاه پرداخت
            const redirectLink = response.link || response.url;
            if (response.status && redirectLink) {
                toast.info("در حال هدایت به درگاه پرداخت... 🚀");
                window.location.href = redirectLink; 
            } else {
                toast.error(response.msg || "خطا: لینک درگاه پرداخت از سرور دریافت نشد. 🚫");
            }

        } catch (error: any) {
             // نمایش پیام خطای ۴۰۰ که از بک‌اند برمی‌گردد
            const serverMsg = error.response?.data?.msg || "خطا در اتصال به سرور. دوباره امتحان کنید. ⚠️";
            toast.error(serverMsg);
            console.error("خطای کامل درگاه:", error);
        }
    };
    
    // --- ۴. رندر UI ---
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:px-7" dir="rtl">
            
            {/* ... (بخش‌های UI بدون تغییر) ... */}
            
            <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
                <span className="icon-wrapper w-6 h-6 text-blue2"><IconVideo /></span>
                <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
            </div>

            <div dir="rtl" className="mb-1.5">
                <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                        <>
                            <FloatingInput
                                label="مقدار واریزی (تومان)"
                                value={field.value}
                                onChange={field.onChange}
                                type="number"
                                placeholder="0 تومان "
                                placeholderColor="text-black0"
                            />
                            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                        </>
                    )}
                />
            </div>
            
            {/* 💡 فیلد کنترلر bank به صورت مخفی برای سازگاری با بک‌اند */}
            <Controller name="bank" control={control} render={({ field }) => <input type="hidden" {...field} />} />


            <p className="text-gray12 text-sm mb-5">
                میزان واریزی حداقل ۲۵ هزار تومان و حداکثر تا سقف ۲۵ میلیون تومان{" "}
            </p>
            
            {/* دکمه‌های مبلغ پیشنهادی */}
            <div className="flex gap-2 items-center mb-12 flex-wrap justify-center">
                {amounts.map((amount, index) => (
                    <button
                        type="button" 
                        key={index}
                        onClick={() => setPresetAmount(amount)}
                        className={`border rounded-lg px-7 py-2 text-sm transition ${
                            Number(amountValue) === amount ? 'border-blue2 text-blue2' : 'border-gray12 text-gray12 hover:border-blue2 hover:text-blue2'
                        }`}
                    >
                        {amount / 1000000} میلیون
                    </button>
                ))}
            </div>

            <div className="mt-16">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                    }`}
                >
                    {isSubmitting ? 'در حال اتصال...' : 'واریز'}
                </button>

                <div className="mt-4" dir="ltr">
                    <Accordion title="راهنمای واریز با درگاه پرداخت ">
                        <ul className="list-disc pr-5 space-y-2 text-black1">
                            <li>از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)</li>
                            <li>مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.</li>
                        </ul>
                    </Accordion>
                </div>
            </div>
        </form>
    );
}