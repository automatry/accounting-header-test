import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './styles/app.css';
import * as XLSX from 'xlsx';

function App() {
  const [files, setFiles] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [customHeaders, setCustomHeaders] = useState([]);
  const [orgData, setOrgData] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState(null);
  const [relatedCodes, setRelatedCodes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (orgData.length > 0) {
      // Initialize headers and related codes
      const uniqueHeaders = new Set();
      orgData.forEach(org => {
        org.costCodes.forEach(code => {
          uniqueHeaders.add(code);
        });
      });

      const newRelatedCodes = {};
      uniqueHeaders.forEach(header => {
        newRelatedCodes[header] = [header];
      });

      setHeaders([...uniqueHeaders].sort());
      setRelatedCodes(newRelatedCodes);
    }
  }, [orgData]);

  const handleFileUpload = event => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return;
    }
    setLoading(true);
    setError('');
    let orgs = [];
    Array.from(uploadedFiles).forEach((file, index, array) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const arrayBuffer = e.target.result;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          const orgName = file.name.split(/_|\.+/)[0];
          const costCodeData = data
            .filter(entry => entry.Code)
            .map(entry => entry.Code)
            .sort();

          orgs.push({
            name: orgName,
            costCodes: [...new Set(costCodeData.sort())]
          });
          if (orgs.length === array.length) {
            setOrgData(orgs);
            setLoading(false);
          }
        } catch (error) {
          console.error('Processing error:', error);
          setError('Failed to process file: ' + file.name);
          setLoading(false);
        }
      };
      reader.onerror = () => {
        console.error('Read error on file:', file.name);
        setError('Error reading file: ' + file.name);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    });
    setFiles(uploadedFiles);
  };

  const handleSelectHeader = header => {
    setSelectedHeader(header);
  };

  const handleRelatedCodesSelect = (header, code) => {

    // console.log(relatedCodes);
    // console.log(header);
    // console.log(code);

    // console.log(relatedCodes[header]);

    if (!relatedCodes[header]) {
      console.log('Error matching a code with the header.');
      relatedCodes[header] = [];
    }

    if (relatedCodes[header].includes(code)) {
      relatedCodes[header] = relatedCodes[header].filter(c => c !== code);
    } else {
      relatedCodes[header].push(code);
    }


    const updatedHeaders = {...relatedCodes}
    setRelatedCodes(updatedHeaders)

  };

  const handleSetRelatedCodes = () => {
    setMessage('Your custom codes have been set');
    setSelectedHeader(null); // Reset the selection to show all headers again
  };

  const handleFinalizeCodes = () => {
    // setMessage('Your custom codes have been set');
    console.log('Related codes set:', relatedCodes);
  };

  const handleCreateCustomHeader = newHeader => {
    setCustomHeaders(prev => [...prev, newHeader]);
    setRelatedCodes(prev => ({
      ...prev,
      [newHeader]: [newHeader]
    }));
  };

  const handleDeleteCustomHeader = header => {
    setCustomHeaders(prev => prev.filter(h => h !== header));
    setRelatedCodes(prev => {
      const newRelatedCodes = { ...prev };
      delete newRelatedCodes[header];
      return newRelatedCodes;
    });
  };

  const handleReorderHeaders = (newOrder, isCustom) => {
    if (isCustom) {
      setCustomHeaders(newOrder);
    } else {
      setHeaders(newOrder);
    }
  };

  return (
    <div className="app">
      <Header onFileUpload={handleFileUpload} />
      <Sidebar
        headers={headers}
        customHeaders={customHeaders}
        selectedHeader={selectedHeader}
        onSelectHeader={handleSelectHeader}
        onClearSelection={handleSetRelatedCodes}
        onFinalizeCodes={handleFinalizeCodes}
        onCreateCustomHeader={handleCreateCustomHeader}
        onDeleteCustomHeader={handleDeleteCustomHeader}
        onReorderHeaders={handleReorderHeaders}
        message={message}
      />
      <MainContent
        orgData={orgData}
        selectedHeader={selectedHeader}
        relatedCodes={relatedCodes}
        onRelatedCodesSelect={handleRelatedCodesSelect}
      />
      {loading && <p>Loading files...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
