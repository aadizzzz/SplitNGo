import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";

export default function ErrorOffline() {
  const handleReconnect = () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      alert("Please check your internet connection and try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
      <WifiOff className="w-20 h-20 text-muted-foreground animate-pulse mb-4" />
      <h1 className="text-5xl font-bold mb-2 text-muted-foreground">Offline</h1>
      <p className="text-lg mb-2 text-muted-foreground">No internet signal 📡</p>
      <p className="text-sm mb-6 text-muted-foreground max-w-md">
        The train communication system is down. Check your connection.
      </p>
      <Button 
        className="px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
        onClick={handleReconnect}
      >
        Reconnect
      </Button>
    </div>
  );
}