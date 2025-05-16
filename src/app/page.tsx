"use client";

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// TypeScript types for CoinGecko API responses
interface CoinGeckoMarketData {
  current_price: { usd: number };
  price_change_percentage_24h: number;
  high_24h: { usd: number };
  low_24h: { usd: number };
  total_volume: { usd: number };
  market_cap: { usd: number };
  circulating_supply: number;
  ath: { usd: number };
  atl: { usd: number };
  sparkline_7d: { price: number[] };
}
interface CoinGeckoCoin {
  market_data: CoinGeckoMarketData;
}

const HoldingsTable = ({ btcData, ethData, balances }: { btcData: CoinGeckoCoin | null, ethData: CoinGeckoCoin | null, balances: { BTC: number, ETH: number } }) => {
  const holdings = [
    btcData && {
      asset: 'Bitcoin (BTC)',
      price: btcData.market_data.current_price.usd,
      change: btcData.market_data.price_change_percentage_24h,
      balance: balances.BTC,
      totalValue: balances.BTC * btcData.market_data.current_price.usd,
    },
    ethData && {
      asset: 'Ethereum (ETH)',
      price: ethData.market_data.current_price.usd,
      change: ethData.market_data.price_change_percentage_24h,
      balance: balances.ETH,
      totalValue: balances.ETH * ethData.market_data.current_price.usd,
    },
  ].filter(Boolean);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold text-gray-100 mb-6">Portfolio Holdings</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-lg">
          <thead>
            <tr>
              <th className="border-b border-gray-700 p-2 text-xl">Asset</th>
              <th className="border-b border-gray-700 p-2 text-xl">Price</th>
              <th className="border-b border-gray-700 p-2 text-xl">24h Change</th>
              <th className="border-b border-gray-700 p-2 text-xl">Balance</th>
              <th className="border-b border-gray-700 p-2 text-xl">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {holdings.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-4">Loading...</td></tr>
            ) : (
              holdings.map((holding, index) => (
                holding && (
                  <tr key={index}>
                    <td className="border-b border-gray-700 p-2 text-lg font-semibold">{holding.asset}</td>
                    <td className="border-b border-gray-700 p-2 text-lg font-semibold">${holding.price.toLocaleString()}</td>
                    <td
                      className={`border-b border-gray-700 p-2 text-lg font-semibold ${holding.change > 0 ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {holding.change > 0 ? '+' : ''}
                      {holding.change.toFixed(2)}%
                    </td>
                    <td className="border-b border-gray-700 p-2 text-lg font-semibold">{holding.balance}</td>
                    <td className="border-b border-gray-700 p-2 text-lg font-semibold">${holding.totalValue.toLocaleString()}</td>
                  </tr>
                )
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [btcData, setBtcData] = useState<CoinGeckoCoin | null>(null);
  const [ethData, setEthData] = useState<CoinGeckoCoin | null>(null);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState({ BTC: 0.5, ETH: 5 });
  const [tradeType, setTradeType] = useState<'Buy' | 'Sell'>('Buy');
  const [crypto, setCrypto] = useState<'BTC' | 'ETH'>('BTC');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const btcRes = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true');
        const ethRes = await fetch('https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true');
        const btcJson = await btcRes.json();
        const ethJson = await ethRes.json();
        setBtcData(btcJson);
        setEthData(ethJson);
      } catch (e) {
        setBtcData(null);
        setEthData(null);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Prepare chart data from CoinGecko sparkline if available
  const chartData = btcData && ethData && btcData.market_data.sparkline_7d && ethData.market_data.sparkline_7d ? {
    labels: btcData.market_data.sparkline_7d.price.map((_, i) => {
      if (i % 24 === 0) {
        const date = new Date(Date.now() - (168 - i) * 60 * 60 * 1000);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      return '';
    }),
    datasets: [
      {
        label: 'Bitcoin',
        data: btcData.market_data.sparkline_7d.price,
        borderColor: '#F7931A',
        backgroundColor: 'rgba(247, 147, 26, 0.15)',
        fill: true,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#F7931A',
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowBlur: 10,
        shadowColor: 'rgba(247, 147, 26, 0.25)',
      },
      {
        label: 'Ethereum',
        data: ethData.market_data.sparkline_7d.price,
        borderColor: '#627EEA',
        backgroundColor: 'rgba(98, 126, 234, 0.15)',
        fill: true,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#627EEA',
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowBlur: 10,
        shadowColor: 'rgba(98, 126, 234, 0.25)',
      },
    ],
  } : {
    labels: [],
    datasets: [],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#fff',
          font: { size: 16, weight: 'bold' as const },
          boxWidth: 24,
          padding: 24,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#222',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#888',
        borderWidth: 1,
        padding: 16,
        caretSize: 8,
        cornerRadius: 10,
        titleFont: { size: 16, weight: 'bold' as const },
        bodyFont: { size: 15 },
        displayColors: true,
      },
      title: {
        display: false,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#bbb',
          font: { size: 13, weight: 'bold' as const },
        },
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.08)',
        },
        ticks: {
          color: '#bbb',
          font: { size: 13, weight: 'bold' as const },
        },
      },
    },
    layout: {
      padding: 24,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] text-white p-4">
      {/* Header Section */}
      <header className="flex justify-center items-center bg-gradient-to-r from-green-400/10 via-gray-800 to-blue-500/10 p-8 rounded-2xl shadow-xl mb-6 border border-gray-700">
        <h1 className="text-gray-100 font-extrabold text-5xl tracking-tight drop-shadow-lg">Crypto Portfolio Manager</h1>
      </header>

      <div className="grid grid-cols-12 gap-8 mt-4">
        {/* Left Sidebar */}
        <aside className="col-span-3 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col items-center">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400/30 to-blue-500/30 rounded-full flex items-center justify-center border-2 border-green-400">
              <span className="text-3xl font-extrabold text-white">K</span>
            </div>
            <div>
              <p className="font-extrabold text-2xl text-white">Kyle Steward</p>
              <p className="text-green-400 text-base font-bold">VERIFIED</p>
            </div>
          </div>
          <nav className="space-y-6 text-xl w-full">
            <p className="font-extrabold text-green-400 flex items-center gap-2 text-2xl"><span className="material-icons">dashboard</span> Overview</p>
            <p className="text-gray-400 hover:text-green-300 transition cursor-pointer text-xl">Explore Cryptos</p>
            <p className="text-gray-400 flex items-center hover:text-green-300 transition cursor-pointer text-xl">
              Notifications <span className="ml-2 bg-red-500 text-white text-base px-2 py-1 rounded-full">5</span>
            </p>
            <p className="text-gray-400 hover:text-green-300 transition cursor-pointer text-xl">Transfers</p>
          </nav>
        </aside>

        {/* Center Panel */}
        <main className="col-span-6 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Bitcoin Section */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl shadow-md border border-gray-700">
              <h2 className="text-3xl font-extrabold text-orange-400 mb-6 flex items-center gap-2"><span className="material-icons"></span> Bitcoin</h2>
              {loading || !btcData ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Open</p>
                    <p className="font-bold text-gray-100">${btcData.market_data.current_price.usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">High</p>
                    <p className="font-bold text-gray-100">${btcData.market_data.high_24h.usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Low</p>
                    <p className="font-bold text-gray-100">${btcData.market_data.low_24h.usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Volume</p>
                    <p className="font-bold text-gray-100">{btcData.market_data.total_volume.usd.toLocaleString()} USD</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Market Cap</p>
                    <p className="font-bold text-gray-100">${btcData.market_data.market_cap.usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Circulating Supply</p>
                    <p className="font-bold text-gray-100">{btcData.market_data.circulating_supply.toLocaleString()} BTC</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">All-Time High</p>
                    <p className="font-bold text-gray-100">${btcData.market_data.ath.usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">All-Time Low</p>
                    <p className="font-bold text-gray-100">${btcData.market_data.atl.usd.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ethereum Section */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl shadow-md border border-gray-700">
              <h2 className="text-3xl font-extrabold text-blue-400 mb-6 flex items-center gap-2"><span className="material-icons"></span> Ethereum</h2>
              {loading || !ethData ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Open</p>
                    <p className="font-bold text-gray-100">${ethData.market_data.current_price.usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">High</p>
                    <p className="font-bold text-gray-100">${ethData.market_data.high_24h.usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Low</p>
                    <p className="font-bold text-gray-100">${ethData.market_data.low_24h.usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Volume</p>
                    <p className="font-bold text-gray-100">{ethData.market_data.total_volume.usd.toLocaleString()} USD</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Market Cap</p>
                    <p className="font-bold text-gray-100">${ethData.market_data.market_cap.usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Circulating Supply</p>
                    <p className="font-bold text-gray-100">{ethData.market_data.circulating_supply.toLocaleString()} ETH</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">All-Time High</p>
                    <p className="font-bold text-gray-100">${ethData.market_data.ath.usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">All-Time Low</p>
                    <p className="font-bold text-gray-100">${ethData.market_data.atl.usd.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl mb-6 shadow-lg border border-gray-700 flex flex-col justify-center p-6">
            {loading || !btcData || !ethData ? (
              <p className="text-center pt-32 text-lg text-gray-400 animate-pulse">Loading chart...</p>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
            <div className="flex gap-8 justify-center mt-4">
              <p className="text-sm text-gray-400">Bitcoin: <span className="text-orange-400 font-bold">#F7931A</span></p>
              <p className="text-sm text-gray-400">Ethereum: <span className="text-blue-400 font-bold">#627EEA</span></p>
            </div>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="col-span-3 flex flex-col gap-8">
          {/* Jane Doe AI Trading Assistant Card */}
          <div className="flex flex-col items-center w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700">
            <div className="w-20 h-20 rounded-full border-4 border-green-400 mb-2 overflow-hidden bg-gray-700 flex items-center justify-center">
              <img src="https://randomuser.me/api/portraits/lego/1.jpg" alt="Jane Doe" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-extrabold text-green-400 mt-2">Jane Doe</h2>
            <p className="text-gray-300 text-lg mb-1">jane.doe@email.com</p>
            <p className="text-green-400 font-bold mb-4 text-lg">AI Trading Assistant</p>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700 mb-3 text-center"
              placeholder="Ask Jane Doe anything about your crypto..."
              disabled
            />
            <button className="w-full bg-green-400 text-black font-bold px-4 py-2 rounded-lg text-lg mt-2 cursor-not-allowed opacity-80">Chat Coming Soon</button>
          </div>

          {/* Buy / Sell Crypto Card */}
          <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-3xl font-extrabold text-green-400 mb-6">Buy / Sell Crypto</h2>
            <form className="space-y-4" onSubmit={e => {
              e.preventDefault();
              const amt = parseFloat(amount);
              if (isNaN(amt) || amt <= 0) {
                setError('Enter a valid amount.');
                return;
              }
              if (tradeType === 'Sell' && amt > balances[crypto]) {
                setError('Insufficient balance.');
                return;
              }
              setBalances(prev => ({
                ...prev,
                [crypto]: tradeType === 'Buy' ? prev[crypto] + amt : prev[crypto] - amt
              }));
              setAmount('');
              setError('');
            }}>
              <div>
                <select value={tradeType} onChange={e => setTradeType(e.target.value as 'Buy' | 'Sell')} className="w-full p-2 rounded bg-black text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 border border-black mb-2">
                  <option>Buy</option>
                  <option>Sell</option>
                </select>
              </div>
              <div>
                <select value={crypto} onChange={e => setCrypto(e.target.value as 'BTC' | 'ETH')} className="w-full p-2 rounded bg-black text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 border border-black mb-2">
                  <option>BTC</option>
                  <option>ETH</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full p-2 rounded bg-black text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 border border-black placeholder-gray-400 mb-2"
                />
              </div>
              <button type="submit" className="bg-green-400 text-black font-bold px-4 py-2 rounded-lg w-full text-lg hover:bg-green-500 transition">{tradeType}</button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </div>
        </aside>
      </div>

      <div className="mt-12">
        <HoldingsTable btcData={btcData} ethData={ethData} balances={balances} />
      </div>
    </div>
  );
};

export default Dashboard;
