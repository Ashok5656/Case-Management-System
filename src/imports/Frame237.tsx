import svgPaths from "./svg-s3zti3ghny";

function Headset() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Headset">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Headset">
          <path d={svgPaths.pc978f00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#393939] content-stretch flex items-center p-[4px] relative rounded-[24px] shrink-0">
      <Headset />
    </div>
  );
}

function PhoneVoice() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Phone--voice">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Phone--voice">
          <g id="Vector">
            <path d={svgPaths.p3eca1880} fill="white" />
            <path d={svgPaths.p16254b80} fill="white" />
            <path d={svgPaths.p30abd600} fill="white" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#393939] content-stretch flex items-center p-[4px] relative rounded-[24px] shrink-0">
      <PhoneVoice />
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative size-full">
      <Frame1 />
      <Frame />
    </div>
  );
}
