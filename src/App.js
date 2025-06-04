import React, { useState, useEffect } from 'react';
import './App.css';
import { FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';
import { FaEthereum } from 'react-icons/fa';
import { SiTether, SiSolana } from 'react-icons/si';

function App() {
  const [copiedWallet, setCopiedWallet] = useState('');
  const [userInfo, setUserInfo] = useState({});

  const wallets = [
    {
      name: 'Solana (SOL)',
      address: '3Pv2AV8ZtttGVTVmDTS82tA9TQBxrmdThWF3q5FyMhti',
      icon: SiSolana,
      color: '#9945ff'
    },
    {
      name: 'Ethereum (ETH)',
      address: '0x08e6FE2576c90159C4b86fD00bB895a3Ca840c96',
      icon: FaEthereum,
      color: '#627eea'
    },
    {
      name: 'Tether (USDT)',
      address: '0x08e6FE2576c90159C4b86fD00bB895a3Ca840c96',
      icon: SiTether,
      color: '#26a17b'
    }
  ];

  const gameDatingButtons = [
    {
      name: 'Game Dating Premium',
      url: 'https://example.com/game-dating-1',
      color: '#ff6b6b'
    },
    {
      name: 'Game Dating VIP',
      url: 'https://example.com/game-dating-2',
      color: '#4ecdc4'
    }
  ];

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      // Пробуем несколько способов получения IP
      let ipData = null;
      let geoData = null;

      // Способ 1: ipify.org
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        ipData = await ipResponse.json();
      } catch (error) {
        console.log('ipify.org failed, trying alternative...');
      }

      // Способ 2: httpbin.org (если первый не сработал)
      if (!ipData) {
        try {
          const ipResponse = await fetch('https://httpbin.org/ip');
          const data = await ipResponse.json();
          ipData = { ip: data.origin.split(',')[0].trim() };
        } catch (error) {
          console.log('httpbin.org failed, trying alternative...');
        }
      }

      // Способ 3: ipinfo.io (если предыдущие не сработали)
      if (!ipData) {
        try {
          const ipResponse = await fetch('https://ipinfo.io/json');
          const data = await ipResponse.json();
          ipData = { ip: data.ip };
          geoData = { country_name: data.country };
        } catch (error) {
          console.log('ipinfo.io failed...');
        }
      }

      // Если у нас есть IP, но нет геоданных, пробуем получить их
      if (ipData && ipData.ip && !geoData) {
        try {
          // Пробуем ip-api.com (бесплатный, без ключа)
          const geoResponse = await fetch(`http://ip-api.com/json/${ipData.ip}`);
          const data = await geoResponse.json();
          if (data.status === 'success') {
            geoData = { country_name: data.country };
          }
        } catch (error) {
          console.log('ip-api.com failed, trying alternative...');
        }
      }

      // Если все еще нет геоданных, пробуем ipapi.co
      if (ipData && ipData.ip && !geoData) {
        try {
          const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
          const data = await geoResponse.json();
          geoData = { country_name: data.country_name };
        } catch (error) {
          console.log('ipapi.co failed...');
        }
      }

      setUserInfo({
        ip: ipData?.ip || 'Unknown',
        country: geoData?.country_name || 'Unknown',
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform
      });
    } catch (error) {
      console.error('Error getting user info:', error);
      setUserInfo({
        ip: 'Unknown',
        country: 'Unknown',
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform
      });
    }
  };

  const trackClick = (buttonName, url) => {
    const clickData = {
      buttonName,
      url,
      timestamp: new Date().toISOString(),
      ip: userInfo.ip,
      country: userInfo.country,
      userAgent: userInfo.userAgent
    };

    // Сохраняем в localStorage
    const existingStats = JSON.parse(localStorage.getItem('clickStats') || '[]');
    existingStats.push(clickData);
    localStorage.setItem('clickStats', JSON.stringify(existingStats));

    // Открываем ссылку
    window.open(url, '_blank');
  };

  const copyToClipboard = async (address, walletName) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedWallet(walletName);
      setTimeout(() => setCopiedWallet(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="App">
      <div className="donation-container">
        {/* Avatar Section */}
        <div className="avatar-section">
          <h1 className="name">Africa Dance</h1>
          <p className="description">
            Support my TikTok account africa.dance.en! 
            
          </p>
        </div>

        {/* Game Dating Section */}
        <div className="game-dating-section">
          <h2>Game Dating</h2>
          <div className="game-dating-grid">
            {gameDatingButtons.map((button) => (
              <button
                key={button.name}
                className="game-dating-button"
                style={{ '--button-color': button.color }}
                onClick={() => trackClick(button.name, button.url)}
              >
                <FiExternalLink className="button-icon" />
                {button.name}
              </button>
            ))}
          </div>
        </div>

        {/* Wallets Section */}
        <div className="wallets-section">
          <h2>Crypto Wallets</h2>
          <div className="wallets-grid">
            {wallets.map((wallet) => {
              const IconComponent = wallet.icon;
              const isCopied = copiedWallet === wallet.name;
              
              return (
                <div key={wallet.name} className="wallet-card">
                  <div className="wallet-header">
                    <IconComponent 
                      className="wallet-icon" 
                      style={{ color: wallet.color }} 
                    />
                    <span className="wallet-name">{wallet.name}</span>
                  </div>
                  <div className="wallet-address-container">
                    <div className="wallet-address">{wallet.address}</div>
                    <button 
                      className={`copy-button ${isCopied ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(wallet.address, wallet.name)}
                      title="Copy address"
                    >
                      {isCopied ? (
                        <>
                          <FiCheck style={{ marginRight: '8px' }} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FiCopy style={{ marginRight: '8px' }} />
                          Copy Address
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
