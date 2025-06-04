import React, { useState } from 'react';
import './App.css';
import { FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';
import { FaEthereum } from 'react-icons/fa';
import { SiTether, SiSolana } from 'react-icons/si';

function App() {
  const [copiedWallet, setCopiedWallet] = useState('');

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

  const trackClick = (buttonName, url) => {
    const clickData = {
      buttonName,
      url,
      timestamp: new Date().toISOString(),
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      userAgent: navigator.userAgent
    };

    console.log('🔄 Tracking click:', clickData);
    console.log('📱 Is mobile device:', clickData.isMobile);

    try {
      // Проверяем доступность localStorage
      if (typeof(Storage) === "undefined") {
        console.error('❌ localStorage not supported');
        window.open(url, '_blank');
        return;
      }

      // Сохраняем в localStorage с дополнительными проверками
      const existingStats = JSON.parse(localStorage.getItem('clickStats') || '[]');
      existingStats.push(clickData);
      localStorage.setItem('clickStats', JSON.stringify(existingStats));
      
      // Проверяем что данные действительно сохранились
      const verifyStats = JSON.parse(localStorage.getItem('clickStats') || '[]');
      console.log('💾 Stats saved. Total clicks:', verifyStats.length);
      console.log('📊 Last saved item:', verifyStats[verifyStats.length - 1]);
      
      // Дополнительная проверка для мобильных
      if (clickData.isMobile) {
        console.log('📱 Mobile click verified:', {
          saved: verifyStats.length > existingStats.length - 1,
          timestamp: clickData.timestamp
        });
      }
      
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
      // Попытка с простым объектом
      try {
        const simpleData = { button: buttonName, time: Date.now() };
        localStorage.setItem('lastClick', JSON.stringify(simpleData));
        console.log('🔄 Fallback save successful');
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
    }

    // Открываем ссылку с задержкой для мобильных устройств
    if (clickData.isMobile) {
      setTimeout(() => {
        window.open(url, '_blank');
      }, 100);
    } else {
      window.open(url, '_blank');
    }
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
                onTouchEnd={(e) => {
                  e.preventDefault();
                  trackClick(button.name, button.url);
                }}
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
