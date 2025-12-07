import React from 'react';

function DebtSummary({ summary }) {
  const debtsArray = Array.isArray(summary) ? summary : Object.values(summary);

  if (!debtsArray || debtsArray.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        تاکنون هیچ بدهی/طلبی وجود ندارد.
      </div>
    );
  }

  return (
    <div className="p-4 border rounded shadow bg-green-50">
      <h2 className="text-xl font-bold mb-4 text-green-800">خلاصه بدهی‌ها</h2>
      <ul className="space-y-3">
        {debtsArray.map((debt, index) => (
          <li key={index} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <span className="font-semibold">{debt.from}</span>
            <span className="text-sm text-gray-600">بدهکار است به</span>
            <span className="font-semibold text-indigo-600">{debt.to}</span>
            <span className="text-lg font-bold text-red-600">
              {debt.amount.toLocaleString('fa-IR')}
              <span className="text-sm font-normal text-gray-500 mr-1">تومان</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DebtSummary;