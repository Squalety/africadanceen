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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parseUserAgent = (userAgent) => {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS X')) return 'macOS';
    if (userAgent.includes('Linux') && !userAgent.includes('Android')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown';
  };

  const getCountryFromTimezone = (timezone) => {
    if (!timezone) return 'Unknown';
    
    // Точное определение России по всем её временным зонам
    const russianTimezones = [
      'Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Samara', 'Europe/Volgograd',
      'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk',
      'Asia/Yakutsk', 'Asia/Vladivostok', 'Asia/Magadan', 'Asia/Kamchatka',
      'Asia/Anadyr', 'Asia/Sakhalin', 'Asia/Srednekolymsk', 'Asia/Ust-Nera',
      'Asia/Chita', 'Asia/Khandyga', 'Asia/Tomsk', 'Asia/Barnaul', 'Asia/Novokuznetsk'
    ];
    
    if (russianTimezones.some(tz => timezone.includes(tz))) {
      return 'Russia';
    }
    
    // Остальные европейские страны
    if (timezone.includes('Europe')) {
      if (timezone.includes('London')) return 'United Kingdom';
      if (timezone.includes('Paris')) return 'France';
      if (timezone.includes('Berlin')) return 'Germany';
      if (timezone.includes('Rome')) return 'Italy';
      if (timezone.includes('Madrid')) return 'Spain';
      if (timezone.includes('Amsterdam')) return 'Netherlands';
      if (timezone.includes('Stockholm')) return 'Sweden';
      if (timezone.includes('Oslo')) return 'Norway';
      if (timezone.includes('Helsinki')) return 'Finland';
      if (timezone.includes('Warsaw')) return 'Poland';
      if (timezone.includes('Prague')) return 'Czech Republic';
      if (timezone.includes('Vienna')) return 'Austria';
      if (timezone.includes('Budapest')) return 'Hungary';
      if (timezone.includes('Zurich')) return 'Switzerland';
      if (timezone.includes('Brussels')) return 'Belgium';
      if (timezone.includes('Copenhagen')) return 'Denmark';
      if (timezone.includes('Kiev') || timezone.includes('Kyiv')) return 'Ukraine';
      if (timezone.includes('Minsk')) return 'Belarus';
      return 'Europe';
    }
    
    // Америки
    if (timezone.includes('America')) {
      if (timezone.includes('New_York') || timezone.includes('Chicago') || 
          timezone.includes('Denver') || timezone.includes('Los_Angeles') ||
          timezone.includes('Phoenix') || timezone.includes('Anchorage')) return 'United States';
      if (timezone.includes('Toronto') || timezone.includes('Vancouver') || 
          timezone.includes('Montreal') || timezone.includes('Edmonton')) return 'Canada';
      if (timezone.includes('Mexico')) return 'Mexico';
      if (timezone.includes('Sao_Paulo') || timezone.includes('Rio')) return 'Brazil';
      if (timezone.includes('Buenos_Aires')) return 'Argentina';
      if (timezone.includes('Lima')) return 'Peru';
      if (timezone.includes('Santiago')) return 'Chile';
      if (timezone.includes('Bogota')) return 'Colombia';
      return 'Americas';
    }
    
    // Азия (исключая Россию, которая уже обработана)
    if (timezone.includes('Asia')) {
      if (timezone.includes('Shanghai') || timezone.includes('Beijing') || timezone.includes('Chongqing')) return 'China';
      if (timezone.includes('Tokyo')) return 'Japan';
      if (timezone.includes('Kolkata') || timezone.includes('Mumbai') || timezone.includes('Delhi')) return 'India';
      if (timezone.includes('Seoul')) return 'South Korea';
      if (timezone.includes('Bangkok')) return 'Thailand';
      if (timezone.includes('Singapore')) return 'Singapore';
      if (timezone.includes('Hong_Kong')) return 'Hong Kong';
      if (timezone.includes('Taipei')) return 'Taiwan';
      if (timezone.includes('Manila')) return 'Philippines';
      if (timezone.includes('Jakarta')) return 'Indonesia';
      if (timezone.includes('Kuala_Lumpur')) return 'Malaysia';
      if (timezone.includes('Dubai')) return 'UAE';
      if (timezone.includes('Tehran')) return 'Iran';
      if (timezone.includes('Istanbul')) return 'Turkey';
      return 'Asia';
    }
    
    // Другие континенты
    if (timezone.includes('Africa')) {
      if (timezone.includes('Cairo')) return 'Egypt';
      if (timezone.includes('Lagos')) return 'Nigeria';
      if (timezone.includes('Johannesburg')) return 'South Africa';
      return 'Africa';
    }
    
    if (timezone.includes('Australia')) {
      if (timezone.includes('Sydney') || timezone.includes('Melbourne')) return 'Australia';
      return 'Australia/Oceania';
    }
    
    if (timezone.includes('Pacific')) {
      if (timezone.includes('Auckland')) return 'New Zealand';
      return 'Pacific';
    }
    
    return 'Unknown';
  };

  const getUserInfo = async () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    const platform = parseUserAgent(navigator.userAgent);
    const country = getCountryFromTimezone(timezone);
    
    console.log('🕐 Detected timezone:', timezone);
    console.log('🌍 Detected country:', country);
    
    // Базовая информация, которая всегда доступна
    let userInfo = {
      ip: 'Local-User',
      country: country,
      userAgent: navigator.userAgent,
      timezone: timezone,
      language: language,
      platform: platform
    };

    console.log('📍 Base user info:', userInfo);

    // Пробуем получить реальный IP (необязательно)
    try {
      const response = await fetch('https://httpbin.org/ip');
      const data = await response.json();
      if (data.origin) {
        userInfo.ip = data.origin.split(',')[0].trim();
        console.log('✅ Got real IP:', userInfo.ip);
      }
    } catch (error) {
      console.log('ℹ️ Could not get real IP, using fallback');
    }

    setUserInfo(userInfo);
  };

  const trackClick = (buttonName, url) => {
    const clickData = {
      buttonName,
      url,
      timestamp: new Date().toISOString()
    };

    console.log('🔄 Tracking click:', clickData);

    // Сохраняем в localStorage
    const existingStats = JSON.parse(localStorage.getItem('clickStats') || '[]');
    existingStats.push(clickData);
    localStorage.setItem('clickStats', JSON.stringify(existingStats));
    
    console.log('💾 Stats saved. Total clicks:', existingStats.length);

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
