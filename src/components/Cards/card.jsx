import Image from "next/image";

const Cards = ({
  cardName,
  cardName2,
  cardLogo,
  logoAlt,
  bgColor,
  textColor,
}) => {
  return (
    <div
      className={`${bgColor} flex flex-row py-4 w-full h-full justify-around items-center px-8 rounded-xl shadow shadow-xl border-4 border-gray-900 bg-white hover:scale-105 transition-transform duration-300 ease-in-out`}
    >
      <div className="ml-3 relative flex xs:z-[2] justify-start">
        <Image
          className="rounded-t-lg h-[70px] xs:h-[100px] sm:h-[150px]"
          width={90}
          height={90}
          src={cardLogo}
          alt={logoAlt}
        />
      </div>
      <div className="p-1 flex flex-col justify-center items-start content-fit">
        <div className="ml-3 flex flex-col items-start">
          <p
            className={`${textColor} font-bold text-[24px] xs:text-[40px] sm:text-[50px]`}
          >
            {cardName}
          </p>
          <p
            className={`${textColor} font-bold text-[24px] xs:text-[40px] sm:text-[50px]`}
          >
            {cardName2}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Cards;
