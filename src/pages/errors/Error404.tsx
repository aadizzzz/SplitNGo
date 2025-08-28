import { Button } from "@/components/ui/button";
import { Train } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
      <Train className="w-20 h-20 text-primary animate-bounce mb-4" />
      <h1 className="text-5xl font-bold mb-2 gradient-text">404</h1>
      <p className="text-lg mb-2 text-muted-foreground">This train missed its station 🚉</p>
      <p className="text-sm mb-6 text-muted-foreground max-w-md">
        The route you're looking for doesn't exist on our railway network.
      </p>
      <Button 
        className="px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </div>
  );
}