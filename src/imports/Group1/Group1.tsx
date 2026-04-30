import imgImage1 from "./db96978421493c827b535ac59301730100819020.png";
import imgImage2 from "./9b5f8dde8fab6147f9613315d7ff2055ea3cefe1.png";

export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[712px] left-0 top-0 w-[1663px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <div className="absolute h-[460px] left-[2px] top-[712px] w-[1659px]" data-name="image 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
    </div>
  );
}