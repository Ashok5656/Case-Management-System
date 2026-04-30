import imgClari5Loader from "figma:asset/f00e65b2786f070bfa2a235a2ec971d7f5109221.png";

function Group() {
  return (
    <div className="absolute contents left-[891px] top-[517px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-46px)] rounded-[8px] size-[46px] top-1/2" data-name="Clari5 Loader">
        <img alt="" className="absolute block max-w-none size-full" height="46" src={imgClari5Loader} width="46" />
      </div>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[1.8] left-[986.5px] not-italic text-[#333] text-[16px] text-center top-[526px] whitespace-nowrap">Loading....</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-[calc(50%+0.5px)] top-1/2">
      <div className="absolute bg-white h-[100px] left-[855px] rounded-[8px] top-[490px] w-[211px]" />
      <Group />
    </div>
  );
}

export default function Group2() {
  return (
    <div className="relative size-full">
      <div className="absolute bottom-0 h-[1080px] right-0 w-[1920px]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1920 1080">
          <path d="M1920 0H0V1080H1920V0Z" fill="var(--fill-0, #333333)" fillOpacity="0.5" id="Vector" />
        </svg>
      </div>
      <Group1 />
    </div>
  );
}