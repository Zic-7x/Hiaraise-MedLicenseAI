-- Migration: Create exam-documents storage bucket
-- This creates a storage bucket for exam pass documents

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exam-documents',
  'exam-documents',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
);

-- Create RLS policies for the bucket
CREATE POLICY "Public read access for exam documents" ON storage.objects
FOR SELECT USING (bucket_id = 'exam-documents');

CREATE POLICY "Admin upload access for exam documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'exam-documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admin update access for exam documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'exam-documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admin delete access for exam documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'exam-documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);
