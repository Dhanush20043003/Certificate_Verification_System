// frontend/src/components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0e27',
          color: 'white',
          padding: '20px',
          fontFamily: 'monospace'
        }}>
          <div style={{
            maxWidth: '600px',
            background: 'rgba(255, 0, 102, 0.1)',
            border: '2px solid #ff0066',
            borderRadius: '12px',
            padding: '30px',
          }}>
            <h1 style={{ color: '#ff0066', marginBottom: '20px' }}>⚠️ Something Went Wrong</h1>
            <h3>Error Details:</h3>
            <pre style={{
              background: 'rgba(0, 0, 0, 0.5)',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '12px',
              color: '#00baff'
            }}>
              {this.state.error && this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: '#00baff',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;