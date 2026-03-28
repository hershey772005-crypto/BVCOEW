import { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import SingleStudentInput from './components/SingleStudentInput';
import DataTable from './components/DataTable';
import ChartView from './components/ChartView';
import ExplanationCard from './components/ExplanationCard';
import Summary from './components/Summary';
import { parseStudents } from './utils/parser';
import { classifyAllStudents, classifyStudent, loadModelConfig, isModelLoaded } from './utils/classifier';
import './index.css';

function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [inputMode, setInputMode] = useState(null); // null, 'csv', 'single'

  // Load trained model configuration on startup
  useEffect(() => {
    loadModelConfig().then(loaded => {
      setModelLoaded(loaded);
      if (!loaded) {
        console.warn('Model not loaded. Run train.py and copy model_config.json to public/');
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
      setInputMode('csv');
    } catch (error) {
      console.error('Error processing data:', error);
      alert('Error processing CSV data');
    }
    setLoading(false);
  };

  const handleSingleStudent = (studentData) => {
    const classified = {
      ...studentData,
      ...classifyStudent(studentData.days)
    };
    setStudents([classified]);
    setSelectedStudent(classified);
    setInputMode('single');
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
  };

  const handleReset = () => {
    setStudents([]);
    setSelectedStudent(null);
    setInputMode(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Study Pattern Classifier</h1>
        <p>ML-powered classification using K-Means clustering + Decision Tree</p>
      </header>

      <main className="app-main">
        {/* Landing: Show both input options */}
        {!inputMode && (
          <section className="landing-section">
            <div className="input-options">
              <div className="option-card">
                <FileUpload onDataLoaded={handleDataLoaded} />
              </div>
              
              <div className="option-divider">
                <span>OR</span>
              </div>
              
              <div className="option-card">
                <SingleStudentInput onSubmit={handleSingleStudent} />
              </div>
            </div>
          </section>
        )}

        {loading && <div className="loading">Processing data...</div>}

        {/* Results view */}
        {students.length > 0 && (
          <>
            <div className="results-header">
              <button onClick={handleReset} className="back-btn">
                ← Back to Input
              </button>
              {inputMode === 'csv' && <Summary students={students} />}
            </div>
            
            <div className="content-grid">
              {inputMode === 'csv' && (
                <section className="table-section">
                  <h2>Student Data ({students.length} students)</h2>
                  <DataTable 
                    students={students} 
                    selectedId={selectedStudent?.id}
                    onSelect={handleSelectStudent}
                  />
                </section>
              )}

              <aside className={`detail-section ${inputMode === 'single' ? 'full-width' : ''}`}>
                <ChartView student={selectedStudent} />
                <ExplanationCard student={selectedStudent} />
              </aside>
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Personalized study pattern classifier</p>
      </footer>
    </div>
  );
}

export default App;
