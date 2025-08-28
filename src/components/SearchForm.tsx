import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ComboboxAutocomplete } from '@/components/ui/combobox-autocomplete';
import { useStations } from '@/hooks/useStations';

interface SearchFormProps {
  isVisible: boolean;
  onSubmit: (searchData: SearchData) => void;
}

export interface SearchData {
  sourceStation: string;
  destinationStation: string;
  date: string;
  passengers: string;
  preference: string;
}

const SearchForm = ({ isVisible, onSubmit }: SearchFormProps) => {
  const navigate = useNavigate();
  const { filterStations, loading } = useStations();
  const [formData, setFormData] = useState<SearchData>({
    sourceStation: '',
    destinationStation: '',
    date: '',
    passengers: '1',
    preference: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sourceStation && formData.destinationStation && formData.date && formData.preference) {
      onSubmit(formData);
      // Navigate to results page with search data
      navigate('/results', { state: { searchData: formData } });
    }
  };

  const handleInputChange = (field: keyof SearchData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isVisible) return null;

  return (
    <Card className="glass-card p-8 mt-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Source Station */}
          <div className="space-y-2">
            <Label htmlFor="source" className="flex items-center gap-2 text-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              From Station
            </Label>
            <ComboboxAutocomplete
              value={formData.sourceStation}
              onSelect={(value) => handleInputChange('sourceStation', value)}
              filterFunction={filterStations}
              placeholder="Select source station"
              searchPlaceholder="Search stations..."
              emptyText="No stations found."
            />
          </div>

          {/* Destination Station */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center gap-2 text-foreground">
              <MapPin className="w-4 h-4 text-secondary" />
              To Station
            </Label>
            <ComboboxAutocomplete
              value={formData.destinationStation}
              onSelect={(value) => handleInputChange('destinationStation', value)}
              filterFunction={filterStations}
              placeholder="Select destination station"
              searchPlaceholder="Search stations..."
              emptyText="No stations found."
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2 text-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              Journey Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="bg-background/50 border-white/20 focus:border-primary"
              required
            />
          </div>

          {/* Passengers */}
          <div className="space-y-2">
            <Label htmlFor="passengers" className="flex items-center gap-2 text-foreground">
              <Users className="w-4 h-4 text-primary" />
              Passengers
            </Label>
            <Select value={formData.passengers} onValueChange={(value) => handleInputChange('passengers', value)}>
              <SelectTrigger className="bg-background/50 border-white/20">
                <SelectValue placeholder="Select passengers" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preference */}
        <div className="space-y-2">
          <Label htmlFor="preference" className="flex items-center gap-2 text-foreground">
            <Settings className="w-4 h-4 text-primary" />
            Journey Preference
          </Label>
          <Select value={formData.preference} onValueChange={(value) => handleInputChange('preference', value)}>
            <SelectTrigger className="bg-background/50 border-white/20">
              <SelectValue placeholder="Select your preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-journey">Full Journey (Direct Route)</SelectItem>
              <SelectItem value="allow-split">Allow Split (Same Train)</SelectItem>
              <SelectItem value="allow-layover">Allow Layover (Multi-Train)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full btn-hero"
          size="lg"
        >
          Find Routes
        </Button>
      </form>
    </Card>
  );
};

export default SearchForm;