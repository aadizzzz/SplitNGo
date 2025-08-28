import { useEffect, useState } from 'react';
import { Train, MapPin } from 'lucide-react';

interface LoadingTransitionProps {
  isVisible: boolean;
  onComplete: () => void;
}

const LoadingTransition = ({ isVisible, onComplete }: LoadingTransitionProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Animated Train Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto relative">
            <Train className="w-24 h-24 text-primary animate-pulse" />
            <div className="absolute inset-0 w-24 h-24 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
          </div>
          
          {/* Railway Track Animation */}
          <div className="mt-8 relative">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {/* Station Points */}
            <div className="flex justify-between mt-2">
              <MapPin className={`w-4 h-4 ${progress > 0 ? 'text-primary' : 'text-muted-foreground'} transition-colors`} />
              <MapPin className={`w-4 h-4 ${progress > 50 ? 'text-primary' : 'text-muted-foreground'} transition-colors`} />
              <MapPin className={`w-4 h-4 ${progress > 100 ? 'text-primary' : 'text-muted-foreground'} transition-colors`} />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold gradient-text">
            Planning your smartest journey...
          </h3>
          <div className="text-muted-foreground space-y-2">
            <p className={`transition-opacity duration-500 ${progress > 20 ? 'opacity-100' : 'opacity-50'}`}>
              🔍 Analyzing thousands of route combinations
            </p>
            <p className={`transition-opacity duration-500 ${progress > 50 ? 'opacity-100' : 'opacity-50'}`}>
              🚄 Finding the best split and layover options
            </p>
            <p className={`transition-opacity duration-500 ${progress > 80 ? 'opacity-100' : 'opacity-50'}`}>
              ✨ Optimizing your travel experience
            </p>
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="text-sm text-muted-foreground">
          {Math.round(progress)}% Complete
        </div>
      </div>
    </div>
  );
};

export default LoadingTransition;