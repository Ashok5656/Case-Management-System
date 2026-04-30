function Span() {
  return (
    <div className="absolute h-[18px] left-0 top-0 w-[7.813px]" data-name="span">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#161616] text-[12px] top-0 whitespace-nowrap">8</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Span />
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[13.81px] not-italic text-[#525252] text-[12px] top-0 whitespace-nowrap">{` events found`}</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[87.516px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[18px] relative shrink-0 w-[146.172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#99a1af] text-[12px] top-0 whitespace-nowrap">Last updated: 28/01/2026</p>
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[#f4f4f4] content-stretch flex items-center justify-between pt-px px-[24px] relative size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d0d0] border-solid border-t inset-0 pointer-events-none" />
      <Container1 />
      <Container3 />
    </div>
  );
}