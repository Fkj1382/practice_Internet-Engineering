import React from 'react';

function ExpenseList({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
        هنوز هزینه‌ای ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="border rounded overflow-hidden shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">پرداخت کننده</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مبلغ (تومان)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">توضیحات</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense.id || expense.description + expense.amount}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.paidBy}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                {expense.amount.toLocaleString('fa-IR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.description || 'ندارد'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {(expense.date && new Date(expense.date).toLocaleDateString('fa-IR')) || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;