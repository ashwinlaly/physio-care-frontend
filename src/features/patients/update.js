// useEffect(() => {
//   const fetchAssessment = async () => {
//     setLoading(true);
//     try {
//       const details = await apiRequest(`${endpoint}/patients/${patientId}`, {
//         method: 'GET',
//         auth: true,
//       });
//       setPatientDetails(details);
//
//       // Fetch existing assessment if editing
//       const assessmentId = new URLSearchParams(window.location.search).get('assessmentId');
//       if (assessmentId) {
//         const existingAssessment = await apiRequest(`${endpoint}/assessment/${patientId}/assessments/${assessmentId}`, {
//           method: 'GET',
//           auth: true,
//         });
//         // Populate form with existing data
//         Object.keys(existingAssessment).forEach(key => {
//           setValue(key, existingAssessment[key]);
//         });
//       }
//     } catch (error) {
//       showToast(error.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   if (patientId) {
//     fetchAssessment();
//   }
// }, [patientId, setValue]);


// const handleConfirmSubmit = async () => {
//   try {
//     const assessmentId = new URLSearchParams(window.location.search).get('assessmentId');
//     const method = assessmentId ? 'PUT' : 'POST';
//     const url = assessmentId
//       ? `${endpoint}/assessment/${patientDetails.id}/assessments/${assessmentId}`
//       : `${endpoint}/assessment/${patientDetails.id}/assessments`;
//
//     const response = await apiRequest(url, {
//       method,
//       body: previewData,
//       auth: true,
//     });
//
//     const message = assessmentId ? 'Assessment updated successfully.' : 'Assessment created successfully.';
//     showToast(message, 'info');
//     setShowPreview(false);
//     navigate(`/patients/${patientDetails.id}/assessment`);
//   } catch (error) {
//     showToast(error.message, 'error');
//   }
// };