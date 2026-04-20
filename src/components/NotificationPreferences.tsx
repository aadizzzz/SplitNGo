import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface NotificationSettings {
  seatAvailability: boolean;
  bookingConfirmations: boolean;
  priceChanges: boolean;
  routeUpdates: boolean;
  emailNotifications: boolean;
}

export const NotificationPreferences = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    seatAvailability: true,
    bookingConfirmations: true,
    priceChanges: true,
    routeUpdates: true,
    emailNotifications: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("notification_preferences")
      .eq("user_id", user.id)
      .single();

    if (profile?.notification_preferences) {
      setSettings(profile.notification_preferences as unknown as NotificationSettings);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ notification_preferences: settings as any })
      .eq("user_id", user.id);

    setLoading(false);

    if (error) {
      toast.error("Failed to save preferences");
    } else {
      toast.success("Notification preferences saved");
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose which notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="seat-availability">Seat Availability Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when seats become available on your watched routes
            </p>
          </div>
          <Switch
            id="seat-availability"
            checked={settings.seatAvailability}
            onCheckedChange={() => handleToggle("seatAvailability")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="booking-confirmations">Booking Confirmations</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about your booking status
            </p>
          </div>
          <Switch
            id="booking-confirmations"
            checked={settings.bookingConfirmations}
            onCheckedChange={() => handleToggle("bookingConfirmations")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="price-changes">Price Changes</Label>
            <p className="text-sm text-muted-foreground">
              Get alerted when ticket prices change for your routes
            </p>
          </div>
          <Switch
            id="price-changes"
            checked={settings.priceChanges}
            onCheckedChange={() => handleToggle("priceChanges")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="route-updates">Route Updates</Label>
            <p className="text-sm text-muted-foreground">
              Be informed about changes to train routes and schedules
            </p>
          </div>
          <Switch
            id="route-updates"
            checked={settings.routeUpdates}
            onCheckedChange={() => handleToggle("routeUpdates")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Also receive notifications via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={settings.emailNotifications}
            onCheckedChange={() => handleToggle("emailNotifications")}
          />
        </div>

        <Button onClick={savePreferences} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
};
