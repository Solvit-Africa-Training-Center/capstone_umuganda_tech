import React, { useRef } from "react";
import Cardsinfo from "./Cardsinfo";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

function Personalinfo() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    {
      image: "chantal.png",
      Name: "David Byiringiro",
      Address: "Student Volunteer,Ruhango",
      description:
        "As a student,the gamification  aspect makes volunteering fun and engaging.I love seeing my progress and earning badges",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -350 : 350,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col p-10 bg-white font-opensans relative">
      {/* Title Section */}
      <div className="w-full flex flex-col justify-center text-center gap-5">
        <h1 className="text-h1 font-bold">What Our Community Says</h1>
        <p className="text-[#464646] text-lg mb-10 text-[20px]">
          Hear from community leaders and volunteers who are already experiencing
          the positive impact of UmugandaTech
        </p>
      </div>

      {/* Horizontal Scroll Cards with Side Icons */}
      <div className="relative">
        {/* Left Icon */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100"
        >
          <MdChevronLeft size={30} />
        </button>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-hidden scrollbar-hide"
        >
          <div className="flex gap-6 snap-x snap-mandatory">
            {Cards.map((card, index) => (
              <div key={index}>
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

        {/* Right Icon */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100"
        >
          <MdChevronRight size={30} />
        </button>
      </div>
    </div>
  );
}

export default Personalinfo;
