import { useState, useEffect, DragEvent, ChangeEvent, useRef } from 'react';
import { Mail, Server, Trash2, Plus, Upload, CheckCircle2, ChevronRight, Zap, RefreshCw, Send, ArrowRight, FileType, Search, PenTool, Clock, Calendar, Activity, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EmailBuilderSection from '../../components/dashboard/EmailBuilderSection';
import Papa from 'papaparse';
import * as xlsx from 'xlsx';
import { useAuth } from '../../lib/AuthContext';

export default function EmailAutomation() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [columnsPreview, setColumnsPreview] = useState<string[]>([]);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editColumnValue, setEditColumnValue] = useState('');
  const [variableSearchQuery, setVariableSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Campaign Dispatching States
  const [campaignStatus, setCampaignStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Deletion Modal and Safety check state
  const [deleteTarget, setDeleteTarget] = useState<{ email: string; provider: 'gmail' | 'sheets' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reassignSender, setReassignSender] = useState<string>('');
  const [activeCampaignSender, setActiveCampaignSender] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load connected accounts from Node.js Express backend
  const fetchAccounts = async () => {
    try {
      if (!user) {
        setAccounts([]);
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch('/api/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch (err) {
      console.error('Failed to parse active accounts:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAccounts();
    } else {
      setAccounts([]);
    }

    // Secure cross-origin message event handler for popup OAuth completed notifications
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        fetchAccounts();
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [user]);

  // Securely sever credentials connection on the server
  const initiateRemoveAccount = (email: string, provider: 'gmail' | 'sheets') => {
    setDeleteTarget({ email, provider });
    const otherGmailAccounts = accounts.filter(acc => acc.provider === 'gmail' && acc.email !== email);
    if (otherGmailAccounts.length > 0) {
      setReassignSender(otherGmailAccounts[0].email);
    } else {
      setReassignSender('');
    }
  };

  const executeRemoveAccount = async () => {
    if (!deleteTarget || !user) return;
    setIsDeleting(true);

    try {
      const isTargetActive = deleteTarget.provider === 'gmail' && 
          campaignStatus === 'sending' && 
          activeCampaignSender === deleteTarget.email;

      if (isTargetActive && reassignSender) {
        setActiveCampaignSender(reassignSender);
      } else if (isTargetActive && !reassignSender) {
        setCampaignStatus('idle');
        setActiveCampaignSender(null);
      }

      // Optimistic instant state updates: remove target account from UI list instantly
      const updatedAccounts = accounts.filter(
        acc => !(acc.email === deleteTarget.email && acc.provider === deleteTarget.provider)
      );
      setAccounts(updatedAccounts);

      const token = await user.getIdToken();
      const res = await fetch(`/api/accounts?email=${encodeURIComponent(deleteTarget.email)}&provider=${encodeURIComponent(deleteTarget.provider)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        setToastMessage(`Gmail account disconnected successfully`);
        setTimeout(() => setToastMessage(null), 4000);
        fetchAccounts();
      } else {
        alert('Server failed disconnecting the account.');
        fetchAccounts();
      }
    } catch (err) {
      console.error('Failed to sever account connection:', err);
      alert('Error disconnecting account.');
      fetchAccounts();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Google OAuth popup trigger
  const handleConnectGoogle = async (type: 'gmail' | 'sheets') => {
    if (!user) {
      alert('You must be authenticated to map OAuth engines.');
      return;
    }
    try {
      setUploadError('');
      setIsUploading(true);
      const token = await user.getIdToken();
      const res = await fetch(`/api/auth/google/url?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Google OAuth configuration key is not configured inside settings panel.');
      }
      const { url } = await res.json();

      const width = 500;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        url,
        `google_oauth_${type}`,
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      if (!popup) {
        alert('Browser popup blocked. Please authorize popups to enable Google authentication.');
      }
    } catch (e: any) {
      setUploadError(e.message || 'Error configuring Auth redirect.');
    } finally {
      setIsUploading(false);
    }
  };

  // Dispatch campaign variables through Real Gmail REST APIs
  const handleInitializeSequence = async () => {
    if (!user) {
      alert('Authentication session expired. Please log in.');
      return;
    }
    if (leads.length === 0) {
      alert('Audience injector is empty. Please upload a spreadsheet or sync Google Sheets to load the leads database.');
      return;
    }

    const gmailAccounts = accounts.filter(acc => acc.provider === 'gmail');
    if (gmailAccounts.length === 0) {
      alert('No active Gmail Outbox channels detected. Please connect at least 1 Gmail account to act as campaign sender.');
      return;
    }

    const fromEmail = activeCampaignSender || gmailAccounts[0].email; // Dispatches from active sender or first available channel
    const subject = localStorage.getItem('genzio_campaign_subject') || 'Re: Transforming outreach at {Company}';
    const body = localStorage.getItem('genzio_campaign_body') || 'Hi {Name},<br><br>Are you open to exploring better systems that scale?';

    const confirmed = window.confirm(`Confirm: Send real personalized campaign email campaign to ${leads.length} leads from ${fromEmail} inside real-time intervals?`);
    if (!confirmed) return;

    setCampaignStatus('sending');
    setActiveCampaignSender(fromEmail);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/campaign/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fromEmail,
          leads,
          subject,
          body
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server error deploying campaign outbox.');
      }

      const outcome = await res.json();
      const sentCount = outcome.results?.filter((r: any) => r.status === 'Sent').length || 0;
      const failedCount = (outcome.results?.length || 0) - sentCount;
      
      setCampaignStatus('success');
      setActiveCampaignSender(null);
      alert(`Success! Dispatched campaign emails. Sent: ${sentCount} | Failed: ${failedCount}.`);
    } catch (e: any) {
      setCampaignStatus('error');
      setActiveCampaignSender(null);
      alert(`Initialization stalled: ${e.message}`);
    }
  };


  // Automation Scheduling States
  const [delayType, setDelayType] = useState<'fixed' | 'smart'>('fixed');
  
  // Fixed Delay state
  const [fixedDelayValue, setFixedDelayValue] = useState(2);
  const [fixedDelayUnit, setFixedDelayUnit] = useState<'Seconds' | 'Minutes' | 'Hours' | 'Days'>('Minutes');

  // Smart Distribution state
  const [smartDistValue, setSmartDistValue] = useState(3);
  const [smartDistUnit, setSmartDistUnit] = useState<'Minutes' | 'Hours' | 'Days'>('Hours');

  const processHeaders = (headers: string[]): string[] => {
    const vars = headers.map(h => {
      if (!h) return '';
      return h.trim();
    });
    // Remove empty and duplicates
    return [...new Set(vars.filter(Boolean))];
  };

  const processData = (data: any[], headers: string[]) => {
    const validHeaders = processHeaders(headers);
    setColumnsPreview(validHeaders);

    const formattedData = data.map(row => {
      const obj: any = {};
      headers.forEach((h, i) => {
        const key = h?.trim();
        if (key) {
          obj[key] = Array.isArray(row) ? row[i] : row[h];
        }
      });
      return obj;
    }).filter(row => Object.keys(row).length > 0);

    setLeads(formattedData);
  };

  const renameVariable = (oldVar: string, newVar: string) => {
    if (!newVar || newVar === oldVar) {
      setEditingColumn(null);
      return;
    }
    const sanitizedNewVar = newVar.trim();
    if (columnsPreview.includes(sanitizedNewVar)) {
      setEditingColumn(null);
      return; // duplicate
    }
    
    setColumnsPreview(prev => prev.map(c => c === oldVar ? sanitizedNewVar : c));
    setLeads(prev => prev.map(l => {
      const { [oldVar]: val, ...rest } = l;
      return { ...rest, [sanitizedNewVar]: val };
    }));
    setEditingColumn(null);
  };

  const parseFile = async (file: File) => {
    setUploadError('');
    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      if (file.name.toLowerCase().endsWith('.csv')) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.meta.fields) {
              processData(results.data, results.meta.fields);
            }
            setIsUploading(false);
            setActiveStep(3); // Automatically advance after upload
          },
          error: (error) => {
            setUploadError(error.message);
            setIsUploading(false);
          }
        });
      } else if (file.name.toLowerCase().endsWith('.xlsx')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = xlsx.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (json.length > 0) {
              const headers = json[0] as string[];
              const rows = json.slice(1);
              processData(rows, headers);
            }
            setIsUploading(false);
            setActiveStep(3); // Automatically advance after upload
          } catch (err: any) {
            setUploadError('Failed to parse Excel file. ' + err.message);
            setIsUploading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setUploadError('Unsupported file format. Please upload CSV or XLSX.');
        setIsUploading(false);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error processing file');
      setIsUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      parseFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseFile(file);
    }
  };

  const handleUrlSubmit = async () => {
    if (!sheetUrl) return;
    if (!user) {
      alert('You must be authenticated to import Google Sheets records.');
      return;
    }
    setUploadError('');
    setIsUploading(true);
    
    // Check if Sheets OAuth has been connected
    const hasSheetsAuth = accounts.some(acc => acc.provider === 'sheets');
    if (!hasSheetsAuth) {
      alert('Please authorize Google Sheets integration first in the pop-up window, then click Sync.');
      handleConnectGoogle('sheets');
      setIsUploading(false);
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/sheets/import', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: sheetUrl })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Sync error: ${res.statusText}`);
      }

      const data = await res.json();
      setUploadedFileName(data.sheetName || 'Google Sheet Imported');
      if (data.headers) {
        processData(data.rows, data.headers);
      }
      setActiveStep(3); // Automatically advance after sync success
    } catch (err: any) {
      setUploadError(err.message || 'Trouble syncing Google Sheet data.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveFile = () => {
    setUploadedFileName('');
    setLeads([]);
    setColumnsPreview([]);
    setSheetUrl('');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyVariable = (v: string) => {
    navigator.clipboard.writeText(`{${v}}`);
    // Optional: show a small toast, but standard browser behavior works for simple use case
  };

  const calculateEstimate = () => {
    let totalSeconds = 0;
    const leadsCount = leads.length > 0 ? leads.length : 0;
    
    if (leadsCount <= 1) {
       return { duration: 'Instant', completion: new Date().toLocaleString() };
    }

    if (delayType === 'fixed') {
       let multiplier = 1;
       if (fixedDelayUnit === 'Minutes') multiplier = 60;
       if (fixedDelayUnit === 'Hours') multiplier = 3600;
       if (fixedDelayUnit === 'Days') multiplier = 86400;
       
       totalSeconds = fixedDelayValue * multiplier * (leadsCount - 1);
    } else {
       let multiplier = 60;
       if (smartDistUnit === 'Hours') multiplier = 3600;
       if (smartDistUnit === 'Days') multiplier = 86400;
       
       totalSeconds = smartDistValue * multiplier;
    }

    let durationString = '';
    if (totalSeconds < 60) durationString = `${Math.floor(totalSeconds)} Secs`;
    else if (totalSeconds < 3600) durationString = `${Math.floor(totalSeconds / 60)} Mins`;
    else if (totalSeconds < 86400) durationString = `${Math.floor(totalSeconds / 3600)} Hours, ${Math.floor((totalSeconds % 3600) / 60)} Mins`;
    else durationString = `${Math.floor(totalSeconds / 86400)} Days, ${Math.floor((totalSeconds % 86400) / 3600)} Hours`;

    const completionDate = new Date(Date.now() + totalSeconds * 1000);
    
    return {
       duration: durationString,
       completion: completionDate.toLocaleString(undefined, {
          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
       })
    };
  };

  const { duration: estimatedDuration, completion: estimatedCompletion } = calculateEstimate();

  return (
    <div className="bg-transparent text-white min-h-screen pt-32 pb-24 font-sans max-w-7xl mx-auto px-4 lg:px-8 relative overflow-hidden">
      
      {/* Immersive Background */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[radial-gradient(ellipse_at_center,_rgba(0,243,255,0.05)_0%,_transparent_70%)] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_rgba(255,0,255,0.05)_0%,_transparent_70%)] pointer-events-none -z-10" />

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <motion.div
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/5 mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-neon-cyan shadow-[0_0_10px_#00f3ff] animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Creator Workspace</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-4 text-white">
            Automation <span className="text-gradient">Studio.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
            Configure senders, shape your audience, and design the perfectly timed conversational sequence.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        
        {/* SECTION 1: Connect Inboxes */}
        <section id="connect-accounts-section" className={`glass-card p-10 md:p-12 rounded-[2.5rem] border transition-all duration-500 overflow-hidden relative ${activeStep >= 1 ? 'border-white/10 hover:border-neon-cyan/30 hover:shadow-[0_0_40px_rgba(0,243,255,0.05)] bg-[#050508]/80' : 'border-transparent opacity-40'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-5 mb-10 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center font-bold text-neon-cyan text-xl shadow-[0_0_20px_rgba(0,243,255,0.1)]">1</div>
            <div>
              <h2 className="text-3xl font-display font-bold">Email Engines</h2>
              <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-bold">Rotate up to 5 domains</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="bg-[#0a0a0f] p-8 rounded-3xl border border-white/5 shadow-inner">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center justify-between">
                <span>Active Channels</span>
                <span className="bg-white/5 px-3 py-1 rounded-full text-white">{accounts.length}/5</span>
              </h3>
              <div className="flex flex-col gap-4">
                <AnimatePresence>
                  {accounts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/5"
                    >
                      <p className="text-gray-400 text-sm font-semibold mb-1">No Gmail accounts connected</p>
                    </motion.div>
                  ) : (
                    accounts.map((acc, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/20 rounded-2xl transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-neon-cyan/10 rounded-xl">
                            {acc.provider === 'sheets' ? <Database className="w-5 h-5 text-neon-pink" /> : <Mail className="w-5 h-5 text-neon-cyan" />}
                          </div>
                          <div>
                            <p className="font-mono text-sm font-bold text-white">{acc.email}</p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              Type: <span className={acc.provider === 'sheets' ? 'text-neon-pink font-bold' : 'text-neon-cyan font-bold'}>{acc.provider === 'sheets' ? 'Sheets API' : 'Gmail Outbox'}</span> • {acc.status}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => initiateRemoveAccount(acc.email, acc.provider)}
                          className="text-gray-500 hover:text-red-400 p-3 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all mt-4 sm:mt-0 self-end sm:self-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Connect New Provider</div>
              <button 
                onClick={() => handleConnectGoogle('gmail')}
                className="btn-primary flex items-center justify-center gap-3 py-4 rounded-2xl w-full text-sm hover-glow-cyan hover-float"
              >
                <Plus className="w-5 h-5" /> Connect Gmail
              </button>
              <button 
                onClick={() => handleConnectGoogle('sheets')}
                className="glass-card flex items-center justify-center gap-3 py-4 rounded-2xl w-full text-sm border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-white font-bold hover-float"
              >
                <Plus className="w-5 h-5" /> Connect Google Sheets API
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: Import Leads */}
        <section className={`glass-card p-10 md:p-12 rounded-[2.5rem] border transition-all duration-500 overflow-hidden relative ${activeStep >= 2 ? 'border-white/10 hover:border-neon-pink/30 hover:shadow-[0_0_40px_rgba(255,0,255,0.05)] bg-[#050508]/80' : 'border-transparent opacity-40'}`}>
          <div className="absolute top-0 left-0 w-64 h-64 bg-neon-pink/5 blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-5 mb-10 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-neon-pink/10 border border-neon-pink/30 flex items-center justify-center font-bold text-neon-pink text-xl shadow-[0_0_20px_rgba(255,0,255,0.1)]">2</div>
            <div>
              <h2 className="text-3xl font-display font-bold">Audience Injection</h2>
              <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-bold">Feed leads into the engine</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
             {uploadedFileName ? (
               <div className="border border-neon-pink/20 bg-[#0a0a0f] rounded-3xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-inner">
                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-neon-pink/0 via-neon-pink to-neon-cyan/0"></div>
                 <div className="w-20 h-20 bg-neon-pink/10 rounded-full flex items-center justify-center mb-6 border border-neon-pink/20">
                   <CheckCircle2 className="w-10 h-10 text-neon-pink" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2 font-display">Data Ingested</h3>
                 <p className="text-sm font-mono text-gray-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg mb-8">{uploadedFileName}</p>
                 
                 <div className="grid grid-cols-2 gap-3 w-full mb-8">
                   <div className="bg-[#050508] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Rows</span>
                     <span className="text-2xl font-mono font-bold text-white">{leads.length}</span>
                   </div>
                   <div className="bg-[#050508] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Columns</span>
                     <span className="text-2xl font-mono font-bold text-white">{columnsPreview.length}</span>
                   </div>
                 </div>

                 <button 
                   onClick={handleRemoveFile}
                   className="text-gray-500 hover:text-red-400 text-sm font-bold flex items-center gap-2 transition-colors hover:bg-white/5 py-3 px-6 rounded-xl border border-transparent hover:border-red-500/20"
                 >
                   <Trash2 className="w-chat h-4" /> Reset Data Source
                 </button>
               </div>
             ) : (
               <div className="flex flex-col gap-6">
                 <div 
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={handleDrop}
                   className="relative border-2 border-dashed border-white/10 hover:border-neon-pink/50 bg-[#0a0a0f] rounded-3xl p-12 flex flex-col items-center justify-center transition-all text-center group"
                 >
                   <input 
                     ref={fileInputRef}
                     type="file" 
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" 
                     accept=".csv, .xlsx"
                     onChange={handleFileChange}
                     disabled={isUploading}
                   />
                   {isUploading ? (
                      <RefreshCw className="w-12 h-12 text-neon-pink animate-spin mb-6" />
                   ) : (
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-neon-pink/10 group-hover:scale-110 transition-all">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-neon-pink transition-colors" />
                      </div>
                   )}
                   <p className="text-xl font-bold text-white mb-2">Drag & Drop Database</p>
                   <p className="text-sm text-gray-500 font-mono">Accepts .CSV or .XLSX</p>
                 </div>
                 
                 <div className="flex items-center gap-4">
                   <div className="h-px bg-white/5 flex-1"></div>
                   <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">OR</span>
                   <div className="h-px bg-white/5 flex-1"></div>
                 </div>

                 <div className="flex gap-3">
                   <input 
                     type="text" 
                     placeholder="Connect Google Sheets URL..." 
                     value={sheetUrl}
                     onChange={(e) => setSheetUrl(e.target.value)}
                     disabled={isUploading}
                     className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-neon-pink outline-none transition-colors"
                   />
                   <button 
                     onClick={handleUrlSubmit}
                     disabled={isUploading || !sheetUrl}
                     className={`px-8 py-4 text-sm font-bold rounded-2xl transition-all border ${isUploading || !sheetUrl ? 'bg-white/5 text-gray-600 border-transparent cursor-not-allowed' : 'bg-neon-pink text-matte-black border-neon-pink hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:bg-white hover:text-black hover:border-white'}`}
                   >
                     Sync
                   </button>
                 </div>

                 {uploadError && (
                   <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm rounded-2xl p-4 text-center">
                     {uploadError}
                   </div>
                 )}
               </div>
             )}

             <div className="bg-[#0a0a0f] p-8 rounded-3xl border border-white/5 flex flex-col shadow-inner">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center justify-between">
                  <span>Data Mapping</span>
                  {leads.length > 0 && <span className="text-[10px] bg-white/5 border border-white/10 text-white px-3 py-1 rounded-md font-mono">Detected Variables</span>}
                </h3>
                
                {leads.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 p-8 border border-dashed border-white/10 rounded-2xl">
                    <Database className="w-10 h-10 mb-4 text-gray-500" />
                    <p className="text-gray-400 text-sm">Upload a source to map variables.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 flex-1">
                    <div className="bg-[#050508] border border-white/5 rounded-2xl p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Available Variables</span>
                        <div className="relative w-full sm:w-auto">
                          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                          <input 
                            type="text"
                            placeholder="Filter..."
                            value={variableSearchQuery}
                            onChange={e => setVariableSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 pl-9 text-sm text-white focus:border-neon-cyan outline-none w-full sm:w-48 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {columnsPreview
                          .filter(col => col.toLowerCase().includes(variableSearchQuery.toLowerCase()))
                          .map((col, idx) => (
                          <div key={idx} className="group relative flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/30 text-gray-300 pl-3 pr-2 py-1.5 rounded-lg font-mono text-sm transition-all hover:-translate-y-0.5">
                            {editingColumn === col ? (
                                <input
                                  type="text"
                                  autoFocus
                                  value={editColumnValue}
                                  onChange={e => setEditColumnValue(e.target.value)}
                                  onBlur={() => renameVariable(col, editColumnValue)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') renameVariable(col, editColumnValue);
                                    if (e.key === 'Escape') setEditingColumn(null);
                                  }}
                                  className="bg-transparent border-none outline-none text-neon-cyan w-24 text-sm font-bold font-mono"
                                />
                            ) : (
                                <span className="font-bold text-white">{'{'}{col}{'}'}</span>
                            )}
                            
                            {!editingColumn && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <button
                                  onClick={() => {
                                    setEditingColumn(col);
                                    setEditColumnValue(col);
                                  }}
                                  className="p-1.5 bg-white/10 hover:bg-white/20 hover:text-white text-gray-400 rounded-md transition-all"
                                  title="Rename / Set Custom Alias"
                                >
                                  <PenTool className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => copyVariable(col)}
                                  className="p-1.5 bg-neon-cyan/20 hover:bg-neon-cyan text-neon-cyan hover:text-black rounded-md transition-all"
                                  title="Copy Variable"
                                >
                                  <FileType className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        {columnsPreview.filter(col => col.toLowerCase().includes(variableSearchQuery.toLowerCase())).length === 0 && (
                          <p className="text-sm text-gray-500 p-2">No matching variables found.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </section>

        {/* SECTION 3: Campaign Builder */}
        <EmailBuilderSection 
          activeStep={activeStep} 
          availableVariables={columnsPreview}
          leads={leads}
        />

        {/* SECTION 4: Automation Settings */}
        <section className={`glass-card p-10 md:p-12 rounded-[2.5rem] border transition-all duration-500 overflow-hidden relative ${activeStep >= 3 ? 'border-white/10 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.05)] bg-[#050508]/80' : 'border-transparent opacity-40 pointer-events-none'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] pointer-events-none" />

          <div className="flex items-center gap-5 mb-10 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400 text-xl shadow-[0_0_20px_rgba(168,85,247,0.1)]">3</div>
            <div>
              <h2 className="text-3xl font-display font-bold">Dispatch Rules</h2>
              <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-bold">Configure engine limits</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 relative z-10">
            <div className="flex-1 space-y-8">
              {/* Delay Type Selector */}
              <div className="bg-[#0a0a0f] p-1.5 rounded-2xl inline-flex w-full sm:w-auto border border-white/5">
                <button 
                  onClick={() => setDelayType('fixed')}
                  className={`flex-1 sm:flex-none px-8 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-3 ${delayType === 'fixed' ? 'bg-white/10 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
                >
                  <Clock className="w-4 h-4" /> Fixed Interval
                </button>
                <button 
                  onClick={() => setDelayType('smart')}
                  className={`flex-1 sm:flex-none px-8 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-3 ${delayType === 'smart' ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)] border border-purple-500/30' : 'text-gray-500 hover:text-white'}`}
                >
                  <Activity className="w-4 h-4" /> Smart Window
                </button>
              </div>

              <div className="bg-[#0a0a0f] p-8 rounded-3xl border border-white/5 shadow-inner">
                {delayType === 'fixed' ? (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="text-lg font-display font-bold text-white mb-2">Fixed Delay</h3>
                    <p className="text-sm text-gray-400 mb-8 max-w-md leading-relaxed">Apply exact algorithmic delay automatically between every email sent to protect sender reputation.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3">Value</label>
                        <input 
                          type="number" 
                          min="1"
                          value={fixedDelayValue}
                          onChange={(e) => setFixedDelayValue(parseInt(e.target.value) || 1)}
                          className="w-full bg-[#050508] border border-white/10 rounded-2xl px-6 py-4 text-white text-lg font-mono focus:border-neon-cyan outline-none transition-colors" 
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3">Unit</label>
                        <select 
                          value={fixedDelayUnit}
                          onChange={(e) => setFixedDelayUnit(e.target.value as any)}
                          className="w-full bg-[#050508] border border-white/10 rounded-2xl px-6 py-4 text-white text-lg focus:border-neon-cyan outline-none transition-colors cursor-pointer appearance-none"
                        >
                          <option value="Seconds">Seconds</option>
                          <option value="Minutes">Minutes</option>
                          <option value="Hours">Hours</option>
                          <option value="Days">Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="text-lg font-display font-bold text-white mb-2">Distribution Window</h3>
                    <p className="text-sm text-gray-400 mb-8 max-w-md leading-relaxed">System will automatically map natural variations to complete all sends randomly within this timeframe.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3">Window Value</label>
                        <input 
                          type="number" 
                          min="1"
                          value={smartDistValue}
                          onChange={(e) => setSmartDistValue(parseInt(e.target.value) || 1)}
                          className="w-full bg-[#050508] border border-white/10 rounded-2xl px-6 py-4 text-white text-lg font-mono focus:border-purple-400 outline-none transition-colors" 
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3">Window Unit</label>
                        <select 
                          value={smartDistUnit}
                          onChange={(e) => setSmartDistUnit(e.target.value as any)}
                          className="w-full bg-[#050508] border border-white/10 rounded-2xl px-6 py-4 text-white text-lg focus:border-purple-400 outline-none transition-colors cursor-pointer appearance-none"
                        >
                          <option value="Minutes">Minutes</option>
                          <option value="Hours">Hours</option>
                          <option value="Days">Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Summary Card */}
            <div className="lg:w-96">
              <div className="bg-[#050508] p-8 rounded-3xl border border-white/10 h-full flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Server className="w-48 h-48" />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xs font-bold text-gray-500 mb-8 uppercase tracking-widest">Engine Status</h3>
                  
                  <div className="space-y-8">
                    <div>
                      <div className="text-[10px] text-gray-500 mb-2 font-bold tracking-widest uppercase">Target Volume</div>
                      <div className="text-3xl font-mono font-bold text-white flex items-center gap-3">
                        {leads.length > 0 ? (
                          <>
                             {leads.length} <span className="text-sm font-sans font-normal text-gray-500 mt-1">leads ready</span>
                          </>
                        ) : '--'}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 space-y-6">
                      <div>
                        <div className="text-[10px] text-gray-500 mb-2 font-bold tracking-widest uppercase flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" /> Estimated Run Time
                        </div>
                        <div className="text-xl font-mono font-bold text-white">{estimatedDuration}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 mb-2 font-bold tracking-widest uppercase flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" /> Projected End
                        </div>
                        <div className="text-lg font-display font-medium text-purple-400">{estimatedCompletion}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 relative z-10 w-full">
                  <button 
                    onClick={handleInitializeSequence}
                    disabled={campaignStatus === 'sending'}
                    className="w-full btn-primary hover-glow-cyan bg-neon-cyan disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none text-matte-black border-none font-bold text-base flex items-center justify-center gap-2 py-4 rounded-2xl hover:bg-white hover:text-black transition-all hover-float"
                  >
                    {campaignStatus === 'sending' ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" /> Deploying Campaign...
                      </>
                    ) : (
                      <>
                         <Send className="w-5 h-5" /> Initialize Sequence
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Confirmation & Active Campaign Safety Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTarget(null)}
              className="absolute inset-0 bg-[#030305]/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden z-10 text-center"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan to-neon-cyan/0" />
              
              <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-400">
                <Trash2 className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-white mb-2">
                Disconnect this Gmail account?
              </h3>
              
              <p className="text-gray-400 text-sm font-mono mb-6 truncate max-w-full px-2">
                {deleteTarget.email}
              </p>

              {deleteTarget.provider === 'gmail' && campaignStatus === 'sending' && activeCampaignSender === deleteTarget.email && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 text-left">
                  <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 animate-pulse" /> Active Campaign Running
                  </p>
                  <p className="text-gray-300 text-xs leading-relaxed mb-4">
                    This account is currently active in a campaign. disconnecting it will end the dispatch. You can select another connected account to inherit the campaign, or cancel.
                  </p>
                  
                  {accounts.filter(acc => acc.provider === 'gmail' && acc.email !== deleteTarget.email).length > 0 ? (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Inheritor Account:</label>
                      <select
                        value={reassignSender}
                        onChange={(e) => setReassignSender(e.target.value)}
                        className="w-full bg-[#050508] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:border-neon-cyan outline-none transition-colors cursor-pointer"
                      >
                        {accounts
                          .filter(acc => acc.provider === 'gmail' && acc.email !== deleteTarget.email)
                          .map(acc => (
                            <option key={acc.email} value={acc.email}>
                              {acc.email}
                            </option>
                          ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-red-400 text-[11px] font-bold">
                      No other connected Gmail accounts exist to inherit dispatch!
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-4 px-6 rounded-2xl border border-white/10 text-white font-bold text-sm bg-white/5 hover:bg-white/10 transition-all hover-float"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeRemoveAccount}
                  disabled={isDeleting || (deleteTarget.provider === 'gmail' && campaignStatus === 'sending' && activeCampaignSender === deleteTarget.email && accounts.filter(acc => acc.provider === 'gmail' && acc.email !== deleteTarget.email).length === 0)}
                  className="flex-1 py-4 px-6 rounded-2xl bg-red-500 hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold text-sm transition-all hover-float"
                >
                  {isDeleting ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Trigger Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-[#0a0a0f] border border-neon-cyan/20 rounded-2xl shadow-[0_0_30px_rgba(0,243,255,0.15)] text-white font-bold"
          >
            <div className="w-5 h-5 rounded-full bg-neon-cyan/10 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan text-xs">
              ✓
            </div>
            <p className="text-sm font-sans tracking-tight">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
