import imgPack1 from "./363383baf3477a6d2cbdb2333f419ec67d7f18a8.png";
import imgPack2 from "./a4f276ea3dd7455d3c3457cd1ddd4649c0f71877.png";
import imgPack3 from "./358efedfbe35a12cd05870785573d3cd1726484f.png";
import imgPack4 from "./4acb51496e9ae154cd24f93c24c93ff3f26683b0.png";
import imgPack5 from "./866c30661cd7abd96316a497469d33c119fb9e43.png";
import imgPack6 from "./479d2a36e6a42bbf662ca87be5842a847393ae3c.png";
import imgPack7 from "./1075c0ae49e8910cc39c6cc88432de4ac624a764.png";
import imgPack8 from "./37ecfe247dbf59d26ea61f5006eb8af1ed3590de.png";

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[65px] inset-[3.53%_3.38%_40.42%_12.56%] items-center">
      <div className="h-[279px] relative shrink-0 w-[171px]" data-name="Pack 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPack1} />
      </div>
      <div className="h-[279px] relative shrink-0 w-[171px]" data-name="Pack 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPack2} />
      </div>
      <div className="h-[279px] relative shrink-0 w-[171px]" data-name="Pack 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPack3} />
      </div>
      <div className="h-[279px] relative shrink-0 w-[171px]" data-name="Pack 4">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPack4} />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex gap-[65px] inset-[41.6%_-12.56%_2.35%_12.56%] items-center">
      <div className="h-[279px] relative shrink-0 w-[171px]" data-name="Pack 5">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPack5} />
      </div>
      <div className="h-[279px] relative shrink-0 w-[171px]" data-name="Pack 6">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPack6} />
      </div>
      <div className="h-[279px] relative shrink-0 w-[171px]" data-name="Pack 7">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPack7} />
      </div>
      <div className="h-[279px] relative shrink-0 w-[171px]" data-name="Pack 8">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPack8} />
      </div>
    </div>
  );
}

export default function Boost() {
  return (
    <div className="relative size-full" data-name="Boost">
      <Frame />
      <Frame1 />
      <button className="absolute block cursor-pointer inset-[92.13%_33.62%_0_33.71%] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Quit">
        <div className="absolute bg-[#ef4637] inset-0 rounded-[14px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" data-name="button" />
        <div className="absolute bottom-1/4 flex flex-col font-['Rajdhani:Bold',sans-serif] justify-center leading-[0] left-[32.58%] not-italic right-[33.03%] text-[45px] text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] text-white top-[25.86%] tracking-[-2.25px] whitespace-nowrap">
          <p className="leading-[normal]">Page 1/4</p>
        </div>
      </button>
    </div>
  );
}