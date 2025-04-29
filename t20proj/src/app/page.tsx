"use client";

import React from 'react';
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
} from 'chart.js';
import { LineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer } from 'recharts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HoldingsTable = () => {
  const holdings = [
    { asset: 'Bitcoin (BTC)', price: 30000, change: 2.5, balance: 0.5, totalValue: 15000 },
    { asset: 'Ethereum (ETH)', price: 2000, change: -1.2, balance: 5, totalValue: 10000 },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Portfolio Holdings</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-700 p-2">Asset</th>
              <th className="border-b border-gray-700 p-2">Price</th>
              <th className="border-b border-gray-700 p-2">24h Change</th>
              <th className="border-b border-gray-700 p-2">Balance</th>
              <th className="border-b border-gray-700 p-2">Total Value</th>
              <th className="border-b border-gray-700 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => (
              <tr key={index}>
                <td className="border-b border-gray-700 p-2">{holding.asset}</td>
                <td className="border-b border-gray-700 p-2">${holding.price.toLocaleString()}</td>
                <td
                  className={`border-b border-gray-700 p-2 ${
                    holding.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {holding.change > 0 ? '+' : ''}
                  {holding.change}%
                </td>
                <td className="border-b border-gray-700 p-2">{holding.balance} {holding.asset.split(' ')[0]}</td>
                <td className="border-b border-gray-700 p-2">
                  ${holding.totalValue.toLocaleString()}
                </td>
                <td className="border-b border-gray-700 p-2 space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Buy</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Sell</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const chartData = {
    labels: ['Jul 8', 'Jul 9', 'Jul 10', 'Jul 11', 'Jul 12', 'Jul 13', 'Jul 14'],
    datasets: [
      {
        label: 'Bitcoin',
        data: [1100, 1200, 1300, 1250, 1400, 1500, 1450],
        borderColor: '#F7931A',
        backgroundColor: 'rgba(247, 147, 26, 0.2)',
        fill: true,
      },
      {
        label: 'Ethereum',
        data: [900, 950, 1000, 980, 1050, 1100, 1080],
        borderColor: '#627EEA',
        backgroundColor: 'rgba(98, 126, 234, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#e0e0e0',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header Section */}
      <header className="flex justify-center items-center bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-gray-300 font-bold text-2xl">Crypto Portfolio Manager</h1>
      </header>

      <div className="grid grid-cols-12 gap-4 mt-4">
        {/* Left Sidebar */}
        <aside className="col-span-3 bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
            <div>
              <p className="font-bold">Kyle Steward</p>
              <p className="text-green-500 text-sm">VERIFIED</p>
            </div>
          </div>
          <nav className="space-y-4">
            <p className="font-bold text-green-500">Overview</p>
            <p className="text-gray-400">Explore Cryptos</p>
            <p className="text-gray-400 flex items-center">
              Notifications <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">5</span>
            </p>
            <p className="text-gray-400">Transfers</p>
          </nav>
        </aside>

        {/* Center Panel */}
        <main className="col-span-6 bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Bitcoin Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Bitcoin</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Open</p>
                  <p className="font-bold text-gray-100">$164.26</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">High</p>
                  <p className="font-bold text-gray-100">$182.73</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Low</p>
                  <p className="font-bold text-gray-100">$130.21</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Volume</p>
                  <p className="font-bold text-gray-100">XX,XXX BTC</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Market Cap</p>
                  <p className="font-bold text-gray-100">$XXX B</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Circulating Supply</p>
                  <p className="font-bold text-gray-100">XX,XXX,XXX BTC</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">All-Time High</p>
                  <p className="font-bold text-gray-100">$220.73</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">All-Time Low</p>
                  <p className="font-bold text-gray-100">$121.14</p>
                </div>
              </div>
            </div>

            {/* Ethereum Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Ethereum</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Open</p>
                  <p className="font-bold text-gray-100">$120.14</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">High</p>
                  <p className="font-bold text-gray-100">$135.67</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Low</p>
                  <p className="font-bold text-gray-100">$98.21</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Volume</p>
                  <p className="font-bold text-gray-100">XX,XXX ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Market Cap</p>
                  <p className="font-bold text-gray-100">$XXX B</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Circulating Supply</p>
                  <p className="font-bold text-gray-100">XX,XXX,XXX ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">All-Time High</p>
                  <p className="font-bold text-gray-100">$150.73</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">All-Time Low</p>
                  <p className="font-bold text-gray-100">$85.14</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-80 bg-gray-700 rounded-lg mb-4">
            <Line data={chartData} options={chartOptions} />
            <p className="text-sm text-gray-400 mt-2">Bitcoin: <span className="text-orange-500">#F7931A</span></p>
            <p className="text-sm text-gray-400">Ethereum: <span className="text-blue-500">#627EEA</span></p>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="col-span-3 bg-gray-800 p-4 rounded-lg shadow-md">
          {/* Purchase Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">AI Trading Agent</h2>
            <p className="text-gray-400 mb-4">Ask trading questions like "Should I buy BTC now?" and get real-time suggestions.</p>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Type your question here..."
                className="flex-1 p-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Submit</button>
            </div>
            <div className="mt-4 bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Suggestion: <span className="text-green-500">Buy</span></p>
              <p className="text-gray-400">Confidence: <span className="text-gray-100">85%</span></p>
              <p className="text-gray-400">Reason: <span className="text-gray-100">Market trends indicate a bullish pattern.</span></p>
              <p className="text-gray-400">Timestamp: <span className="text-gray-100">April 25, 2025, 14:30</span></p>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Purchase</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Crypto</label>
                <input
                  type="number"
                  placeholder="Enter number of shares"
                  className="w-full p-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Market Price</label>
                <input
                  type="text"
                  placeholder="Enter market price"
                  className="w-full p-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Estimated Cost</label>
                <input
                  type="text"
                  placeholder="Estimated cost will be calculated"
                  className="w-full p-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled
                />
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">Place Order</button>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-8">
        <HoldingsTable />
      </div>
    </div>
  );
};

export default Dashboard;
