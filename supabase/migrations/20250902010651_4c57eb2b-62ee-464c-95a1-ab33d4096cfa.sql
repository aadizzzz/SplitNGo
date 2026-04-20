-- Add columns to bookings table for passenger details and ID information
ALTER TABLE public.bookings 
ADD COLUMN passenger_details JSONB,
ADD COLUMN primary_id_type TEXT DEFAULT 'aadhaar',
ADD COLUMN primary_id_number TEXT;

-- Add check constraint for valid ID types
ALTER TABLE public.bookings 
ADD CONSTRAINT valid_id_type 
CHECK (primary_id_type IN ('aadhaar', 'pan', 'voter_id', 'driving_license', 'passport'));

-- Create index for faster ID lookups
CREATE INDEX idx_bookings_id_type_number ON public.bookings(primary_id_type, primary_id_number);

-- Update the bookings table comment
COMMENT ON COLUMN public.bookings.passenger_details IS 'JSON object containing passenger information including names, ages, etc';
COMMENT ON COLUMN public.bookings.primary_id_type IS 'Type of primary ID document (aadhaar, pan, voter_id, driving_license, passport)';
COMMENT ON COLUMN public.bookings.primary_id_number IS 'Primary ID document number';