import svgPaths from "./svg-oaq86g0iix";

function Text() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[11.5px] w-[109.531px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#525252] text-[16px] top-[-2px] whitespace-nowrap">Items per page:</p>
    </div>
  );
}

function Option() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option1() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option2() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option3() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Dropdown() {
  return (
    <div className="absolute content-stretch flex flex-col h-[48px] items-start left-0 pb-px pl-[-410.531px] pr-[467.531px] pt-[-837.5px] top-[-0.5px] w-[57px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b border-solid inset-0 pointer-events-none" />
      <Option />
      <Option1 />
      <Option2 />
      <Option3 />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[33px] size-[16px] top-[15.5px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2fb7a700} fill="var(--fill-0, #161616)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[47px] left-[133.53px] top-0 w-[57px]" data-name="Container">
      <Dropdown />
      <Icon />
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] h-[47px] min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text />
        <Container3 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#161616] text-[0px] top-[-2px] whitespace-nowrap">
          <span className="leading-[24px] text-[16px]">1–12</span>
          <span className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[#525252] text-[16px]">{` of `}</span>
          <span className="leading-[24px] text-[16px]">12</span>
          <span className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[#525252] text-[16px]">{` items`}</span>
        </p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[47px] relative shrink-0 w-[142.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[16px] relative size-full">
        <Text1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[47px] relative shrink-0 w-[350.406px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container2 />
        <Container4 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute content-stretch flex h-[47px] items-center left-[64px] pr-[17px] top-0 w-[90.906px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-r border-solid inset-0 pointer-events-none" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap">of 1 pages</p>
    </div>
  );
}

function Option4() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Dropdown1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[48px] items-start left-0 pb-px pl-[-1651.094px] pr-[1714.094px] pt-[-837.5px] top-[-0.5px] w-[63px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b border-solid inset-0 pointer-events-none" />
      <Option4 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[35px] size-[16px] top-[15.5px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2fb7a700} fill="var(--fill-0, #161616)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[47px] left-px top-0 w-[63px]" data-name="Container">
      <Dropdown1 />
      <Icon1 />
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] h-[47px] min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-l border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text2 />
        <Container7 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M12.5 15L6.25 10L12.5 5V15Z" fill="var(--fill-0, #161616)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="h-[47px] opacity-25 relative shrink-0 w-[48px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[14px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M7.5 5L13.75 10L7.5 15V5Z" fill="var(--fill-0, #161616)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[1_0_0] h-[47px] min-w-px opacity-25 relative" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-[14.5px] pr-[13.5px] relative size-full">
          <Icon3 />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[47px] relative shrink-0 w-[96px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[47px] relative shrink-0 w-[250.906px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container6 />
        <Container8 />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between pt-px relative size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-solid border-t inset-0 pointer-events-none" />
      <Container1 />
      <Container5 />
    </div>
  );
}