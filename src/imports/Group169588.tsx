import imgClari5Loader from "figma:asset/f00e65b2786f070bfa2a235a2ec971d7f5109221.png";

function Group() {
  return (
    <div className="absolute contents left-[36px] top-[27px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-46.5px)] rounded-[8px] size-[46px] top-1/2" data-name="Clari5 Loader">
        <img alt="" className="absolute block max-w-none size-full" height="46" src={imgClari5Loader} width="46" />
      </div>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[1.8] left-[131.5px] not-italic text-[#333] text-[16px] text-center top-[36px] whitespace-nowrap">Loading....</p>
    </div>
  );
}

export default function Group1() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-white h-[100px] left-0 rounded-[8px] top-0 w-[211px]" />
      <Group />
    </div>
  );
}