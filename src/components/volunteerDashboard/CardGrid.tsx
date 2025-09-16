import React from "react";
import Card from "./Card";
import { sampleCards } from "./data/sampleCards";
import type { CardData } from "../../types/Volunteer";

const CardGrid: React.FC = () => {
  const cardsToDisplay: CardData[] = [];
  while (cardsToDisplay.length < 9) {
    sampleCards.forEach((c) => {
      if (cardsToDisplay.length < 9) {
        cardsToDisplay.push({ ...c, id: cardsToDisplay.length + 1 });
      }
    });
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
        {cardsToDisplay.map((card) => (
          <Card key={card.id} data={card} />
        ))}
      </div>
    </div>
  );
};

export default CardGrid;
