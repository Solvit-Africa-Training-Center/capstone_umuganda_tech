import React from "react";
import Cardsinfo from "./Cardsinfo";

function Personalinfo() {
  const Cards = [
    {
      image: "Aline.png",
      Name: "Aline Uwizeye",
      Address: "Community Leader, Kigali",
      description:
        "UmugandaTech has revolutionized how we organize community service. The real-time data and communication tools are invaluable.",
    },
    {
      image: "Peter.png",
      Name: "Jean Pierre Nsengimana",
      Address: "Volunteer, Rubavu",
      description:
        "Tracking projects and tracking my hours have been easier. I feel more connected to my community and motivated to serve.",
    },
    {
      image: "chantal.png",
      Name: "Chantal Mukamana",
      Address: "NGO coordinator, Musanze",
      description:
        "The digital certificates are a great way to recognize our volunteers’ hard work. It boosts morale and makes recruitment easier.",
    },
  ];

  return (
    <div className="flex flex-col  p-10  bg-white">
      {/* Title Section */}
      <div className="w-full flex flex-col justify-center text-center  pl-45 pr-45  gap-5">
        <h1 className="text-3xl font-bold ">What Our Community Says</h1>
        <p className="text-[#464646] text-lg mb-10 text-[20px]  ">
            Hear from community leaders and volunteers who are already experiencing
            the positive impact of UmugandaTech
        </p>
      </div>
   

      {/* Horizontal Scroll Cards */}
      <div className="w-full   overflow-x-auto scrollbar-hide">
        <div className="flex gap-6  snap-x snap-mandatory">
          {Cards.map((card, index) => (
            <div key={index} >
              <Cardsinfo
                image={card.image}
                Name={card.Name}
                Address={card.Address}
                description={card.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Personalinfo;
