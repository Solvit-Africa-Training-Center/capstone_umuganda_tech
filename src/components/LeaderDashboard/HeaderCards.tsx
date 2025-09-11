import React from 'react';
import type { StatCard } from '../../types/LeaderDashboard';
import totalactivityIcon1 from "../../images/leaderdash/total1.png"
import totalactivityIcon2 from "../../images/leaderdash/total2.png"
import totalactivityIcon3 from "../../images/leaderdash/total3.png"
import totalactivityIcon4 from "../../images/leaderdash/total4.png"

interface HeaderCardsProps {
  stats: StatCard[];
}

const icons = [totalactivityIcon1, totalactivityIcon2, totalactivityIcon3, totalactivityIcon4];

const HeaderCards: React.FC<HeaderCardsProps> = ({ stats }) => (
  <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
    {stats.map((card) => (
      <div key={card.label} className="bg-white shadow p-4 rounded">
        <div className='flex   flex-row items-center justify-between mb-2'>
          <img src={icons[stats.indexOf(card) % icons.length]} alt={`${card.label} icon`} className="h-6 w-6 mb-2" />
           <div className={`text-2xl font-semibold ${
          card.status === 'good' ? 'text-green-500' :
          card.status === 'warning' ? 'text-error-900' :
          card.status === 'critical' ? 'text-red-500' : ''
        }`}>
          {card.value}
        </div>
        </div>
        <div className="text-sm text-gray-500">{card.label}</div>
      </div>
    ))}
  </div>
);

export default HeaderCards;
