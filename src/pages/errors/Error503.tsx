import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";

export default function Error503() {
  const handleRetryLater = () => {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
      <Moon className="w-20 h-20 text-accent animate-pulse mb-4" />
      <h1 className="text-5xl font-bold mb-2 gradient-text">503</h1>
      <p className="text-lg mb-2 text-muted-foreground">Our service is on a short break 💤</p>
      <p className="text-sm mb-6 text-muted-foreground max-w-md">
        The railway station is temporarily closed for maintenance.
      </p>
      <Button 
        className="px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
        onClick={handleRetryLater}
      >
        Retry Later
      </Button>
    </div>
  );
}