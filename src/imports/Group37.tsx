import svgPaths from "./svg-j8yenkawvu";

function Container() {
  return <div className="absolute bg-[rgba(0,0,0,0.4)] h-[944px] left-0 top-0 w-[1559px]" data-name="Container" />;
}

function Heading() {
  return (
    <div className="h-[30px] relative shrink-0 w-[269.547px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Review and Submit Changes</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_6721_445)" id="Icon">
          <path d={svgPaths.p35a9bc80} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_6721_445">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[6px] relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function KeyConfigurationView() {
  return (
    <div className="absolute bg-[#2a53a0] content-stretch flex h-[64px] items-center justify-between left-0 pb-px px-[30px] top-0 w-[510px]" data-name="KeyConfigurationView">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-b border-solid inset-0 pointer-events-none" />
      <Heading />
      <Button />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#2a53a0] text-[14px] top-0 whitespace-nowrap">Ready to promote changes?</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[39px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[0px] text-[13px] text-[rgba(42,83,160,0.8)] top-0 w-[339px]">
        <span className="leading-[19.5px]">{`Please review the `}</span>
        <span className="[text-decoration-skip-ink:none] decoration-solid font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] underline">1</span>
        <span className="leading-[19.5px]">{` actions below before submitting for verification.`}</span>
      </p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[60px] items-start left-[58px] top-[18px] w-[374px]" data-name="Container">
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-[43.75%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 7.5">
          <path d={svgPaths.p16c9ec0} fill="var(--fill-0, #2A53A0)" id="Vector" />
        </svg>
      </div>
      <div className="absolute bottom-[65.63%] left-[45.31%] right-[45.31%] top-1/4" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.25001 2.25">
          <path d={svgPaths.p3a5af200} fill="var(--fill-0, #2A53A0)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[6.25%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
          <path d={svgPaths.p1308c700} fill="var(--fill-0, #2A53A0)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18px] size-[24px] top-[20px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[#eff6ff] h-[96px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#dbeafe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container3 />
      <Container4 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[18px] left-[4px] top-0 w-[446px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#99a1af] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">Performed Actions</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M1 13H15V14H1V13Z" fill="var(--fill-0, #155DFC)" id="Vector" />
          <path d={svgPaths.p279f5270} fill="var(--fill-0, #155DFC)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[8px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-0 not-italic text-[#161616] text-[14px] top-0 whitespace-nowrap">Added Attributes (3)</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#6a7282] text-[12px] top-0 whitespace-nowrap">FT_CARD_TXN, NFT_LOGIN, NFT_REGISTRATION</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="flex-[276.938_0_0] h-[39px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[39px] relative shrink-0 w-[320.938px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container9 />
        <Container10 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[15px] relative shrink-0 w-[23.422px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-0 not-italic text-[#6a7282] text-[10px] top-0 tracking-[0.5px] uppercase whitespace-nowrap">ADD</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[#f3f4f6] h-[23px] relative rounded-[4px] shrink-0 w-[43.422px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] relative size-full">
        <Paragraph5 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] relative size-full">
          <Container8 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[74px] left-0 rounded-[8px] top-[26px] w-[450px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container7 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="Container">
      <Paragraph2 />
      <Container6 />
    </div>
  );
}

function KeyConfigurationView1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[236px] items-start left-0 pt-[24px] px-[30px] top-[64px] w-[510px]" data-name="KeyConfigurationView">
      <Container2 />
      <Container5 />
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[63px] relative shrink-0 w-[255px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-px relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#2a53a0] text-[14px] text-center whitespace-nowrap">Continue Editing</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[189.19px] size-[18px] top-[22.5px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p63e4a00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#2a53a0] flex-[255_0_0] h-[63px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[114.8px] not-italic text-[14px] text-center text-white top-[21px] whitespace-nowrap">Confirm and Submit</p>
        <Icon3 />
      </div>
    </div>
  );
}

function KeyConfigurationView2() {
  return (
    <div className="absolute bg-[#f4f4f4] content-stretch flex h-[64px] items-start left-0 pt-px top-[324px] w-[510px]" data-name="KeyConfigurationView">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <Button1 />
      <Button2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-white h-[388px] left-[524.5px] overflow-clip rounded-[4px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] top-[278px] w-[510px]" data-name="Container">
      <KeyConfigurationView />
      <KeyConfigurationView1 />
      <KeyConfigurationView2 />
    </div>
  );
}

export default function Group() {
  return (
    <div className="relative size-full">
      <Container />
      <Container1 />
    </div>
  );
}