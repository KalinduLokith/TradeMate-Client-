import { AlertCircle } from "lucide-react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900">
      <div className="container flex max-w-md flex-col items-center text-center">
        <AlertCircle className="h-16 w-16 text-blue-600 mb-6" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-blue-600 mb-4">
          404
        </h1>
        <p className="text-xl font-semibold mb-6 text-gray-800">
          Oops! Page not found
        </p>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Button
          variant="contained"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};
