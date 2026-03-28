/**
 * Parse CSV data into array of student objects
 * Handles any number of day columns dynamically
 * @param {Array} rawData - Raw CSV data from PapaParse
 * @returns {Array} Array of student objects with id and days array
 */
export function parseStudents(rawData) {
  return rawData.map((row, index) => {
    const keys = Object.keys(row);
    const values = Object.values(row);
    
    // Check if first column looks like an ID (non-numeric or contains letters)
    const firstVal = String(values[0]).trim();
    const hasIdColumn = isNaN(parseFloat(firstVal)) || /[a-zA-Z]/.test(firstVal);
    
    // Extract days - all numeric columns
    const days = hasIdColumn 
      ? values.slice(1).map(v => parseFloat(v) || 0)
      : values.map(v => parseFloat(v) || 0);
    
    // Try to find an ID column, otherwise generate one
    const id = row.id || row.student_id || row.ID || row.StudentID || 
               (hasIdColumn ? firstVal : `S${String(index + 1).padStart(3, '0')}`);
    
    return {
      id: id,
      days: days
    };
  });
}
