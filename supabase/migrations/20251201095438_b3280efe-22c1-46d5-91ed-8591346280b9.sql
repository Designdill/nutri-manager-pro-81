-- Add RLS policy for patients to view their own consultations
CREATE POLICY "Patients can view their own consultations"
ON consultations
FOR SELECT
USING (patient_id = get_patient_id_from_auth());

-- Add RLS policy for patients to view their own photos
CREATE POLICY "Patients can view their own photos"
ON patient_photos
FOR SELECT
USING (patient_id = get_patient_id_from_auth());