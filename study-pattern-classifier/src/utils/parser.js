/**
 * Parse CSV data into array of student objects
 * @param {Array} rawData - Raw CSV data from PapaParse
 * @returns {Array} Array of student objects with id and days array
 */
export function parseStudents(rawData) {
  return rawData.map((row, index) => {
    const values = Object.values(row);
    const days = values.slice(0, 5).map(v => parseFloat(v) || 0);
    
    // Try to find an ID column, otherwise generate one
    const id = row.id || row.student_id || row.ID || row.StudentID || `S${String(index + 1).padStart(3, '0')}`;
    
    return {
      id: id,
      days: days
    };
  });
}
