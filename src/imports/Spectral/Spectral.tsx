import imgSpectral10 from "./7685f41d9f107174ece6979034c6da51c6db8fb6.png";
import imgSpectral11 from "./0a1b00be65a39fd112d2156ceee1d66e529adfc9.png";
import imgSpectral12 from "./dc714b14750b10d7554817a3f71bdf35ebd2e5b1.png";
import imgSpectral13 from "./d5fa089317c51235cb5786e78d65f128f75cbeca.png";
import imgSpectral14 from "./13dccdb22eeba06c30ff497c7d36a3817fba971c.png";
import imgSpectral15 from "./affdc225854ad3286f46fd255f3bb93d71e58813.png";
import imgSpectral16 from "./39afedaa6df823c029410c03da5adf0cae5ba3de.png";
import imgSpectral8 from "./773fa849484736c6b41f53a999bede55a828a7aa.png";
import imgSpectral18 from "./96d0465c8747fe26ad513649f23c2de9a9ce8ecc.png";

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[20px] inset-[15.63%_-3.73%_28.32%_19.67%] items-center">
      <div className="h-[219px] relative shrink-0 w-[162px]" data-name="Spectral 10">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSpectral10} />
      </div>
      <div className="h-[219px] relative shrink-0 w-[162px]" data-name="Spectral 11">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSpectral11} />
      </div>
      <div className="h-[219px] relative shrink-0 w-[162px]" data-name="Spectral 12">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSpectral12} />
      </div>
      <div className="h-[219px] relative shrink-0 w-[162px]" data-name="Spectral 13">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSpectral13} />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex gap-[20px] inset-[45.01%_-11.7%_-1.06%_11.7%] items-center">
      <div className="h-[219px] relative shrink-0 w-[162px]" data-name="Spectral 14">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSpectral14} />
      </div>
      <div className="h-[219px] relative shrink-0 w-[162px]" data-name="Spectral 15">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSpectral15} />
      </div>
      <div className="h-[219px] relative shrink-0 w-[162px]" data-name="Spectral 16">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSpectral16} />
      </div>
      <div className="h-[219px] relative shrink-0 w-[162px]" data-name="Spectral 8">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSpectral8} />
      </div>
      <div className="h-[219px] relative shrink-0 w-[162px]" data-name="Spectral 18">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSpectral18} />
      </div>
    </div>
  );
}

export default function Spectral() {
  return (
    <button className="block cursor-pointer relative size-full" data-name="Spectral">
      <Frame />
      <Frame1 />
      <div className="absolute inset-[92.13%_33.62%_0_33.71%] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Quit">
        <div className="absolute bg-[#ef4637] inset-0 rounded-[14px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" data-name="button" />
        <div className="absolute bottom-1/4 flex flex-col font-['Rajdhani:Bold',sans-serif] justify-center leading-[0] left-[32.58%] not-italic right-[33.03%] text-[45px] text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] text-white top-[25.86%] tracking-[-2.25px] whitespace-nowrap">
          <p className="leading-[normal]">Page 2/2</p>
        </div>
      </div>
    </button>
  );
}