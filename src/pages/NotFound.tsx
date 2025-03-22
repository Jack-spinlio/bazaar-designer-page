
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileAxis3d } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6 glassmorphism rounded-xl">
        <div className="w-20 h-20 bg-app-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileAxis3d size={40} className="text-app-blue" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-app-gray-dark">404</h1>
        <p className="text-xl text-app-gray mb-6">Page not found</p>
        <p className="text-app-gray-light mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-app-blue hover:bg-app-blue-light">
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
