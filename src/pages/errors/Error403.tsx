import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Error403() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
      <ShieldX className="w-20 h-20 text-destructive animate-pulse mb-4" />
      <h1 className="text-5xl font-bold mb-2 text-destructive">403</h1>
      <p className="text-lg mb-2 text-muted-foreground">Wrong platform 🚫</p>
      <p className="text-sm mb-6 text-muted-foreground max-w-md">
        You don't have permission to board this train.
      </p>
      <Button 
        className="px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
    </div>
  );
}