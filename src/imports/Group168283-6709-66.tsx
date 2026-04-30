import svgPaths from "./svg-6bcrq02oaf";

function Rectangle() {
  return (
    <div className="absolute inset-[0_0_0.6%_0]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 360 260.434">
        <g id="Rectangle 3647">
          <path d={svgPaths.p3845500} fill="var(--fill-0, white)" id="Vector" />
          <g id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function AlertsStatusChangedSuccesfully() {
  return (
    <div
      className="absolute contents inset-[45.8%_24.02%_34.35%_28.2%]"
      data-name="Alerts Status Changed
Succesfully"
    >
      <div className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[45.8%_24.02%_34.35%_28.2%] leading-[1.6] not-italic text-[#767676] text-[16px] text-center whitespace-nowrap whitespace-pre">
        <p className="mb-0">{`Attribute List Updated `}</p>
        <p>Successfully</p>
      </div>
    </div>
  );
}

function IconIonicIosCheckmarkCircleOutline() {
  return (
    <div className="absolute inset-[12.51%_44.74%_73.75%_45.26%]" data-name="Icon ionic-ios-checkmark-circle-outline">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Icon ionic-ios-checkmark-circle-outline">
          <path d={svgPaths.p3903a780} fill="var(--fill-0, #2A53A0)" id="Path 83228" />
          <path d={svgPaths.p3ad3b700} fill="var(--fill-0, #2A53A0)" id="Path 83229" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-0">
      <Rectangle />
      <AlertsStatusChangedSuccesfully />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium inset-[30.78%_37.22%_58.53%_39.72%] leading-[1.4] not-italic text-[#2a53a0] text-[20px] whitespace-nowrap">Updated</p>
      <IconIonicIosCheckmarkCircleOutline />
      <div className="absolute content-stretch flex h-[55px] items-start left-0 rounded-bl-[8px] rounded-br-[8px] top-[207px] w-[360px]" data-name="Button Primary">
        <div className="bg-[#2a53a0] flex-[1_0_0] min-h-px min-w-px relative rounded-bl-[10px] rounded-br-[10px]" data-name="Button Primary">
          <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex gap-[8px] items-center justify-center p-[16px] relative w-full">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Continue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Group1() {
  return (
    <div className="relative size-full">
      <Group />
    </div>
  );
}