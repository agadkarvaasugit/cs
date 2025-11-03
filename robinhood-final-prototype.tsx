import React, { useState, useEffect } from 'react';
import { CheckCircle, Info, TrendingUp, AlertCircle } from 'lucide-react';

const RobinhoodPrototype = () => {
  const [screen, setScreen] = useState('entry');
  const [shares, setShares] = useState('');
  const [orderType, setOrderType] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [stockPrice, setStockPrice] = useState(175.50);
  const [orderReference, setOrderReference] = useState('');
  const [completionPercent, setCompletionPercent] = useState(0);

  // Simulate live stock price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStockPrice(prev => prev + (Math.random() - 0.5) * 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Calculate completion percentage
  useEffect(() => {
    let percent = 0;
    if (shares) percent += 33;
    if (orderType) percent += 34;
    if (orderType === 'Market' || (orderType === 'Limit' && limitPrice) || 
        (orderType === 'Stop Loss' && stopPrice) || 
        (orderType === 'Stop Limit' && limitPrice && stopPrice)) {
      percent += 33;
    }
    setCompletionPercent(percent);
  }, [shares, orderType, limitPrice, stopPrice]);

  const getBarColor = () => {
    if (completionPercent < 34) return 'bg-red-500';
    if (completionPercent < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (completionPercent < 34) return 'INCOMPLETE';
    if (completionPercent < 100) return 'ALMOST READY';
    return 'READY TO SUBMIT';
  };

  const orderTypes = [
    {
      name: 'Market Order',
      short: 'Market',
      description: 'Buy/sell immediately at current price',
      example: 'AAPL is at $175. Your market order buys instantly at the best available price (may be slightly different due to market movement).',
      icon: '⚡'
    },
    {
      name: 'Limit Order',
      short: 'Limit',
      description: "Set specific price you're willing to pay",
      example: "AAPL is at $175, but you only want to buy at $170 or lower. Your order waits until the price reaches $170 or less.",
      icon: '🎯'
    },
    {
      name: 'Stop Loss',
      short: 'Stop Loss',
      description: 'Auto-sell if price drops below point',
      example: 'You own AAPL at $175. You set a stop loss at $165. If the price drops to $165, your shares automatically sell to prevent further losses.',
      icon: '🛡️'
    },
    {
      name: 'Stop Limit',
      short: 'Stop Limit',
      description: 'Combines stop and limit for control',
      example: 'Advanced order: triggers a limit order when stop price is reached. Gives you price control but execution is not guaranteed.',
      icon: '⚙️'
    }
  ];

  const handleConfirm = () => {
    const ref = `ORD-2024-${Math.floor(Math.random() * 900000) + 100000}`;
    setOrderReference(ref);
    setScreen('confirmation');
  };

  const calculateTotal = () => {
    const price = orderType === 'Limit' ? parseFloat(limitPrice) || stockPrice : stockPrice;
    return (parseFloat(shares) || 0) * price;
  };

  if (screen === 'entry') {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">AAPL</div>
              <div className="text-sm opacity-90">Apple Inc.</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${stockPrice.toFixed(2)}</div>
              <div className="text-xs flex items-center justify-end gap-1">
                <TrendingUp size={12} />
                <span>+2.4%</span>
              </div>
            </div>
          </div>
          
          {/* Mini Live Chart */}
          <div className="bg-white bg-opacity-20 rounded p-2 h-16 flex items-end justify-around gap-1">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white w-1 rounded-t"
                style={{height: `${30 + Math.random() * 70}%`}}
              />
            ))}
          </div>
        </div>

        {/* Trade Confidence Bar */}
        <div className="p-4 border-b-2 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Order Status:</span>
            <span className={`text-sm font-bold ${completionPercent === 100 ? 'text-green-600' : 'text-gray-600'}`}>
              {getStatusText()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getBarColor()}`}
              style={{width: `${completionPercent}%`}}
            />
          </div>
        </div>

        {/* Input Fields */}
        <div className="p-4 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              Number of Shares
              {!shares && <AlertCircle size={16} className="text-red-500" />}
            </label>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="Enter quantity"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              Order Type
              {!orderType && <AlertCircle size={16} className="text-red-500" />}
            </label>
            <button
              onClick={() => setScreen('orderTypes')}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-green-500"
            >
              <span className={orderType ? 'text-black' : 'text-gray-400'}>
                {orderType || 'Select order type'}
              </span>
              <Info size={20} className="text-gray-400" />
            </button>
          </div>

          {orderType === 'Limit' && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                Limit Price
                {!limitPrice && <AlertCircle size={16} className="text-red-500" />}
              </label>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="Enter limit price"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
          )}

          {orderType === 'Stop Loss' && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                Stop Price
                {!stopPrice && <AlertCircle size={16} className="text-red-500" />}
              </label>
              <input
                type="number"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                placeholder="Enter stop price"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
          )}

          {orderType === 'Stop Limit' && (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  Stop Price
                  {!stopPrice && <AlertCircle size={16} className="text-red-500" />}
                </label>
                <input
                  type="number"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  placeholder="Enter stop price"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  Limit Price
                  {!limitPrice && <AlertCircle size={16} className="text-red-500" />}
                </label>
                <input
                  type="number"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  placeholder="Enter limit price"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {completionPercent === 100 && (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-sm font-semibold text-green-800">
                All fields complete - Your order is ready to submit
              </span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={() => completionPercent === 100 && setScreen('review')}
            disabled={completionPercent < 100}
            className={`w-full max-w-md mx-auto block py-4 rounded-lg font-bold text-lg transition-all ${
              completionPercent === 100
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {completionPercent === 100 ? 'REVIEW ORDER' : 'COMPLETE ALL FIELDS'}
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'orderTypes') {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">SELECT ORDER TYPE</h2>
          <p className="text-gray-600">Choose how to execute trade</p>
        </div>

        <div className="space-y-3">
          {orderTypes.map((order) => (
            <div key={order.short} className="border-2 border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => {
                  if (expandedOrder === order.short) {
                    setExpandedOrder(null);
                  } else {
                    setExpandedOrder(order.short);
                  }
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-2xl">{order.icon}</span>
                  <div>
                    <div className="font-bold">{order.name}</div>
                    <div className="text-sm text-gray-600">{order.description}</div>
                  </div>
                </div>
                <Info size={20} className="text-gray-400" />
              </button>
              
              {expandedOrder === order.short && (
                <div className="bg-blue-50 border-t-2 border-blue-200 p-4">
                  <div className="font-semibold text-blue-900 mb-2">Example Scenario:</div>
                  <div className="text-sm text-blue-800 mb-4">{order.example}</div>
                  <button
                    onClick={() => {
                      setOrderType(order.short);
                      setScreen('entry');
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    USE THIS ORDER TYPE
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setScreen('entry')}
          className="w-full mt-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
        >
          BACK TO TRADE
        </button>
      </div>
    );
  }

  if (screen === 'review') {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen p-4">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-4">
          <h2 className="text-2xl font-bold mb-6">REVIEW ORDER</h2>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b-2">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl font-bold">
              🍎
            </div>
            <div>
              <div className="text-2xl font-bold">AAPL</div>
              <div className="text-gray-600">Apple Inc.</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Action:</span>
              <span className="font-bold text-green-600">BUY</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-bold">{shares} shares</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Order Type:</span>
              <span className="font-bold">{orderType}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Est. Price:</span>
              <span className="font-bold">${stockPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xl font-bold">Total Cost:</span>
              <span className="text-xl font-bold text-green-600">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
          <Info className="text-blue-600 flex-shrink-0" size={20} />
          <div className="text-sm text-blue-900">
            {orderType === 'Market' && 'Market orders execute immediately. Final price may vary slightly due to market movement.'}
            {orderType === 'Limit' && `Your order will only execute at $${limitPrice} or better. It may not fill if the price doesn't reach your limit.`}
            {orderType === 'Stop Loss' && `Your shares will automatically sell if the price drops to $${stopPrice}.`}
            {orderType === 'Stop Limit' && 'Your order combines stop and limit for precise control. Execution is not guaranteed.'}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-green-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-600 mb-3"
        >
          CONFIRM PURCHASE
        </button>
        
        <button
          onClick={() => setScreen('entry')}
          className="w-full border-2 border-gray-300 py-4 rounded-lg font-bold hover:bg-gray-50"
        >
          BACK TO EDIT
        </button>
      </div>
    );
  }

  if (screen === 'confirmation') {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="text-green-500 animate-bounce" size={80} />
          </div>
          
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            ORDER CONFIRMED!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your purchase has been submitted
          </p>
          
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <div className="text-sm text-gray-600 mb-2">Order Reference</div>
            <div className="text-2xl font-mono font-bold text-gray-800">
              {orderReference}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setShares('');
                setOrderType('');
                setLimitPrice('');
                setStopPrice('');
                setScreen('entry');
              }}
              className="w-full bg-green-500 text-white py-4 rounded-lg font-bold hover:bg-green-600"
            >
              RETURN TO TRADING
            </button>
            
            <button
              className="w-full border-2 border-gray-300 py-4 rounded-lg font-bold hover:bg-gray-50"
            >
              VIEW ORDER DETAILS
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default RobinhoodPrototype;