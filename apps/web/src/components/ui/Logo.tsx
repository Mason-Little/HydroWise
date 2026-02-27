import type { SVGProps } from "react";

export const HydroWiseLogo = (props: SVGProps<SVGSVGElement>) => {
  return (
    <div
      className="flex items-center justify-center overflow-hidden shrink-0"
      style={{
        width: 26,
        height: 26,
        borderRadius: 5,
        border: "2px solid #1f2328",
        background: "linear-gradient(135deg, #b9e5ff 0%, #fff2a8 100%)",
        color: "#1f2328",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        role="img"
        aria-label="HydroWise"
        className="h-4 w-4"
        {...props}
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="
            M128 16
            C128 16 64 92 64 152
            C64 202 96 240 128 240
            C160 240 192 202 192 152
            C192 92 128 16 128 16
            Z

            M128 44
            C128 44 174 102 174 152
            C174 188 154 216 128 216
            C102 216 82 188 82 152
            C82 102 128 44 128 44
            Z
          "
        />
        <path
          fill="white"
          d="
            M132 64
            C132 64 158 110 158 150
            C158 182 142 206 120 214
            C142 196 144 172 144 150
            C144 118 126 82 132 64
            Z
          "
          opacity="0.9"
        />
      </svg>
    </div>
  );
};
