import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Mail, CheckCircle2, XCircle, AlertTriangle, Search, Filter, Copy, Download, Trash2, ArrowRight, HelpCircle } from 'lucide-react';
import { auth } from '../../lib/firebase';

interface VerificationResult {
  email: string;
  isDuplicate: boolean;
  status: 'Verified' | 'Invalid' | 'Risky' | 'Unknown';
  reason: string;
  checks: {
    syntax: boolean;
    mx: boolean;
    disposable: boolean;
    role: boolean;
  };
}

export default function EmailVerification() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [filterState, setFilterState] = useState<'all' | 'Verified' | 'Invalid' | 'Risky' | 'Unknown'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleCheckEmails = async () => {
    if (!inputText.trim()) return;

    setIsChecking(true);
    setHasChecked(false);
    setProgress(0);
    
    try {
      const rawEmails = inputText.split(/[,\n\s]+/).filter(e => e.trim().length > 0);
      const uniqueEmails = Array.from(new Set(rawEmails));
      
      const processedResults: VerificationResult[] = [];
      const batchSize = 10;
      
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';

      for (let i = 0; i < uniqueEmails.length; i += batchSize) {
        const batch = uniqueEmails.slice(i, i + batchSize);
        
        try {
          const response = await fetch('/api/email-verifier/verify', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
             },
             body: JSON.stringify({ emails: batch })
          });
          
          if (response.ok) {
             const data = await response.json();
             if (data.results) {
               data.results.forEach((r: any) => processedResults.push({ ...r, isDuplicate: false }));
             }
          }
        } catch (err) {
          console.error("Batch error:", err);
        }
        
        // Update progress safely not to exceed 100 before done
        setProgress(Math.round(((i + batch.length) / uniqueEmails.length) * 100));
      }

      const finalResults: VerificationResult[] = [];
      const seenEmails = new Set<string>();
      const resultMap = new Map<string, any>();
      processedResults.forEach(r => resultMap.set(r.email, r));

      rawEmails.forEach(email => {
         const isDuplicateRow = seenEmails.has(email);
         seenEmails.add(email);
         
         const r = resultMap.get(email) || {
            email, status: 'Unknown', reason: 'Verification failed', checks: { syntax: false, mx: false, disposable: false, role: false }
         };
         
         finalResults.push({
           ...r,
           isDuplicate: isDuplicateRow
         });
      });

      setResults(finalResults);
      setHasChecked(true);
    } catch (error) {
      console.error('Error verifying emails:', error);
    } finally {
      setIsChecking(false);
      setProgress(100);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResults([]);
    setHasChecked(false);
    setSearchQuery('');
    setFilterState('all');
  };

  const filteredResults = useMemo(() => {
    return results.filter(item => {
      const matchesFilter = filterState === 'all' || item.status === filterState;
      const matchesSearch = item.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [results, filterState, searchQuery]);

  const stats = useMemo(() => {
    const uniqueResults = results.filter(r => !r.isDuplicate);
    return {
      totalInput: results.length,
      duplicates: results.filter(r => r.isDuplicate).length,
      totalChecked: uniqueResults.length,
      verified: uniqueResults.filter(r => r.status === 'Verified').length,
      invalid: uniqueResults.filter(r => r.status === 'Invalid').length,
      risky: uniqueResults.filter(r => r.status === 'Risky').length,
      unknown: uniqueResults.filter(r => r.status === 'Unknown').length,
    };
  }, [results]);

  const copyVerified = () => {
    const verifiedEmails = results.filter(r => !r.isDuplicate && r.status === 'Verified').map(r => r.email).join('\n');
    navigator.clipboard.writeText(verifiedEmails);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Status,Reason\n"
      + results.filter(r => !r.isDuplicate).map(r => `${r.email},${r.status},${r.reason}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "verified_emails.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-neon-pink selection:text-black">
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon-cyan/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-pink/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32 lg:pt-40">
        
        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20 relative">
          <div className="w-full lg:w-1/2 text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-neon-cyan/30 mb-6 shadow-[0_0_20px_rgba(0,243,255,0.15)] backdrop-blur-3xl"
            >
              <div className="flex relative w-2.5 h-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan shadow-[0_0_10px_#00f3ff]"></span>
              </div>
              <span className="text-xs font-mono tracking-widest text-neon-cyan uppercase font-bold">
                Email Intelligence
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-display font-bold tracking-tight mb-6 leading-tight"
            >
              Verify Emails <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-green-400">Before You Launch</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-xl leading-relaxed mb-8"
            >
              Paste single or bulk email lists and instantly identify valid, invalid and risky emails before sending campaigns. Protect your sender reputation.
            </motion.p>
          </div>
          
          <div className="w-full lg:w-1/2 relative lg:h-[400px] flex justify-center lg:justify-end items-center pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative w-64 h-64 lg:w-80 lg:h-80"
            >
              <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-neon-cyan/30 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                   <div className="w-32 h-32 rounded-3xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(0,243,255,0.2)]">
                     <ShieldCheck className="w-16 h-16 text-neon-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
                   </div>
                   
                   {/* Floating particles */}
                   <motion.div 
                     animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                     transition={{ repeat: Infinity, duration: 3, delay: 0 }}
                     className="absolute -top-6 -right-6 bg-green-500/20 border border-green-500/50 p-2 rounded-xl backdrop-blur-md"
                   >
                     <CheckCircle2 className="w-5 h-5 text-green-400" />
                   </motion.div>
                   
                   <motion.div 
                     animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                     transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                     className="absolute -bottom-4 -left-8 bg-red-500/20 border border-red-500/50 p-2 rounded-xl backdrop-blur-md"
                   >
                     <XCircle className="w-5 h-5 text-red-400" />
                   </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* INPUT SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 md:p-8 rounded-3xl border border-white/10 mb-16 relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute inset-x-0 -top-px h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-neon-cyan" />
            <h2 className="text-xl font-display font-medium text-white">Input Emails</h2>
          </div>
          
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste emails here, one per line, space separated, or separated by commas..."
              className="w-full h-64 bg-black/40 border border-white/10 rounded-2xl p-5 text-gray-300 font-mono text-sm focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 resize-y transition-all placeholder:text-gray-600"
            />
            {inputText.length > 0 && (
               <div className="absolute top-4 right-4 text-xs font-mono text-gray-500 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md">
                 Length: {inputText.length}
               </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
            <div className="text-sm font-mono text-gray-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500/70" />
              Pre-launch frontend verification check
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {inputText && (
                <button 
                  onClick={handleClear}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
              )}
              
              <button 
                onClick={handleCheckEmails}
                disabled={!inputText.trim() || isChecking}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-500 text-black font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center relative overflow-hidden"
              >
                {isChecking && (
                  <div className="absolute left-0 bottom-0 h-1 bg-black/50" style={{ width: `${progress}%`, transition: 'width 0.3s ease' }} />
                )}
                {isChecking ? (
                  <span className="flex items-center gap-2">
                     <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                     Checking {progress}%
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" /> Check Emails
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* RESULTS SECTION */}
        {hasChecked && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="glass p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:bg-white/[0.03] transition-colors group">
                 <span className="text-gray-400 text-sm font-medium">Total Checked</span>
                 <span className="text-3xl font-display font-bold mt-2 text-white group-hover:text-neon-cyan transition-colors">{stats.totalChecked}</span>
              </div>
              <div className="glass p-5 rounded-2xl border border-green-500/20 bg-green-500/5 flex flex-col justify-between">
                 <span className="text-green-400/80 text-sm font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Verified</span>
                 <span className="text-3xl font-display font-bold mt-2 text-green-400 shadow-green-500/50 drop-shadow-lg">{stats.verified}</span>
              </div>
              <div className="glass p-5 rounded-2xl border border-red-500/20 bg-red-500/5 flex flex-col justify-between">
                 <span className="text-red-400/80 text-sm font-medium flex items-center gap-1.5"><XCircle className="w-4 h-4"/> Invalid</span>
                 <span className="text-3xl font-display font-bold mt-2 text-red-500">{stats.invalid}</span>
              </div>
              <div className="glass p-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex flex-col justify-between">
                 <span className="text-yellow-400/80 text-sm font-medium flex items-center gap-1.5"><AlertTriangle className="w-4 h-4"/> Risky</span>
                 <span className="text-3xl font-display font-bold mt-2 text-yellow-500">{stats.risky}</span>
              </div>
              <div className="glass p-5 rounded-2xl border border-gray-500/20 bg-gray-500/5 flex flex-col justify-between">
                 <span className="text-gray-400/80 text-sm font-medium flex items-center gap-1.5"><HelpCircle className="w-4 h-4"/> Unknown</span>
                 <span className="text-3xl font-display font-bold mt-2 text-gray-400">{stats.unknown}</span>
              </div>
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5 border border-white/10 p-2 sm:p-4 rounded-2xl backdrop-blur-md">
               
               <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl w-full sm:w-auto">
                 <button 
                   onClick={() => setFilterState('all')}
                   className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterState === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                   All
                 </button>
                 <button 
                   onClick={() => setFilterState('Verified')}
                   className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterState === 'Verified' ? 'bg-green-500/20 text-green-400 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                   Verified
                 </button>
                 <button 
                   onClick={() => setFilterState('Invalid')}
                   className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterState === 'Invalid' ? 'bg-red-500/20 text-red-400 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                   Invalid
                 </button>
                 <button 
                   onClick={() => setFilterState('Risky')}
                   className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterState === 'Risky' ? 'bg-yellow-500/20 text-yellow-400 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                   Risky
                 </button>
                 <button 
                   onClick={() => setFilterState('Unknown')}
                   className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterState === 'Unknown' ? 'bg-gray-500/20 text-gray-400 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                   Unknown
                 </button>
               </div>

               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <div className="relative w-full sm:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                   <input 
                     type="text" 
                     placeholder="Search emails..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-cyan/50"
                   />
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={copyVerified}
                     title="Copy verified emails"
                     disabled={stats.verified === 0}
                     className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-neon-cyan hover:bg-white/10 transition-colors disabled:opacity-50"
                   >
                     <Copy className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={exportCSV}
                     title="Export CSV"
                     disabled={stats.totalChecked === 0}
                     className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-emerald-400 hover:bg-white/10 transition-colors disabled:opacity-50"
                   >
                     <Download className="w-4 h-4" />
                   </button>
                 </div>
               </div>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-white/10 bg-black/20 text-xs font-mono uppercase tracking-wider text-gray-400">
                       <th className="px-6 py-4 font-medium text-center w-16">#</th>
                       <th className="px-6 py-4 font-medium">Email</th>
                       <th className="px-6 py-4 font-medium">Status</th>
                       <th className="px-6 py-4 font-medium">Reason</th>
                       <th className="px-6 py-4 font-medium text-right">Icon</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     <AnimatePresence>
                       {filteredResults.length > 0 ? (
                         filteredResults.map((item, idx) => (
                           <motion.tr 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             transition={{ duration: 0.2 }}
                             key={`${item.email}-${idx}`} 
                             className="hover:bg-white/[0.02] transition-colors group"
                           >
                             <td className="px-6 py-4 text-sm font-mono text-gray-600 text-center">{idx + 1}</td>
                             <td className="px-6 py-4 text-sm text-gray-300 font-medium font-mono truncate max-w-xs sm:max-w-md">
                               {item.email}
                               {item.isDuplicate && (
                                 <span className="ml-3 inline-block px-2 text-[10px] uppercase font-bold tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-md">
                                   Duplicate
                                 </span>
                               )}
                             </td>
                             <td className="px-6 py-4">
                               {item.status === 'Verified' && (
                                 <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
                                   <span className="text-xs font-medium text-green-400">Verified</span>
                                 </div>
                               )}
                               {item.status === 'Invalid' && (
                                 <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                                   <span className="text-xs font-medium text-red-400">Invalid</span>
                                 </div>
                               )}
                               {item.status === 'Risky' && (
                                 <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                   <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]" />
                                   <span className="text-xs font-medium text-yellow-400">Risky</span>
                                 </div>
                               )}
                               {item.status === 'Unknown' && (
                                 <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-500/10 border border-gray-500/20">
                                   <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shadow-[0_0_8px_#9ca3af]" />
                                   <span className="text-xs font-medium text-gray-400">Unknown</span>
                                 </div>
                               )}
                             </td>
                             <td className="px-6 py-4 text-xs font-mono text-gray-400">
                               {item.reason}
                             </td>
                             <td className="px-6 py-4 text-right">
                               {item.status === 'Verified' && <CheckCircle2 className="w-5 h-5 text-green-400 inline-block drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" />}
                               {item.status === 'Invalid' && <XCircle className="w-5 h-5 text-red-500 inline-block drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />}
                               {item.status === 'Risky' && <AlertTriangle className="w-5 h-5 text-yellow-500 inline-block drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />}
                               {item.status === 'Unknown' && <HelpCircle className="w-5 h-5 text-gray-400 inline-block drop-shadow-[0_0_5px_rgba(156,163,175,0.5)]" />}
                             </td>
                           </motion.tr>
                         ))
                       ) : (
                         <tr>
                           <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                             {searchQuery ? "No emails match your search." : "No emails to display."}
                           </td>
                         </tr>
                       )}
                     </AnimatePresence>
                   </tbody>
                 </table>
               </div>
            </div>
            
          </motion.div>
        )}

      </div>
    </div>
  );
}
