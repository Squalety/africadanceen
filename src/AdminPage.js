import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [stats, setStats] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const adminPassword = 'admin123';

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      // Обновляем статистику каждые 5 секунд
      const interval = setInterval(loadStats, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadStats = () => {
    const savedStats = localStorage.getItem('clickStats');
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setStats(parsedStats);
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

  const addTestClick = () => {
    const testClick = {
      buttonName: 'Test Button',
      url: 'https://test.com',
      timestamp: new Date().toISOString()
    };
    
    const existingStats = JSON.parse(localStorage.getItem('clickStats') || '[]');
    existingStats.push(testClick);
    localStorage.setItem('clickStats', JSON.stringify(existingStats));
    loadStats();
    console.log('✅ Test click added:', testClick);
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

  // Группируем клики по ссылкам
  const linkStats = stats.reduce((acc, stat) => {
    const key = stat.buttonName || 'Unknown Button';
    if (!acc[key]) {
      acc[key] = {
        buttonName: key,
        url: stat.url || 'Unknown URL',
        clicks: 0,
        mobileClicks: 0,
        desktopClicks: 0,
        lastClick: null
      };
    }
    acc[key].clicks++;
    
    // Подсчитываем мобильные и десктопные клики
    if (stat.isMobile === true) {
      acc[key].mobileClicks++;
    } else {
      acc[key].desktopClicks++;
    }
    
    if (!acc[key].lastClick || new Date(stat.timestamp) > new Date(acc[key].lastClick)) {
      acc[key].lastClick = stat.timestamp;
    }
    return acc;
  }, {});

  const mobileStats = stats.filter(stat => stat.isMobile === true);
  const desktopStats = stats.filter(stat => stat.isMobile !== true);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="header-info">
          <h1>Click Statistics</h1>
          <div className="current-session">
            <span className="total-clicks">Total Clicks: {stats.length}</span>
            <span className="mobile-clicks">📱 Mobile: {mobileStats.length}</span>
            <span className="desktop-clicks">🖥️ Desktop: {desktopStats.length}</span>
            <span className="last-update">Last update: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="admin-actions">
          <button onClick={addTestClick} className="test-btn">Add Test Click</button>
          <button onClick={exportStats} className="export-btn">Export JSON</button>
          <button onClick={clearStats} className="clear-btn">Clear Stats</button>
        </div>
      </div>

      <div className="stats-section">
        <h2>🔗 Clicks by Links</h2>
        {Object.keys(linkStats).length === 0 ? (
          <div className="no-data">No clicks recorded yet</div>
        ) : (
          <div className="links-grid">
            {Object.values(linkStats)
              .sort((a, b) => b.clicks - a.clicks)
              .map((linkStat) => (
                <div key={linkStat.buttonName} className="link-card">
                  <div className="link-header">
                    <h3>{linkStat.buttonName}</h3>
                    <div className="click-count">{linkStat.clicks}</div>
                  </div>
                  <div className="link-url">{linkStat.url}</div>
                  <div className="click-breakdown">
                    <span>📱 Mobile: {linkStat.mobileClicks}</span>
                    <span>🖥️ Desktop: {linkStat.desktopClicks}</span>
                  </div>
                  <div className="last-click">
                    Last click: {linkStat.lastClick ? 
                      new Date(linkStat.lastClick).toLocaleString() : 'Never'}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 