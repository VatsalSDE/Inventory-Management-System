import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, BarChart3, Zap, Target, Smartphone } from 'lucide-react';

const AIPoweredFeatures = () => {
  const [aiInsights, setAiInsights] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock AI predictions - in real implementation, these would come from AI models
  const generateAIPredictions = () => {
    setLoading(true);
    setTimeout(() => {
      const mockPredictions = {
        demandForecast: {
          nextMonth: Math.floor(Math.random() * 50) + 20,
          nextQuarter: Math.floor(Math.random() * 150) + 80,
          confidence: Math.floor(Math.random() * 30) + 70
        },
        optimalPricing: {
          currentPrice: 2500,
          suggestedPrice: 2750,
          reason: "High demand season approaching"
        },
        stockOptimization: {
          reorderPoint: Math.floor(Math.random() * 20) + 15,
          suggestedQuantity: Math.floor(Math.random() * 100) + 50,
          costSavings: Math.floor(Math.random() * 5000) + 2000
        }
      };
      setPredictions(mockPredictions);
      setLoading(false);
    }, 2000);
  };

  const aiInsightsData = [
    {
      type: 'demand',
      title: 'Demand Prediction',
      description: 'AI predicts 23% increase in steel stove demand next month',
      confidence: 87,
      action: 'Increase production by 15%',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'pricing',
      title: 'Dynamic Pricing',
      description: 'Optimal price point identified: ₹2,850 for premium models',
      confidence: 92,
      action: 'Adjust pricing strategy',
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    },
    {
      type: 'inventory',
      title: 'Smart Reordering',
      description: 'Automated reorder triggered for 3-burner glass stoves',
      confidence: 95,
      action: 'Order 45 units from supplier',
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500'
    },
    {
      type: 'trends',
      title: 'Market Trends',
      description: 'Growing preference for energy-efficient models detected',
      confidence: 78,
      action: 'Focus on eco-friendly products',
      icon: Lightbulb,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  useEffect(() => {
    generateAIPredictions();
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">AI-Powered Insights</h2>
            <p className="text-blue-100 text-lg">Smart predictions and recommendations for your business</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
            <p className="text-blue-100 text-sm">AI Confidence</p>
            <p className="text-2xl font-bold">89%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
            <p className="text-blue-100 text-sm">Predictions Today</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
            <p className="text-blue-100 text-sm">Cost Savings</p>
            <p className="text-2xl font-bold">₹15K</p>
          </div>
        </div>
      </div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiInsightsData.map((insight, index) => {
          const IconComponent = insight.icon;
          return (
            <div key={index} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{insight.title}</h3>
                  <p className="text-gray-600 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">Confidence</span>
                    <span className="text-lg font-bold text-green-600">{insight.confidence}%</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-sm font-medium text-gray-700">Recommended Action:</p>
                    <p className="text-gray-600">{insight.action}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Predictions */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">AI Predictions & Forecasts</h3>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">AI is analyzing your data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Demand Forecast */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
              <h4 className="text-lg font-bold text-blue-800 mb-4">Demand Forecast</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-600">Next Month:</span>
                  <span className="font-bold text-blue-800">{predictions.demandForecast?.nextMonth || 0} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Next Quarter:</span>
                  <span className="font-bold text-blue-800">{predictions.demandForecast?.nextQuarter || 0} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Confidence:</span>
                  <span className="font-bold text-blue-800">{predictions.demandForecast?.confidence || 0}%</span>
                </div>
              </div>
            </div>

            {/* Optimal Pricing */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
              <h4 className="text-lg font-bold text-green-800 mb-4">Optimal Pricing</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-600">Current Price:</span>
                  <span className="font-bold text-green-800">₹{predictions.optimalPricing?.currentPrice || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Suggested Price:</span>
                  <span className="font-bold text-green-800">₹{predictions.optimalPricing?.suggestedPrice || 0}</span>
                </div>
                <div className="text-sm text-green-700 bg-green-100 p-2 rounded-lg">
                  {predictions.optimalPricing?.reason || 'AI analysis in progress'}
                </div>
              </div>
            </div>

            {/* Stock Optimization */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
              <h4 className="text-lg font-bold text-orange-800 mb-4">Stock Optimization</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-orange-600">Reorder Point:</span>
                  <span className="font-bold text-orange-800">{predictions.stockOptimization?.reorderPoint || 0} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600">Suggested Order:</span>
                  <span className="font-bold text-orange-800">{predictions.stockOptimization?.suggestedQuantity || 0} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600">Cost Savings:</span>
                  <span className="font-bold text-orange-800">₹{predictions.stockOptimization?.costSavings || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={generateAIPredictions}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold"
          >
            Refresh AI Predictions
          </button>
        </div>
      </div>

      {/* AI Features Roadmap */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">AI Features Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Chatbot Support', status: 'Coming Soon', icon: Smartphone, color: 'from-blue-500 to-cyan-500' },
            { title: 'Image Recognition', status: 'In Development', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
            { title: 'Voice Commands', status: 'Planned', icon: Zap, color: 'from-purple-500 to-pink-500' },
            { title: 'Predictive Analytics', status: 'Active', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
            { title: 'Smart Notifications', status: 'Coming Soon', icon: AlertTriangle, color: 'from-indigo-500 to-purple-500' },
            { title: 'Auto-optimization', status: 'Planned', icon: Brain, color: 'from-teal-500 to-green-500' }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-3`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{feature.title}</h4>
                <span className="text-sm text-gray-600">{feature.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIPoweredFeatures;
