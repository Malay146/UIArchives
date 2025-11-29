"use client";
import React, { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Button1 from "@/components/ui-components/Button1";
import { Input } from "@/components/ui-components/Input";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Background from "@/components/Background";
import SunEffect from "@/components/SunEffect";

const AddResourcePage = () => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const shareTitleRef = useRef<HTMLHeadingElement>(null);
  const shareParaRef = useRef<HTMLParagraphElement>(null);

  //animations
  useEffect(() => {
    gsap.registerPlugin(SplitText);

    const splitTitle = new SplitText(shareTitleRef.current, {
      type: "words,chars",
    });
    const splitPara = new SplitText(shareParaRef.current, {
      type: "lines",
    });

    let ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.5,
        stagger: 0.2,
        filter: "blur(25px)",
        ease: "power3.out",
      });
      gsap.from([splitTitle.chars, splitPara.lines], {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.07,
        filter: "blur(20px)",
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

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
  const [toast, setToast] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);

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

  const update = (k: keyof typeof form, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

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
        setToast({
          type: "success",
          text: "Thanks — your resource was submitted successfully.",
        });
        setForm({
          name: "",
          email: "",
          title: "",
          description: "",
          webLink: "",
          github: "",
          twitter: "",
        });
        setValue("");
      } else {
        setToast({
          type: "error",
          text: data?.error || "Something went wrong. Try again later.",
        });
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
      <Background />
      <SunEffect />

      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <Navbar showShareButton={true} showAddResourceButton={false} />
        <div className="w-full h-full mt-8 sm:mt-12 md:mt-16 lg:mt-24 xl:mt-32 2xl:mt-46 flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-6 xl:gap-8 items-center justify-center lg:items-start p-6">
          <div className="w-full lg:w-[50%] shrink-0 ml-8">
            <h1
              ref={shareTitleRef}
              className="text-white font-[Inria_Serif] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[80px] tracking-tighter leading-tight sm:leading-[1.1] md:leading-[1.15]"
            >
              Got Something Cool?
            </h1>
            <p
              ref={shareParaRef}
              className="text-zinc-400 font-[Inria_Serif] font-light tracking-normal text-base sm:text-lg md:text-xl lg:text-2xl mt-4 sm:mt-6 md:mt-8 text-balance"
            >
              Discovered an amazing frontend tool, library, or design
              inspiration? Share it with the community! Add your favorite
              resource to UI Archives and help developers, designers, and
              creators find the gems that make building beautiful interfaces
              faster and more fun.
            </p>
          </div>
          <div
            ref={formRef}
            className="w-full lg:w-[50%] shrink-0 noise bg-[#121212] rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 sm:mx-8 shadow-[inset_5px_5px_22px_rgba(255,255,255,0.08),inset_-5px_-5px_22px_rgba(0,0,0,1)]"
          >
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
              <div
                aria-live="polite"
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
              >
                {toast && (
                  <div
                    className={`${
                      toast.type === "success"
                        ? "border-green-600 bg-green-800"
                        : "border-red-600 bg-red-800"
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
