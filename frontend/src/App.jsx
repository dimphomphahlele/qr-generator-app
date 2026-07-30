import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

function App() {
  const [text, setText] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQR = async (e) => {
    e.preventDefault();
    if (!text) {
      setError('Please enter some text or URL');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/generate', { text });
      setQrImage(`data:image/png;base64,${response.data.image}`);
    } catch (err) {
      setError('Failed to generate QR code');
    }
    setLoading(false);
  };

  const downloadQR = () => {
    if (!qrImage) return;
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>✨ QR Code Generator</h1>
      <form onSubmit={generateQR} style={styles.form}>
        <input
          type="text"
          placeholder="Enter text or URL..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {qrImage && (
        <div style={styles.result}>
          <img src={qrImage} alt="QR Code" style={styles.image} />
          <button onClick={downloadQR} style={styles.downloadBtn}>
            ⬇️ Download PNG
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    background: '#f9fafb',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '32px',
    color: '#1e293b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '20px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  result: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  image: {
    border: '4px solid #e2e8f0',
    borderRadius: '12px',
    maxWidth: '250px',
  },
  downloadBtn: {
    padding: '10px 24px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    color: '#dc2626',
    marginTop: '10px',
  },
};

export default App;