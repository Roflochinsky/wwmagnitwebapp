import React from 'react';

const transactions = [
    { name: 'Royal Arkin', status: 'In progress', date: '22 Jan, 2023', amount: '$12,334', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { name: 'Saimon Tanvir', status: 'Completed', date: '28 Dec, 2023', amount: '$20,334', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    // Add a few more for fullness
    { name: 'Jennifer Smith', status: 'Completed', date: '15 Dec, 2023', amount: '$8,500', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

const TransactionTable = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Transactions</h3>
                <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                    <button className="px-3 py-1 bg-black text-white text-xs rounded-md shadow-sm">Newest</button>
                    <button className="px-3 py-1 text-gray-500 text-xs hover:bg-white rounded-md transition-colors">Oldest</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                            <th className="pb-3 font-medium pl-2">Name</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium text-right pr-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {transactions.map((t, i) => (
                            <tr key={i} className="group hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-2 rounded-l-xl">
                                    <div className="flex items-center gap-3">
                                        <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="font-semibold text-gray-900">{t.name}</span>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.status === 'In progress' ? 'bg-yellow-100 text-yellow-700' :
                                            t.status === 'Completed' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100'
                                        }`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="py-4 text-gray-500">{t.date}</td>
                                <td className="py-4 text-right font-bold text-gray-900 pr-2 rounded-r-xl">{t.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
