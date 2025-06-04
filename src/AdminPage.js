import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [stats, setStats] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [currentIP, setCurrentIP] = useState('Loading...');

  const adminPassword = 'admin123'; // В продакшене лучше использовать более безопасный способ

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      getCurrentIP();
      // Обновляем статистику каждые 10 секунд
      const interval = setInterval(loadStats, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const getCurrentIP = async () => {
    try {
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      setCurrentIP(data.ip || 'Unknown');
    } catch (error) {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setCurrentIP(data.ip || 'Unknown');
      } catch (error2) {
        setCurrentIP('Unknown');
      }
    }
  };

  const loadStats = () => {
    const savedStats = localStorage.getItem('clickStats');
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        // Обновляем старые записи, добавляя недостающие поля
        const updatedStats = parsedStats.map(stat => ({
          ...stat,
          platform: stat.platform || 'Unknown',
          language: stat.language || 'Unknown',
          timezone: stat.timezone || 'Unknown'
        }));
        setStats(updatedStats);
      } catch (error) {
        console.error('Error parsing stats:', error);
        setStats([]);
      }
    }
  };

  const handleLogin = () => {
    if (password === adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Неверный пароль');
    }
  };

  const clearStats = () => {
    if (window.confirm('Вы уверены, что хотите очистить всю статистику?')) {
      localStorage.removeItem('clickStats');
      setStats([]);
    }
  };

  const exportStats = () => {
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `click_stats_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const filterStatsByTimeframe = (stats) => {
    if (selectedTimeframe === 'all') return stats;
    
    const now = new Date();
    const timeframeDays = {
      'today': 1,
      'week': 7,
      'month': 30
    };
    
    const daysBack = timeframeDays[selectedTimeframe];
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    return stats.filter(stat => new Date(stat.timestamp) >= cutoffDate);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>Admin Login</h2>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}>Войти</button>
        </div>
      </div>
    );
  }

  const filteredStats = filterStatsByTimeframe(stats);
  
  const groupedStats = filteredStats.reduce((acc, stat) => {
    const key = stat.buttonName;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(stat);
    return acc;
  }, {});

  const urlStats = filteredStats.reduce((acc, stat) => {
    const url = stat.url;
    if (!acc[url]) {
      acc[url] = {
        url,
        buttonName: stat.buttonName,
        clicks: 0,
        uniqueIPs: new Set(),
        countries: new Set(),
        lastClick: null
      };
    }
    acc[url].clicks++;
    acc[url].uniqueIPs.add(stat.ip);
    acc[url].countries.add(stat.country);
    if (!acc[url].lastClick || new Date(stat.timestamp) > new Date(acc[url].lastClick)) {
      acc[url].lastClick = stat.timestamp;
    }
    return acc;
  }, {});

  const countryStats = filteredStats.reduce((acc, stat) => {
    const country = stat.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const platformStats = filteredStats.reduce((acc, stat) => {
    const platform = stat.platform || 'Unknown';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="header-info">
          <h1>Admin Panel - Click Statistics</h1>
          <div className="current-session">
            <span className="current-ip">Your IP: {currentIP}</span>
            <span className="last-update">Last update: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="admin-controls">
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="timeframe-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <div className="admin-actions">
            <button onClick={exportStats} className="export-btn">Export JSON</button>
            <button onClick={clearStats} className="clear-btn">Clear Stats</button>
          </div>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Clicks</h3>
          <div className="stat-number">{filteredStats.length}</div>
        </div>
        <div className="stat-card">
          <h3>Unique IPs</h3>
          <div className="stat-number">{new Set(filteredStats.map(s => s.ip)).size}</div>
        </div>
        <div className="stat-card">
          <h3>Countries</h3>
          <div className="stat-number">{Object.keys(countryStats).length}</div>
        </div>
        <div className="stat-card">
          <h3>Conversion Rate</h3>
          <div className="stat-number">{((filteredStats.length / (filteredStats.length + 100)) * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="stats-section">
        <h2>🔗 Performance by Links</h2>
        <div className="url-stats-grid">
          {Object.values(urlStats)
            .sort((a, b) => b.clicks - a.clicks)
            .map((urlStat) => (
              <div key={urlStat.url} className="url-stat-card">
                <div className="url-header">
                  <h4>{urlStat.buttonName}</h4>
                  <span className="url-link">{urlStat.url}</span>
                </div>
                <div className="url-metrics">
                  <div className="metric">
                    <span className="metric-label">Clicks:</span>
                    <span className="metric-value">{urlStat.clicks}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Unique IPs:</span>
                    <span className="metric-value">{urlStat.uniqueIPs.size}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Countries:</span>
                    <span className="metric-value">{urlStat.countries.size}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Last Click:</span>
                    <span className="metric-value">
                      {urlStat.lastClick ? new Date(urlStat.lastClick).toLocaleString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="stats-section">
        <h2>🌍 Clicks by Country</h2>
        <div className="country-stats">
          {Object.entries(countryStats)
            .sort(([,a], [,b]) => b - a)
            .map(([country, count]) => (
              <div key={country} className="country-item">
                <span className="country-name">{country}</span>
                <span className="country-count">{count}</span>
                <span className="country-percentage">
                  ({((count / filteredStats.length) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="stats-section">
        <h2>💻 Platform Statistics</h2>
        <div className="platform-stats">
          {Object.entries(platformStats)
            .sort(([,a], [,b]) => b - a)
            .map(([platform, count]) => (
              <div key={platform} className="platform-item">
                <span className="platform-name">{platform}</span>
                <span className="platform-count">{count}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="stats-section">
        <h2>📊 Detailed Click History</h2>
        {Object.entries(groupedStats).map(([buttonName, clicks]) => (
          <div key={buttonName} className="button-stats">
            <h3>{buttonName}</h3>
            <p>Total clicks: <strong>{clicks.length}</strong></p>
            <div className="clicks-table">
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>IP Address</th>
                    <th>Country</th>
                    <th>Platform</th>
                    <th>Language</th>
                    <th>User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {clicks.slice(-50).reverse().map((click, index) => (
                    <tr key={index}>
                      <td>{new Date(click.timestamp).toLocaleString()}</td>
                      <td className="ip-cell">{click.ip}</td>
                      <td>{click.country || 'Unknown'}</td>
                      <td>{click.platform || 'Unknown'}</td>
                      <td>{click.language || 'Unknown'}</td>
                      <td title={click.userAgent} className="ua-cell">
                        {click.userAgent?.substring(0, 60)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage; 