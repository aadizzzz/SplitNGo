-- Add missing train and seat information columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN train_no TEXT,
ADD COLUMN train_name TEXT,
ADD COLUMN coach_no TEXT,
ADD COLUMN seat_no TEXT,
ADD COLUMN seat_type TEXT;

-- Update existing bookings with default values
UPDATE public.bookings 
SET 
  train_no = '12345',
  train_name = 'Express Train',
  coach_no = 'S1', 
  seat_no = '1',
  seat_type = 'Window'
WHERE train_no IS NULL;