import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Error401() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
      <Ticket className="w-20 h-20 text-accent animate-bounce mb-4" />
      <h1 className="text-5xl font-bold mb-2 gradient-text">401</h1>
      <p className="text-lg mb-2 text-muted-foreground">You need a ticket 🎫 to enter</p>
      <p className="text-sm mb-6 text-muted-foreground max-w-md">
        Please authenticate to access this part of our railway network.
      </p>
      <Button 
        className="px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
        onClick={() => navigate("/auth")}
      >
        Login
      </Button>
    </div>
  );
}