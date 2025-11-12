"use client";
import React, { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Button1 from "@/components/ui-components/Button1";
import { Input } from "@/components/ui-components/Input";

const AddResourcePage = () => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    webLink: "",
    github: "",
    twitter: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<null | { type: "success" | "error"; text: string }>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height, then set to scroll height (but cap at 160px)
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;

    setValue(e.target.value);
  };

  const update = (k: keyof typeof form, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/send-resource", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          title: form.title,
          description: form.description,
          webLink: form.webLink,
          github: form.github,
          twitter: form.twitter,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ type: "success", text: "Thanks — your resource was submitted successfully." });
        setForm({ name: "", email: "", title: "", description: "", webLink: "", github: "", twitter: "" });
        setValue("");
      } else {
        setToast({ type: "error", text: data?.error || "Something went wrong. Try again later." });
      }
    } catch (err) {
      setToast({ type: "error", text: "Network error. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative min-h-screen">
      {/* Black Basic Grid Background */}
      <div
        className="fixed inset-0 h-full w-full min-h-screen bg-grid-responsive"
        style={{
          background: "#000000",
          backgroundImage: `
        linear-gradient(to right, rgba(75, 85, 99, 0.2) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.2) 1px, transparent 1px)
      `,
          backgroundSize: "40px 40px",
          backgroundRepeat: "repeat",
        }}
      />

      <svg
        width="959"
        height="800"
        viewBox="0 0 959 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute z-99 pointer-events-none hidden sm:block  h-auto opacity-50 sm:opacity-100"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      >
        <g opacity="0.14" filter="url(#filter0_f_67_2)">
          <path
            d="M107.743 -108.483L-18.1717 31.5653C-32.8453 47.886 -29.6258 73.426 -11.3608 85.5945L712.016 567.521C725.338 576.396 742.921 575.409 755.165 565.098L761.803 559.508C777.829 546.012 778.99 521.736 764.325 506.773L160.225 -109.612C145.682 -124.45 121.634 -123.933 107.743 -108.483Z"
            fill="url(#paint0_linear_67_2)"
          />
        </g>
        <g filter="url(#filter1_f_67_2)">
          <path
            d="M-207.257 -205.483L-333.172 -65.4347C-347.845 -49.114 -344.626 -23.574 -326.361 -11.4055L397.016 470.521C410.338 479.396 427.921 478.409 440.165 468.098L446.803 462.508C462.829 449.012 463.99 424.736 449.325 409.773L-154.775 -206.612C-169.318 -221.45 -193.366 -220.933 -207.257 -205.483Z"
            fill="url(#paint1_linear_67_2)"
            fillOpacity="0.17"
          />
        </g>
        <g opacity="0.82" filter="url(#filter2_f_67_2)">
          <ellipse
            cx="270.735"
            cy="191.403"
            rx="474.781"
            ry="331.285"
            transform="rotate(28 270.735 191.403)"
            fill="#FFEBAA"
            fillOpacity="0.16"
          />
        </g>
        <g filter="url(#filter3_f_67_2)">
          <circle cx="80" cy="48" r="1" fill="#D9D9D9" />
        </g>
        <g filter="url(#filter4_f_67_2)">
          <circle cx="259" cy="234" r="1" fill="#D9D9D9" />
        </g>
        <g filter="url(#filter5_f_67_2)">
          <circle cx="226" cy="386" r="1" fill="#D9D9D9" fillOpacity="0.5" />
        </g>
        <g filter="url(#filter6_f_67_2)">
          <circle cx="436" cy="137" r="1" fill="#D9D9D9" fillOpacity="0.5" />
        </g>
        <g filter="url(#filter7_f_67_2)">
          <circle cx="307" cy="138" r="1" fill="#D9D9D9" fillOpacity="0.5" />
        </g>
        <g filter="url(#filter8_f_67_2)">
          <circle cx="443" cy="198" r="1" fill="#D9D9D9" />
        </g>
        <g filter="url(#filter9_f_67_2)">
          <circle cx="286" cy="300" r="1" fill="#D9D9D9" />
        </g>
        <g filter="url(#filter10_f_67_2)">
          <circle cx="123" cy="183" r="1" fill="#D9D9D9" />
        </g>
        <g filter="url(#filter11_f_67_2)">
          <circle cx="46" cy="298" r="1" fill="#D9D9D9" fillOpacity="0.5" />
        </g>
        <g filter="url(#filter12_f_67_2)">
          <circle cx="339" cy="45" r="1" fill="#D9D9D9" fillOpacity="0.5" />
        </g>
        <defs>
          <filter
            id="filter0_f_67_2"
            x="-80.8034"
            y="-173.814"
            width="908.818"
            height="800.775"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="26.7"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter1_f_67_2"
            x="-395.803"
            y="-270.814"
            width="908.818"
            height="800.775"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="26.7"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter2_f_67_2"
            x="-416.914"
            y="-416.77"
            width="1375.3"
            height="1216.35"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="120.2"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter3_f_67_2"
            x="77"
            y="45"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter4_f_67_2"
            x="256"
            y="231"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter5_f_67_2"
            x="223"
            y="383"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter6_f_67_2"
            x="433"
            y="134"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter7_f_67_2"
            x="304"
            y="135"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter8_f_67_2"
            x="440"
            y="195"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter9_f_67_2"
            x="283"
            y="297"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter10_f_67_2"
            x="120"
            y="180"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter11_f_67_2"
            x="43"
            y="295"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter12_f_67_2"
            x="336"
            y="42"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <linearGradient
            id="paint0_linear_67_2"
            x1="28.9507"
            y1="35.8142"
            x2="690.316"
            y2="516.28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFD95D" />
            <stop
              offset="0.840951"
              stopColor="#FFD95D"
              stopOpacity="0.646417"
            />
            <stop offset="1" stopColor="#FFD95D" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_67_2"
            x1="-286.049"
            y1="-61.1858"
            x2="375.316"
            y2="419.28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFD95D" />
            <stop
              offset="0.840951"
              stopColor="#FFD95D"
              stopOpacity="0.646417"
            />
            <stop offset="1" stopColor="#FFD95D" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <Navbar showShareButton={true} showAddResourceButton={false} />
        <div className="w-full h-full mt-8 sm:mt-12 md:mt-16 lg:mt-24 xl:mt-32 2xl:mt-46 flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-6 xl:gap-8 items-center justify-center lg:items-start p-6">
          <div className="w-full lg:w-[50%] shrink-0 ml-8">
            <h1 className="text-white font-[Inria_Serif] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[80px] tracking-tighter leading-tight sm:leading-[1.1] md:leading-[1.15]">
              Got Something Cool?
            </h1>
            <p className="text-zinc-400 font-[Inria_Serif] font-light tracking-normal text-base sm:text-lg md:text-xl lg:text-2xl mt-4 sm:mt-6 md:mt-8 text-balance">
              Discovered an amazing frontend tool, library, or design
              inspiration? Share it with the community! Add your favorite
              resource to UI Archives and help developers, designers, and
              creators find the gems that make building beautiful interfaces
              faster and more fun.
            </p>
          </div>
          <div className="w-full lg:w-[50%] shrink-0 noise bg-[#121212] rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 sm:mx-8 shadow-[inset_5px_5px_22px_rgba(255,255,255,0.08),inset_-5px_-5px_22px_rgba(0,0,0,1)]">
            <h1 className="text-zinc-500 font-bold font-[Inria_Serif] tracking-tight text-2xl sm:text-3xl md:text-4xl border-b border-zinc-700 pb-2">
              Submit your Resource
            </h1>

            <form
              onSubmit={handleSubmit}
              className="font-[Inter] tracking-tight mt-4 sm:mt-5 flex flex-col gap-3 font-light"
            >
              <div className="w-full flex flex-col sm:flex-row gap-5 md:gap-3 mb-2 text-zinc-950">
                <Input
                  type="text"
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
              <div className="w-full flex flex-col sm:flex-row gap-5 md:gap-3 mb-2">
                <Input
                  type="text"
                  placeholder="Title"
                  required
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Website link"
                  required
                  value={form.webLink}
                  onChange={(e) => update("webLink", e.target.value)}
                />
              </div>
              <div className="w-full flex gap-5 md:gap-3 mb-2">
                <textarea
                  ref={textareaRef}
                  rows={4}
                  value={form.description}
                  onChange={(e) => {
                    handleChange(e as React.ChangeEvent<HTMLTextAreaElement>);
                    update("description", e.target.value);
                  }}
                  className="px-4 py-2 rounded-lg bg-zinc-600 outline-none w-full placeholder:text-zinc-800 text-zinc-950 resize-none transition-all duration-150 text-sm sm:text-base"
                  placeholder="Description... (optional)"
                />
              </div>
              <div className="w-full flex flex-col sm:flex-row gap-5 md:gap-3 mb-2">
                <Input
                  type="text"
                  placeholder="GitHub link (optional)"
                  value={form.github}
                  onChange={(e) => update("github", e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Twitter link (optional)"
                  value={form.twitter}
                  onChange={(e) => update("twitter", e.target.value)}
                />
              </div>
              <div className="w-full flex justify-end mt-2">
                <Button1 type="submit" disabled={loading} className="px-4">
                  {loading ? "Sending..." : "Submit"}
                </Button1>
              </div>

              {/* Toast */}
              <div aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                {toast && (
                  <div
                    className={`${
                      toast.type === "success" ? "border-green-600 bg-green-800" : "border-red-600 bg-red-800"
                    } text-white px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 backdrop-blur-sm max-w-xl`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      {toast.type === "success" ? (
                        <path d="M20 6L9 17l-5-5" />
                      ) : (
                        <>
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4" />
                          <path d="M12 16h.01" />
                        </>
                      )}
                    </svg>
                    <div className="text-sm font-medium">{toast.text}</div>
                    <button
                      onClick={() => setToast(null)}
                      className="ml-2 text-zinc-200 hover:text-white"
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddResourcePage;
