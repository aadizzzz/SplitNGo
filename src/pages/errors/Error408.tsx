import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function Error408() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
      <Clock className="w-20 h-20 text-secondary animate-spin mb-4" />
      <h1 className="text-5xl font-bold mb-2 gradient-text">408</h1>
      <p className="text-lg mb-2 text-muted-foreground">This train is delayed ⏳</p>
      <p className="text-sm mb-6 text-muted-foreground max-w-md">
        The request took too long to process. Let's try again.
      </p>
      <Button 
        className="px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
        onClick={handleRefresh}
      >
        Refresh
      </Button>
    </div>
  );
}