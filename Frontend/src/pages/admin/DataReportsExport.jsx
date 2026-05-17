import React, { useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Download, 
  FileSpreadsheet, 
  Database, 
  CheckCircle, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { exportToCSV } from '../../utils/csvExporter';

export default function DataReportsExport() {
  const [downloading, setDownloading] = useState(false);

  // Function to fetch data and trigger CSV download
  const handleExport = async () => {
    setDownloading(true);
    try {
      // API call to get global enterprise metrics
      const response = await axios.get('/admin/metrics-report');
      
      // Defining Headers for CSV
      const headers = [
        'Metric Name', 
        'Current Count/Value', 
        'Report Generation Time'
      ];

      // Mapping data to Rows
      const rows = [
        ['Approved Goal Sheets', response.data.criticalSheetsCount, new Date().toLocaleString()],
        ['Pending Approvals', response.data.outstandingSheetsCount, new Date().toLocaleString()],
        ['Draft Frameworks', response.data.draftSheetsCount, new Date().toLocaleString()],
        ['Total Workforce Coverage', '100%', new Date().toLocaleString()]
      ];

      // Using the utility to generate file
      exportToCSV('GoalSync_System_Report.csv', headers, rows);
      toast.success('Enterprise report generated and downloaded.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to assemble system telemetry data.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-600/20 rounded-xl">
          <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">Data Export Center</h1>
          <p className="text-xs text-slate-400 mt-1">Compile and extract real-time system metrics into portable formats.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Export Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> System Audit Report
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Extracts a complete summary of goal sheet statuses, cycle compliance, and organizational health.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-900">
            <button
              onClick={handleExport}
              disabled={downloading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Ledger...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Generate CSV Export
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info/Guide Card */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 flex flex-col justify-center">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Export Guidelines</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-400">Data is exported in UTF-8 CSV format, compatible with Excel and Google Sheets.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-400">Includes timestamps for accurate point-in-time auditing.</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-400 font-medium text-amber-500/80">Only Administrators have clearance to extract global workforce data.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}