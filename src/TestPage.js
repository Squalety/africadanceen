import React, { useState, useEffect } from 'react';

const TestPage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadUserInfo();
    loadStats();
  }, []);

  const loadUserInfo = () => {
    const info = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      userAgent: navigator.userAgent
    };
    setUserInfo(info);
  };

  const loadStats = () => {
    const savedStats = localStorage.getItem('clickStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  };

  const clearStats = () => {
    localStorage.removeItem('clickStats');
    setStats([]);
  };

  const testClick = () => {
    const clickData = {
      buttonName: 'Test Button',
      url: 'https://example.com/test',
      timestamp: new Date().toISOString(),
      ip: 'Test-IP',
      country: 'Test-Country',
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const existingStats = JSON.parse(localStorage.getItem('clickStats') || '[]');
    existingStats.push(clickData);
    localStorage.setItem('clickStats', JSON.stringify(existingStats));
    setStats(existingStats);
    
    console.log('Test click saved:', clickData);
    alert('Test click saved! Check console.');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>User Info:</h2>
        <pre style={{ background: '#f0f0f0', padding: '10px' }}>
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testClick} style={{ marginRight: '10px' }}>
          Test Click
        </button>
        <button onClick={clearStats} style={{ marginRight: '10px' }}>
          Clear Stats
        </button>
        <button onClick={loadStats}>
          Reload Stats
        </button>
      </div>

      <div>
        <h2>Stats ({stats.length} clicks):</h2>
        <pre style={{ background: '#f0f0f0', padding: '10px', maxHeight: '300px', overflow: 'auto' }}>
          {JSON.stringify(stats, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestPage; 