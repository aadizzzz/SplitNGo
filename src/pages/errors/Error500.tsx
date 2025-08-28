import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

export default function Error500() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
      <Wrench className="w-20 h-20 text-destructive animate-pulse mb-4" />
      <h1 className="text-5xl font-bold mb-2 text-destructive">500</h1>
      <p className="text-lg mb-2 text-muted-foreground">Track maintenance in progress 🔧</p>
      <p className="text-sm mb-6 text-muted-foreground max-w-md">
        Our engineers are working to get the trains running smoothly again.
      </p>
      <Button 
        className="px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
        onClick={handleRetry}
      >
        Retry
      </Button>
    </div>
  );
}