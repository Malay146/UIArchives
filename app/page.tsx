import Image from "next/image";
import UiCard, { UiCardData } from "@/components/UiCard";
import Silk from "@/components/Silk";

const cardData: UiCardData[] = [
  {
    title: "Shadcn",
    description:
      "Shadcn (often written as shadcn/ui) is a popular component library for React and Next.js projects that provides beautifully designed, accessible, and customizable UI components built using Tailwind CSS and Radix UI.",
    tag: "Component Library",
    image: "/shadcn.webp", // Place your image in /public folder
    links: {
      website: "https://ui.shadcn.com",
      github: "https://github.com/shadcn/ui",
      twitter: "https://twitter.com/shadcn",
    },
  },
  {
    title: "Tailwind CSS",
    description:
      "Tailwind CSS is a utility-first CSS framework for rapidly building custom designs without leaving your HTML.",
    tag: "CSS Framework",
    image: "/tailwindcss.webp",
    links: {
      website: "https://tailwindcss.com",
      github: "https://github.com/tailwindlabs/tailwindcss",
    },
  },
  {
    title: "Radix UI",
    description:
      "Radix UI provides accessible, unstyled UI primitives for building high-quality design systems and web apps.",
    tag: "UI Primitives",
    image: "/radix-ui.webp",
    links: {
      website: "https://www.radix-ui.com",
      github: "https://github.com/radix-ui",
    },
  },
  {
    title: "ReactBits",
    description:
      "ReactBits is a curated collection of reusable React patterns, techniques, tips, and best practices designed to help developers write cleaner, more efficient, and scalable React code.",
    tag: "Component Library",
    image: "/reactbits.png", // Place this image inside your /public folder
    links: {
      website: "https://reactbits.dev",
      github: "https://github.com/vasanthk/react-bits",
      twitter: "https://twitter.com/vasanthk",
    },
  },
];

