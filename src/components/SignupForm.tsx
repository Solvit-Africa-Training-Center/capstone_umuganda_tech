import React, {type FormEvent, useState } from 'react';

const Signup: React.FC = () => {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(`Confirmation code sent to: ${phone}`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center bg-amber-200">
      {/* Left side image */}
      <div className="hidden md:block w-full md:w-1/2 h-full">
        <img
          src="/your-image.jpg"
          alt="Volunteering"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white shadow-md p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            Welcome to UmugandaTech
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Join the community together!
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              className="w-full px-16 py-3 bg-primaryColor-900 hover:bg-accent-900 rounded-lg text-lg font-semibold text-white transition mb-4"
            >
              Join as Volunteer
            </button>
            <div className="text-center text-gray-500 mb-2">— OR —</div>
            <input
              type="tel"
              placeholder="e.g. +250788123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primaryColor-900"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primaryColor-900 hover:bg-accent-900 text-white rounded-lg text-lg font-semibold transition"
            >
              Continue
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            By volunteering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
