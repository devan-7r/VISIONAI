import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, Search, Filter, Trash2, Download, Calendar, Clock, Layers } from 'lucide-react';

export const HistoryView = () => {
  const { history, clearHistory, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.objects.some(obj => obj.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const exportHistoryCSV = () => {
    if (history.length === 0) {
      addToast('No history records to export', 'warning');
      return;
    }
    const headers = ['ID', 'Date', 'Time', 'Type', 'Objects', 'Count', 'AvgConfidence%', 'LatencyMs'];
    const rows = history.map(h => [
      h.id,
      h.date,
      h.time,
      `"${h.type}"`,
      `"${h.objects.join('; ')}"`,
      h.count,
      h.avgConfidence,
      h.processingTime
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visionai-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('History exported as CSV file!', 'success');
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Detection History Log</h2>
            <p className="text-xs text-slate-400">Stored history of camera snapshots and analyzed objects</p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportHistoryCSV}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={clearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 disabled:opacity-50 text-red-300 font-semibold text-xs border border-red-800 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by object name (e.g. car, laptop) or detection type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-teal-500 transition-all"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="live">Live Detection</option>
            <option value="image">Image Detection</option>
            <option value="video">Video Detection</option>
          </select>
        </div>
      </div>

      {/* History Grid Cards */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-panel border border-slate-800 space-y-3 text-slate-500">
          <History className="w-12 h-12 mx-auto text-slate-600 animate-pulse" />
          <h4 className="text-base font-bold text-slate-300">No History Records Found</h4>
          <p className="text-xs text-slate-500">Run an object detection session in the Home Workspace to log entries here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="glass-panel-interactive rounded-2xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800">
                <img src={item.thumbnail} alt={item.type} className="w-full h-full object-cover" />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-dark-900/80 backdrop-blur-md text-teal-300 font-mono text-[10px] border border-slate-700">
                  {item.type}
                </span>
              </div>

              {/* Body Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.time}</span>
                  </div>
                </div>

                {/* Objects Tags */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Detected Objects ({item.count}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.objects.map((obj, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-900 text-teal-300 font-mono text-[11px] border border-slate-800"
                      >
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Latency & Confidence */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Confidence: <strong className="text-teal-400">{item.avgConfidence}%</strong></span>
                <span>Latency: <strong className="text-amber-400">{item.processingTime}ms</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