export default function Home() {
  return (
    <div className="w-full relative min-h-screen">
      {/* Black Basic Grid Background */}
      <div
        className="fixed inset-0 -z-10 h-full w-full min-h-screen"
        style={{
          background: "#000000",
          backgroundImage: `
        linear-gradient(to right, rgba(75, 85, 99, 0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.15) 1px, transparent 1px)
      `,
          backgroundSize: "40px 40px",
          backgroundRepeat: "repeat",
        }}
      />
      {/* Your Content/Components */}

      <svg
        width="959"
        height="800"
        viewBox="0 0 959 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute z-99 pointer-events-none"
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

      <div className="max-w-7xl h-screen mx-auto">
        <Navbar />

        {/* Hero Section */}
        <div className="hero-section flex flex-col items-center justify-center gap-6">
          <h1 className="font-[Inria_Serif] text-[88px] font-bold bg-clip-text text-center text-transparent bg-linear-to-r from-[#3F3F3F] via-[#FFFFFF] to-[#3F3F3F] tracking-tighter mt-24">
            All Your Frontend Necessities
          </h1>

          {/* Hero Image */}
          <div className="hero-image -mt-8 relative w-[822px] h-[126px] rounded-[88px] overflow-hidden">
            {/* <Image
              src="/graphic.jpg"
              alt="Graphic"
              fill
              className="object-cover bg-center"
            /> */}
            <Silk
              speed={5}
              scale={1}
              color="#7B7481"
              noiseIntensity={1.5}
              rotation={50}
            />
          </div>
          <p className="text-[#888888] max-w-4xl font-[Inria_Serif] text-[24px] text-center font-extralight tracking-tigher leading-6 mt-3">
            Explore a universe of tools, frameworks, and components — all in one
            place. Just search what you need, and get instant access to the best
            resources.
          </p>

          {/* CTA */}
          <div className="flex gap-4 mt-8">
            <Button1 className="tracking-tighter">
              <a href="#filter">Explore Resouces</a>
            </Button1>
            <Button2 className="flex items-center gap-2 tracking-tighter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-github-icon lucide-github"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              Github
            </Button2>
          </div>

          {/* Divider */}
          <div className="divider border-t border-zinc-800 w-xl h-px mt-3" />

          {/* Metrics */}
          <div className="metrics max-w-xl flex items-center justify-center gap-32 font-[Inter] text-center mt-1">
            <div>
              <p className="text-3xl font-extrabold">1000+</p>
              <p className="font-thin text-lg">Resources Shared</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">100%</p>
              <p className="font-thin text-lg">Free</p>
            </div>
          </div>

          {/* Filter & Search */}
          <div
            className="filter max-w-7xl tracking-tighter mt-12 flex flex-col"
            id="filter"
          >
            <div className="flex gap-2">
              <Button1>All</Button1>
              <Button1>Component Library</Button1>
              <Button1>Framework</Button1>
              <Button1>Fonts</Button1>
              <Button1>Icons</Button1>
              <Button1>Testing</Button1>
              <Button1>X/Twitter</Button1>
              <Button1>Youtube</Button1>
              <Button1>Favourite</Button1>
            </div>
            <Search
              type="text"
              placeholder="Search..."
              autoComplete="off"
              className="pl-10 w-full mt-3 outline-none"
            />
          </div>

          {/* Cards */}
          <div className="Cards w-full grid grid-cols-3 gap-3 mt-5 font-[Inter] tracking-tight">
            {cardData.map((card, index) => (
              <UiCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Navbar = () => {
  return (
    <div className="navbar pt-10 flex items-center justify-between">
      <svg
        width="265"
        height="55"
        viewBox="0 0 265 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.6 5.70001V27.2L17.7 24.4C9 19.4 3.59999 10.1 3.59999 0H0V24.6C0 32.6 4.59999 40 11.9 43.5L22.7 48.7V27.2L27.6 30C36.3 35 41.7 44.3 41.7 54.4H45.3V29.8C45.3 21.8 40.7 14.4 33.4 10.9L22.6 5.70001Z"
          fill="white"
        />
        <path
          d="M84.4732 11.5182H91.5812V28.2909C91.5812 30.2852 91.1039 32.0111 90.1494 33.4685C89.2033 34.9173 87.8823 36.0381 86.1863 36.8307C84.4903 37.6148 82.5215 38.0068 80.28 38.0068C78.0215 38.0068 76.0442 37.6148 74.3482 36.8307C72.6522 36.0381 71.3312 34.9173 70.3852 33.4685C69.4477 32.0111 68.9789 30.2852 68.9789 28.2909V11.5182H76.0869V27.6773C76.0869 28.4869 76.2658 29.2114 76.6238 29.8506C76.9817 30.4813 77.4761 30.9756 78.1067 31.3335C78.746 31.6915 79.4704 31.8705 80.28 31.8705C81.0982 31.8705 81.8227 31.6915 82.4533 31.3335C83.084 30.9756 83.5783 30.4813 83.9363 29.8506C84.2942 29.2114 84.4732 28.4869 84.4732 27.6773V11.5182ZM100.267 11.5182V37.7H93.1594V11.5182H100.267ZM108.637 37.7H100.967L109.609 11.5182H119.325L127.967 37.7H120.296L114.569 18.7284H114.364L108.637 37.7ZM107.205 27.3705H121.626V32.6886H107.205V27.3705ZM128.791 37.7V18.0636H135.643V21.7966H135.847C136.205 20.4159 136.772 19.406 137.548 18.7668C138.332 18.1276 139.248 17.808 140.296 17.808C140.603 17.808 140.906 17.8335 141.204 17.8847C141.511 17.9273 141.805 17.9912 142.086 18.0764V24.0977C141.737 23.9784 141.306 23.8889 140.795 23.8293C140.283 23.7696 139.845 23.7398 139.478 23.7398C138.788 23.7398 138.166 23.8975 137.612 24.2128C137.066 24.5196 136.636 24.9543 136.32 25.5168C136.005 26.0708 135.847 26.7227 135.847 27.4727V37.7H128.791ZM150.935 38.058C148.804 38.058 146.981 37.6361 145.464 36.7923C143.947 35.9401 142.783 34.7554 141.974 33.2384C141.164 31.7128 140.759 29.9443 140.759 27.933C140.759 25.9216 141.164 24.1574 141.974 22.6404C142.783 21.1148 143.947 19.9301 145.464 19.0864C146.981 18.2341 148.804 17.808 150.935 17.808C152.861 17.808 154.527 18.1574 155.934 18.8563C157.349 19.5466 158.444 20.5267 159.219 21.7966C159.995 23.058 160.387 24.5409 160.395 26.2455H153.85C153.756 25.2142 153.458 24.4301 152.955 23.8932C152.461 23.3477 151.822 23.075 151.037 23.075C150.424 23.075 149.887 23.254 149.427 23.6119C148.966 23.9614 148.608 24.494 148.353 25.21C148.097 25.9173 147.969 26.808 147.969 27.8818C147.969 28.9557 148.097 29.8506 148.353 30.5665C148.608 31.2739 148.966 31.8065 149.427 32.1645C149.887 32.5139 150.424 32.6886 151.037 32.6886C151.557 32.6886 152.018 32.5693 152.418 32.3307C152.819 32.0835 153.143 31.7256 153.39 31.2568C153.645 30.7796 153.799 30.2 153.85 29.5182H160.395C160.37 31.2483 159.974 32.7568 159.206 34.0438C158.439 35.3222 157.353 36.3108 155.947 37.0097C154.549 37.7085 152.878 38.058 150.935 38.058ZM168.564 26.6546V37.7H161.507V11.5182H168.308V21.7966H168.513C168.956 20.5438 169.693 19.5679 170.724 18.869C171.756 18.1617 172.996 17.808 174.444 17.808C175.834 17.808 177.04 18.1233 178.062 18.754C179.094 19.3847 179.89 20.254 180.453 21.3619C181.024 22.4699 181.305 23.7398 181.297 25.1716V37.7H174.24V26.6546C174.248 25.683 174.006 24.9202 173.511 24.3662C173.025 23.8122 172.331 23.5352 171.427 23.5352C170.856 23.5352 170.354 23.6631 169.919 23.9188C169.493 24.1659 169.16 24.5239 168.922 24.9926C168.692 25.4529 168.572 26.0068 168.564 26.6546ZM182.98 37.7V18.0636H190.037V37.7H182.98ZM186.509 16.0182C185.554 16.0182 184.736 15.7029 184.054 15.0722C183.372 14.4415 183.032 13.683 183.032 12.7966C183.032 11.9102 183.372 11.1517 184.054 10.521C184.736 9.89035 185.554 9.57501 186.509 9.57501C187.472 9.57501 188.29 9.89035 188.963 10.521C189.645 11.1517 189.986 11.9102 189.986 12.7966C189.986 13.683 189.645 14.4415 188.963 15.0722C188.29 15.7029 187.472 16.0182 186.509 16.0182ZM211.623 18.0636L205.026 37.7H196.844L190.248 18.0636H197.662L200.833 31.0523H201.037L204.208 18.0636H211.623ZM220.641 38.058C218.544 38.058 216.738 37.6574 215.221 36.8563C213.712 36.0466 212.549 34.8875 211.731 33.379C210.921 31.8619 210.516 30.0466 210.516 27.933C210.516 25.9046 210.925 24.1318 211.743 22.6148C212.562 21.0977 213.716 19.9173 215.208 19.0736C216.699 18.2298 218.459 17.808 220.488 17.808C221.971 17.808 223.313 18.0381 224.515 18.4983C225.716 18.9585 226.743 19.6276 227.596 20.5054C228.448 21.3747 229.104 22.4315 229.564 23.6759C230.025 24.9202 230.255 26.3222 230.255 27.8818V29.5182H212.715V25.6318H223.76C223.752 25.0693 223.607 24.575 223.326 24.1489C223.053 23.7142 222.682 23.3776 222.214 23.1389C221.753 22.8918 221.229 22.7682 220.641 22.7682C220.07 22.7682 219.546 22.8918 219.069 23.1389C218.591 23.3776 218.208 23.71 217.918 24.1361C217.637 24.5622 217.488 25.0608 217.471 25.6318V29.825C217.471 30.4557 217.603 31.0182 217.867 31.5125C218.131 32.0068 218.51 32.3946 219.005 32.6759C219.499 32.9571 220.096 33.0977 220.794 33.0977C221.28 33.0977 221.723 33.0296 222.124 32.8932C222.533 32.7568 222.883 32.5608 223.172 32.3051C223.462 32.0409 223.675 31.7256 223.812 31.3591H230.255C230.033 32.7227 229.509 33.9074 228.682 34.9131C227.856 35.9102 226.76 36.6858 225.397 37.2398C224.042 37.7852 222.456 38.058 220.641 38.058ZM249.283 24.4557H242.789C242.755 24.0551 242.614 23.71 242.367 23.4202C242.12 23.1304 241.8 22.9088 241.408 22.7554C241.025 22.5935 240.599 22.5125 240.13 22.5125C239.525 22.5125 239.005 22.6233 238.57 22.8449C238.135 23.0665 237.922 23.3818 237.931 23.7909C237.922 24.0807 238.046 24.3492 238.302 24.5963C238.566 24.8435 239.073 25.0352 239.823 25.1716L243.812 25.8875C245.823 26.254 247.319 26.8719 248.299 27.7412C249.287 28.602 249.786 29.7568 249.795 31.2057C249.786 32.6034 249.368 33.8179 248.542 34.8492C247.724 35.8719 246.603 36.6645 245.179 37.227C243.765 37.781 242.15 38.058 240.334 38.058C237.334 38.058 234.986 37.4443 233.29 36.2171C231.603 34.9898 230.661 33.3705 230.465 31.3591H237.471C237.564 31.9813 237.871 32.4628 238.391 32.8037C238.92 33.1361 239.584 33.3023 240.385 33.3023C241.033 33.3023 241.566 33.1915 241.983 32.9699C242.41 32.7483 242.627 32.433 242.635 32.0239C242.627 31.6489 242.439 31.3506 242.073 31.129C241.715 30.9074 241.152 30.7284 240.385 30.5921L236.908 29.9784C234.905 29.629 233.405 28.9642 232.408 27.9841C231.411 27.004 230.917 25.7426 230.925 24.2C230.917 22.8364 231.275 21.6815 231.999 20.7355C232.732 19.781 233.776 19.0565 235.131 18.5622C236.495 18.0594 238.11 17.808 239.976 17.808C242.814 17.808 245.052 18.396 246.688 19.5722C248.333 20.7483 249.198 22.3761 249.283 24.4557Z"
          fill="white"
        />
      </svg>

      <Button1 className="font-extralight tracking-tighter">
        Share your Resource
      </Button1>
    </div>
  );
};

type Button1Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button1 = ({ children, className = "", ...props }: Button1Props) => {
  return (
    <button
      {...props}
      className={`noise font-[Inter]  px-5 py-3 bg-[#171717] cursor-pointer rounded-2xl shadow-[inset_4px_4px_4px_rgba(255,255,255,0.04),inset_-4px_-4px_4px_rgba(0,0,0,0.5)] hover:shadow-[inset_-4px_-4px_4px_rgba(255,255,255,0.08),inset_4px_4px_4px_rgba(0,0,0,0.5)] transition-shadow duration-300 font-light text-zinc-400 ${className}`}
    >
      {children}
    </button>
  );
};

type Button2Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button2 = ({ children, className = "", ...props }: Button2Props) => {
  return (
    <button
      {...props}
      className={`noise font-[Inter] px-5 py-3 bg-[#BDBDBD] cursor-pointer rounded-2xl   
      shadow-[inset_-4px_-4px_4px_rgba(0,0,0,0.5),inset_4px_4px_4px_rgba(255,255,255,0.5)]
      hover:shadow-[inset_4px_4px_4px_rgba(0,0,0,0.5),inset_-4px_-4px_4px_rgba(255,255,255,0.5)]
      transition-shadow duration-300 font-light text-zinc-800 ${className}`}
    >
      {children}
    </button>
  );
};

type SearchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Search = ({ className = "", ...props }: SearchProps) => {
  return (
    <input
      {...props}
      className={`noise font-[Inter] px-5 py-3 bg-[#BDBDBD] rounded-2xl 
      shadow-[inset_-4px_-4px_4px_rgba(0,0,0,0.5),inset_4px_4px_4px_rgba(255,255,255,0.5)]
      focus:shadow-[inset_4px_4px_4px_rgba(0,0,0,0.5),inset_-4px_-4px_4px_rgba(255,255,255,0.5)]
      transition-shadow duration-300 font-light text-zinc-800 placeholder:text-zinc-500
      ${className}`}
    />
  );
};
