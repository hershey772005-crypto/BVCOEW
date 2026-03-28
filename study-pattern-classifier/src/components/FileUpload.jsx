import Papa from 'papaparse';

export default function FileUpload({ onDataLoaded }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onDataLoaded(results.data);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file');
      }
    });
  };

  return (
    <div className="file-upload">
      <label className="upload-btn">
        Upload CSV File
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>
      <p className="upload-hint">Upload a CSV with 5 columns (Day1-Day5 study minutes)</p>
    </div>
  );
}
