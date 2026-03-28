import { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import ChartView from './components/ChartView';
import ExplanationCard from './components/ExplanationCard';
import Summary from './components/Summary';
import { parseStudents } from './utils/parser';
import { classifyAllStudents, loadModelConfig } from './utils/classifier';
import './index.css';

function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Load trained model configuration on startup
  useEffect(() => {
    loadModelConfig().then(loaded => {
      setModelLoaded(loaded);
      if (loaded) {
        console.log('Trained model configuration loaded successfully');
      }
    });
  }, []);

  const handleDataLoaded = (rawData) => {
    setLoading(true);
    try {
      const parsed = parseStudents(rawData);
      const classified = classifyAllStudents(parsed);
      setStudents(classified);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error processing data:', error);
      alert('Error processing CSV data');
    }
    setLoading(false);
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Study Pattern Classifier</h1>
        <p>ML-powered classification using K-Means clustering + Decision Tree</p>
        {modelLoaded && <span className="model-badge">✓ Trained Model Active</span>}
      </header>

      <main className="app-main">
        <section className="upload-section">
          <FileUpload onDataLoaded={handleDataLoaded} />
        </section>

        {loading && <div className="loading">Processing data...</div>}

        {students.length > 0 && (
          <>
            <Summary students={students} />
            
            <div className="content-grid">
              <section className="table-section">
                <h2>Student Data</h2>
                <DataTable 
                  students={students} 
                  selectedId={selectedStudent?.id}
                  onSelect={handleSelectStudent}
                />
              </section>

              <aside className="detail-section">
                <ChartView student={selectedStudent} />
                <ExplanationCard student={selectedStudent} />
              </aside>
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with Python (scikit-learn) + React • K-Means Clustering • Decision Tree Classification</p>
      </footer>
    </div>
  );
}

export default App;
