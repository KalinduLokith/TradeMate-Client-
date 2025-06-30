const Footer = () => {
  return (
    <div className="bg-white text-gray-800 py-6 mt-8 border-t border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-blue-600">Trade Mate</h3>
            <p className="text-sm text-gray-500">
              Your trading performance, tracked and analyzed.
            </p>
          </div>
          <div className="flex space-x-6">
            <a className="text-blue-600 hover:cursor-pointer  hover:text-blue-800">
              Privacy Policy
            </a>
            <a className="text-blue-600  hover:cursor-pointer hover:text-blue-800">
              Terms of Service
            </a>
            <a className="text-blue-600  hover:cursor-pointer hover:text-blue-800">
              Help
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>&copy; 2025 Trade Mate. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
