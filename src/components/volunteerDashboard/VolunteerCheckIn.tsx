// src/components/volunteerComponents/VolunteerCheckIn/VolunteerCheckInPage.tsx

import React from "react";

const VolunteerCheckInPage: React.FC = () => {
  const handleCheckOut = () => {
    console.log("Checked out");
    // TODO: logic to end session
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow text-center">
      <h2 className="text-2xl font-semibold mb-4">Volunteer Check In</h2>
      <p className="mb-6">You’ve made a difference today.</p>
      <div className="mb-6 flex justify-center">
        <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg">
          {/* Replace with real QR code component if needed */}
          <span className="text-gray-500">QR CODE</span>
        </div>
      </div>
      <div className="text-left space-y-2 max-w-lg mx-auto">
        <p className="font-semibold">How to check in:</p>
        <ol className="list-decimal list-inside ml-4 space-y-1">
          <li>Locate the project’s QR code at the site entrance.</li>
          <li>Align the code within the frame on your screen.</li>
          <li>Scan and verify confirmation.</li>
          <li>Tap the “Check Out” button when your session ends.</li>
        </ol>
      </div>
      <div className="mt-6">
        <button
          onClick={handleCheckOut}
          className="px-6 py-2 bg-red-600 text-white rounded"
        >
          Check Out
        </button>
      </div>
    </div>
  );
};

export default VolunteerCheckInPage;
