import Image from "next/image";

const Cards = ({ cardName, cardName2, cardLogo, logoAlt }) => {
  return (
    // <div className="w-auto h-fit grid gap-auto backdrop-filter backdrop-blur-sm bg-opacity-10 bg-slate-200 overflow-hidden border border-gray-200 rounded-xl shadow shadow-xl">
    <div className="flex flex-col justify-between h-full backdrop-filter backdrop-blur-sm bg-opacity-10 bg-slate-200 overflow-hidden border border-gray-200 rounded-xl shadow shadow-xl">
      <div className="p-1 flex flex-col justify-center items-start content-fit">
        <div className="ml-3 flex flex-col items-start">
          <p className="font-bold text-[24px] xs:text-[40px] sm:text-[50px] text-black">
            {cardName}
          </p>
          <p className=" font-bold text-[24px] xs:text-[40px] sm:text-[50px] text-black">
            {cardName2}
          </p>
        </div>
      </div>
      <div className="ml-3 relative flex top-[10px] xs:top-[10px] sm:top-[30px] md:top-[50px] xs:z-[2] justify-start">
        <Image
          className="rounded-t-lg h-[70px] xs:h-[100px] sm:h-[150px]"
          width={70}
          height={70}
          src={cardLogo}
          alt={logoAlt}
        />
      </div>
    </div>
  );
};
export default Cards;
