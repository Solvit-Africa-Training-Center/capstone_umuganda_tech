import React from "react";
import  QrCode  from "../../images/volunteer/QR code.png";

const VolunteerCheckInPage: React.FC = () => {
  const handleCheckOut = () => {
    console.log("Checked out");
    // logic to end session
  };

  return (
    <div className="bg-primaryColor-200 w-full min-h-screen flex items-center justify-center pt-14">
      <div className="flex flex-col items-center justify-center bg-white w-full  rounded text-center border-t border-[#B1AEAE]">
        <h2 className="text-h2 font-semibold mb-2 text-center">You’ve made a difference today.</h2>
      <p className="mb-1 text-center">
        Check in to record your impact. Scan the QR code to log your attendance.
      </p>
      <div className="mb-6 flex justify-center">
        <div className="w-60 h-60 bg-white flex items-center justify-center rounded-lg">
          <img src={QrCode} alt="QR Code" />
        </div>
      </div>
      <div className="text-left space-y-2 max-w-lg mx-auto">
        <p className=" text-h4 font-semibold">How to check in:</p>
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
    </div>
  );
};

export default VolunteerCheckInPage;
