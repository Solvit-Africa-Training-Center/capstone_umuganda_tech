import React from 'react';
import { Clock, CheckCircle, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PendingApproval: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Application Under Review
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your leader application has been submitted successfully and is currently under review by our admin team.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-800">What happens next?</p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Admin reviews your verification document</li>
                <li>• Background verification process</li>
                <li>• Email notification upon approval</li>
                <li>• Access to leader dashboard</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mb-6">
          <p>Review typically takes 1-3 business days</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/signin')}
            className="w-full bg-primaryColor-600 text-white py-3 px-4 rounded-lg hover:bg-primaryColor-700 transition-colors font-medium"
          >
            Back to Sign In
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Return to Home
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Need help?</p>
          <div className="flex justify-center gap-4 text-sm">
            <a href="mailto:support@umugandatech.rw" className="flex items-center gap-1 text-primaryColor-600 hover:text-primaryColor-700">
              <Mail className="w-4 h-4" />
              Email Support
            </a>
            <a href="tel:+250788123456" className="flex items-center gap-1 text-primaryColor-600 hover:text-primaryColor-700">
              <Phone className="w-4 h-4" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;