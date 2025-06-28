import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmhnhowdaggszlaqzkja.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaG5ob3dkYWdnc3psYXF6a2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MDk1NjIsImV4cCI6MjA2MzM4NTU2Mn0.7yi-VNRhqOPAfygMp8sLJpJ2dWFD4_d0ANZzX3gxbxw'
export const supabase = createClient(supabaseUrl, supabaseKey)
