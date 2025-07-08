import React, { useState } from 'react';
import { CreditCard, Shield, Clock, Check, Star, Download, Calendar } from 'lucide-react';

const PaymentPage = () => {
  const [activeTab, setActiveTab] = useState('pay');
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // const plans = [
  //   {
  //     id: 'single',
  //     name: 'Single Session',
  //     price: 25,
  //     description: 'Pay as you go',
  //     features: ['Access to all sessions', 'Cancel anytime', '24h booking window']
  //   },
  //   {
  //     id: 'monthly',
  //     name: 'Monthly Unlimited',
  //     price: 89,
  //     originalPrice: 120,
  //     description: 'Best value for regular users',
  //     features: ['Unlimited sessions', 'Priority booking', 'Free cancellation', 'Trainer chat support'],
  //     popular: true
  //   },
  //   {
  //     id: 'yearly',
  //     name: 'Annual Membership',
  //     price: 899,
  //     originalPrice: 1200,
  //     description: 'Maximum savings',
  //     features: ['Unlimited sessions', 'Priority booking', 'Free cancellation', 'Personal trainer sessions', 'Nutrition consultation']
  //   }
  // ];

  const paymentHistory = [
    {
      id: 1,
      date: '2024-01-15',
      description: 'Monthly Unlimited Plan',
      amount: 89,
      status: 'Completed',
      receiptId: 'RCP-001'
    },
    {
      id: 2,
      date: '2024-01-10',
      description: 'Morning HIIT Blast Session',
      amount: 25,
      status: 'Completed',
      receiptId: 'RCP-002'
    },
    {
      id: 3,
      date: '2024-01-05',
      description: 'Strength Training Session',
      amount: 35,
      status: 'Completed',
      receiptId: 'RCP-003'
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: 'Morning HIIT Blast',
      date: '2024-01-20',
      time: '7:00 AM',
      trainer: 'Sarah Johnson',
      location: 'Central Park',
      paid: true
    },
    {
      id: 2,
      title: 'Strength & Power',
      date: '2024-01-22',
      time: '6:00 PM',
      trainer: 'Mike Chen',
      location: 'Downtown Gym',
      paid: false,
      amount: 35
    }
  ];

  return (
    <div className="max-w-6xl border mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments & Billing</h1>
        <p className="text-gray-600">Manage your payments, subscriptions, and billing history</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'pay', label: 'Make Payment', icon: CreditCard },
            { id: 'history', label: 'Payment History', icon: Clock },
            { id: 'subscriptions', label: 'Subscriptions', icon: Star }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Make Payment Tab */}
      {activeTab === 'pay' && (
        <div className="gap-8">
          {/* Plans */}
          {/* <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Plan</h2>
            <div className="space-y-4">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-6">
                      <span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${plan.price}
                        {plan.id !== 'single' && <span className="text-sm text-gray-500">/mo</span>}
                      </div>
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ${plan.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div> */}

          {/* Payment Form */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-lg transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-lg transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-blue-600 font-bold">PayPal</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Your payment information is secure and encrypted
                  </span>
                </div>
              </div>

              {/* Total and Pay Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {/* ${plans.find(p => p.id === selectedPlan)?.price} */}AED 56
                  </span>
                </div>
               <div className="flex gap-4">
                 <button className="w-full border border-custom-dark hover:bg-primary-700 py-3 px-4 rounded-lg font-medium transition-colors">
                  Cancel
                </button>
                <button className="w-full bg-custom-dark hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  Complete Payment
                </button>
               </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentHistory.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-8">
          {/* Current Subscription */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Subscription</h2>
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Monthly Unlimited Plan</h3>
                  <p className="text-blue-100">Active since January 15, 2024</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">$89/mo</div>
                  <p className="text-blue-100">Next billing: Feb 15, 2024</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-400 border-opacity-30">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Sessions used this month: 12/∞</span>
                  <div className="flex space-x-3">
                    <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors">
                      Modify Plan
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 rounded-lg p-3">
                      <Calendar className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(session.date).toLocaleDateString()} at {session.time} with {session.trainer}
                      </p>
                      <p className="text-sm text-gray-500">{session.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {session.paid ? (
                      <span className="inline-flex items-center space-x-1 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">Paid</span>
                      </span>
                    ) : (
                      <div>
                        <div className="text-lg font-bold text-gray-900">${session.amount}</div>
                        <button className="text-sm text-primary-600 hover:text-primary-700">
                          Pay Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;