import { motion } from 'motion/react';
import { Plus, Search, Filter, ArrowLeft, Save, Eye, Code, AlignLeft, Send, Trash2, Edit2, Check, LayoutTemplate, PenTool, Zap, Sparkles } from 'lucide-react';
import { EmptyState, SkeletonRow } from '../../components/dashboard/StatCard';
import { useState } from 'react';

type Template = {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
};

type Signature = {
  id: string;
  name: string;
  body: string;
  isDefault: boolean;
};

const INITIAL_TEMPLATES: Template[] = [
  { id: 't1', name: 'Cold Outreach v1', subject: 'Quick question regarding {{company}}', body: 'Hi {{firstName}},\n\nI noticed that {{company}} is growing teams quickly. We help companies like yours scale outreach.\n\nAre you open to a quick chat next week?', createdAt: '2026-06-01' },
];

const INITIAL_SIGNATURES: Signature[] = [
  { id: 's1', name: 'Default Signature', body: '<b>John Doe</b><br>Sales Director | Acme Corp<br><a href="https://linkedin.com">LinkedIn</a> | <a href="https://acme.com">Website</a><br>[Image Placeholder]', isDefault: true },
];

const VARIABLES = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'company', label: 'Company' },
  { key: 'jobTitle', label: 'Job Title' },
];

export default function Campaigns() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // System State
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [signatures, setSignatures] = useState<Signature[]>(INITIAL_SIGNATURES);

  // Builder State
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedSignature, setSelectedSignature] = useState(INITIAL_SIGNATURES.find(s => s.isDefault)?.id || 'none');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Template Search / Filter
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  
  // Custom states for Signature Editing
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [editingSignatureId, setEditingSignatureId] = useState<string | null>(null);
  const [sigName, setSigName] = useState('');
  const [sigBody, setSigBody] = useState('');
  const [sigDefault, setSigDefault] = useState(false);

  // Editor Toolbar action
  const execCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  const insertVariable = (key: string) => {
    setEmailBody((prev) => prev + `{{${key}}}`);
  };

  const insertTemplate = (templateId: string) => {
    const tpl = templates.find(t => t.id === templateId);
    if (tpl) {
      setSubject(tpl.subject);
      setEmailBody(tpl.body);
    }
  };

  const saveAsTemplate = () => {
    if (templates.length >= 19) {
      alert('Maximum of 19 saved templates allowed.');
      return;
    }
    const name = prompt('Enter Template Name:');
    if (name) {
      const newTemplate: Template = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        subject,
        body: emailBody,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTemplates([newTemplate, ...templates]);
    }
  };

  const deleteTemplate = (id: string) => {
    if(confirm('Delete template?')) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  const openSignatureEditor = (sig?: Signature) => {
    if (sig) {
      setEditingSignatureId(sig.id);
      setSigName(sig.name);
      setSigBody(sig.body);
      setSigDefault(sig.isDefault);
    } else {
      if (signatures.length >= 11) {
        alert('Maximum of 11 signatures allowed.');
        return;
      }
      setEditingSignatureId(null);
      setSigName('New Signature');
      setSigBody('<b>Name</b><br>Title<br><a href="#">Link</a>');
      setSigDefault(false);
    }
    setIsEditingSignature(true);
  };

  const saveSignature = () => {
    let updatedSignatures = [...signatures];
    if (sigDefault) {
      updatedSignatures = updatedSignatures.map(s => ({ ...s, isDefault: false }));
    }

    if (editingSignatureId) {
      updatedSignatures = updatedSignatures.map(s => 
        s.id === editingSignatureId ? { ...s, name: sigName, body: sigBody, isDefault: sigDefault } : s
      );
    } else {
      updatedSignatures.push({
        id: Math.random().toString(36).substring(2, 9),
        name: sigName,
        body: sigBody,
        isDefault: sigDefault
      });
    }
    setSignatures(updatedSignatures);
    setIsEditingSignature(false);
    
    if (sigDefault) {
      const defSig = updatedSignatures.find(s => s.isDefault);
      if (defSig) setSelectedSignature(defSig.id);
    }
  };

  const deleteSignature = (id: string) => {
    if(confirm('Delete signature?')) {
      setSignatures(signatures.filter(s => s.id !== id));
      if (selectedSignature === id) setSelectedSignature('none');
    }
  };

  const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(templateSearchQuery.toLowerCase()));
  const activeSignature = signatures.find(s => s.id === selectedSignature);

  if (isBuilding) {
    return (
      <div className="space-y-6 relative z-10 w-full lg:max-w-[70vw] xl:max-w-7xl mx-auto md:ml-auto md:mr-4 lg:mr-8 xl:mr-auto mt-4 px-4 sm:px-6 md:px-0">
        {/* Background glow for builder */}
        <div className="fixed top-[10%] right-[10%] w-[600px] h-[600px] bg-neon-cyan/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
        <div className="fixed bottom-[10%] left-[20%] w-[500px] h-[500px] bg-neon-pink/5 blur-[100px] pointer-events-none -z-10 rounded-full" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[#050508]/60 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl relative z-20">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsBuilding(false)}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover-float transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-neon-cyan">Campaign Editor</span>
              </div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                {campaignName || 'Untitled Sequence'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => { alert('Test email sent to your address.'); }}
              className="hidden sm:flex px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white items-center gap-2 transition-all hover:bg-white/10 hover-float"
            >
              <Send className="w-4 h-4" />
              <span className="text-sm font-bold">Test</span>
            </button>
            <button 
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all hover-float font-bold text-sm ${isPreviewMode ? 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
            >
              {isPreviewMode ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isPreviewMode ? 'Editor' : 'Preview'}</span>
            </button>
            <button 
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-sm hover-float relative overflow-hidden"
            >
              {isSaving ? (
                <>
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  <span className="relative z-10 text-black">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 font-bold">Save Draft</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative z-10">
          {/* Main Editor Area */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="glass-card p-8 space-y-6 rounded-[2rem]">
              <div className="group">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1 group-focus-within:text-neon-cyan transition-colors">Campaign Internal Name</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Q3 Enterprise Outbound"
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-neon-cyan shadow-inner transition-colors text-lg"
                  disabled={isPreviewMode}
                />
              </div>

              <div className="group">
                <label className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2 ml-1 group-focus-within:text-neon-cyan transition-colors">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Email Subject Line</span>
                  <div className="flex flex-wrap gap-1.5">
                    {VARIABLES.map(v => (
                       <button
                         key={v.key}
                         onClick={() => setSubject((prev) => prev + `{{${v.key}}}`)}
                         disabled={isPreviewMode}
                         className="text-[10px] font-mono tracking-wider px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:text-neon-cyan text-gray-400 transition-all font-bold"
                       >
                         {'+ {'}{v.key}{'}'}
                       </button>
                    ))}
                  </div>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Quick question about {{company}}"
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-neon-cyan shadow-inner transition-colors text-lg"
                  disabled={isPreviewMode}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500">Email Body (Rich Text)</label>
                </div>
                
                {isPreviewMode ? (
                  <div className="w-full min-h-[350px] bg-[#050508] border border-white/10 rounded-3xl p-8 text-gray-200 whitespace-pre-wrap shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 blur-[40px] pointer-events-none" />
                    <div className="mb-6 text-sm text-gray-400 border-b border-white/10 pb-6">
                      <span className="uppercase tracking-widest text-[10px] font-bold text-gray-500 mr-2">Subject:</span> 
                      <span className="text-white font-medium">{subject || '(No subject)'}</span>
                    </div>
                    <div className="leading-relaxed text-[15px]">
                      {emailBody || <span className="text-gray-600 italic">No content</span>}
                    </div>
                    {activeSignature && (
                      <div className="mt-10 pt-6 border-t border-white/10 text-gray-400 text-sm opacity-80">
                         <div dangerouslySetInnerHTML={{ __html: activeSignature.body }} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full border border-white/10 rounded-3xl overflow-hidden bg-[#0a0a0f] focus-within:border-neon-cyan shadow-inner transition-colors flex flex-col items-stretch">
                    <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-white/10 bg-[#050508]">
                       <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" onClick={() => execCommand('bold')} title="Bold"><b className="font-serif text-lg">B</b></button>
                       <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" onClick={() => execCommand('italic')} title="Italic"><i className="font-serif text-lg">I</i></button>
                       <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" onClick={() => execCommand('underline')} title="Underline"><u className="font-serif text-lg">U</u></button>
                       <div className="w-px h-6 bg-white/10 mx-1"></div>
                       <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" onClick={() => {
                          const url = prompt('Enter link URL:');
                          if (url) execCommand('createLink', url);
                       }}>Link</button>
                       <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>
                       <div className="flex gap-1.5 ml-auto w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                          {VARIABLES.map((v) => (
                            <button
                              key={v.key}
                              onClick={() => insertVariable(v.key)}
                              className="px-2 py-1.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono font-bold tracking-tight text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all whitespace-nowrap"
                            >
                              + {`{{${v.key}}}`}
                            </button>
                          ))}
                       </div>
                    </div>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Type your email content here. Use the toolbar or type HTML tags for formatting if desired..."
                      className="w-full min-h-[350px] bg-transparent p-6 text-gray-200 focus:outline-none resize-y leading-relaxed text-[15px]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Signature Management Area */}
            <div className="glass-card p-8 rounded-[2rem] relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 blur-[80px] pointer-events-none group-hover:bg-purple-500/10 transition-all duration-700" />
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                 <div>
                   <h2 className="text-xl font-display font-bold text-white flex items-center gap-3">
                     <PenTool className="w-5 h-5 text-purple-400" />
                     Signature Blocks
                   </h2>
                   <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">Manage sender identities</p>
                 </div>
                 <button onClick={() => openSignatureEditor()} disabled={isPreviewMode} className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500 hover:text-black rounded-xl transition-all text-purple-400 hover-float">
                   + New Signature
                 </button>
               </div>

               {isEditingSignature && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   className="p-6 border border-purple-500/30 bg-[#0a0a0f] rounded-2xl space-y-5 mb-6 relative z-10 shadow-inner"
                 >
                    <input 
                       type="text" 
                       value={sigName} 
                       onChange={e => setSigName(e.target.value)} 
                       placeholder="Signature Name (e.g. Main Founder Sign)" 
                       className="w-full bg-[#050508] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-purple-400 outline-none transition-colors"
                    />
                    <div className="w-full border border-white/10 rounded-xl overflow-hidden bg-[#050508] focus-within:border-purple-400 transition-colors">
                      <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-white/5">
                        <button className="p-1.5 px-3 rounded-lg hover:bg-white/10 text-gray-400 text-xs font-bold tracking-wide" onClick={() => execCommand('bold')}>Bold</button>
                        <button className="p-1.5 px-3 rounded-lg hover:bg-white/10 text-gray-400 text-xs font-bold tracking-wide" onClick={() => {
                          const url = prompt('Enter link URL:');
                          if (url) execCommand('createLink', url);
                        }}>Link</button>
                        <button className="p-1.5 px-3 rounded-lg hover:bg-white/10 text-gray-400 text-xs font-bold tracking-wide" onClick={() => {
                          const url = prompt('Enter Image URL (Placeholder):', 'https://via.placeholder.com/150');
                          if (url) execCommand('insertImage', url);
                        }}>Image</button>
                      </div>
                      <textarea 
                        value={sigBody}
                        onChange={e => setSigBody(e.target.value)}
                        placeholder="Signature HTML body (supports <b>, <a>, <img>)"
                        className="w-full h-32 bg-transparent p-4 text-sm text-gray-300 focus:outline-none resize-y font-mono leading-relaxed"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                       <label className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer group hover:text-white transition-colors">
                         <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${sigDefault ? 'bg-purple-500 border-purple-500' : 'bg-black/40 border-white/20 group-hover:border-purple-400/50'}`}>
                           {sigDefault && <Check className="w-3.5 h-3.5 text-black" />}
                         </div>
                         <input type="checkbox" checked={sigDefault} onChange={e => setSigDefault(e.target.checked)} className="hidden" />
                         <span className="font-medium">Set as Default Signature</span>
                       </label>
                       <div className="flex gap-3 w-full sm:w-auto">
                         <button onClick={() => setIsEditingSignature(false)} className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">Cancel</button>
                         <button onClick={saveSignature} className="flex-1 sm:flex-none px-4 py-2 text-sm rounded-xl bg-purple-500 text-black font-bold hover:bg-white transition-colors hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">Save Block</button>
                       </div>
                    </div>
                 </motion.div>
               )}

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                  {signatures.map(sig => (
                     <div key={sig.id} className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${selectedSignature === sig.id ? 'border-purple-500 bg-purple-500/5 shadow-[0_4px_20px_rgba(168,85,247,0.1)]' : 'border-white/10 bg-[#0a0a0f] hover:border-white/30'}`}>
                        <div className="flex items-start justify-between mb-4">
                           <label className="flex items-start gap-3 cursor-pointer group">
                             <div className="mt-0.5">
                               <input type="radio" name="sig_select" checked={selectedSignature === sig.id} onChange={() => setSelectedSignature(sig.id)} disabled={isPreviewMode} className="hidden" />
                               <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${selectedSignature === sig.id ? 'border-purple-500' : 'border-white/20 group-hover:border-purple-400'}`}>
                                 {selectedSignature === sig.id && <div className="w-2 h-2 rounded-full bg-purple-500 pointer-events-none" />}
                               </div>
                             </div>
                             <div className="flex flex-col gap-1.5">
                               <span className={`text-sm font-bold transition-colors ${selectedSignature === sig.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{sig.name}</span>
                               {sig.isDefault && <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase tracking-widest font-bold self-start">Default</span>}
                             </div>
                           </label>
                           <div className="flex gap-1.5">
                              <button onClick={() => openSignatureEditor(sig)} disabled={isPreviewMode} className="text-gray-500 hover:text-white p-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => deleteSignature(sig.id)} disabled={isPreviewMode} className="text-gray-500 hover:text-red-400 p-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                           </div>
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-3 bg-[#050508] p-3 rounded-lg border border-white/5 font-serif" dangerouslySetInnerHTML={{ __html: sig.body }} />
                     </div>
                  ))}
                  {signatures.length === 0 && (
                     <div className="col-span-full p-8 border border-dashed border-white/10 rounded-2xl text-center flex flex-col items-center justify-center gap-3">
                       <PenTool className="w-8 h-8 text-gray-600" />
                       <span className="text-sm font-medium text-gray-500">No signatures configured.</span>
                     </div>
                  )}
               </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            <div className="glass-card flex flex-col h-full lg:max-h-[calc(100vh-200px)] lg:sticky lg:top-24 rounded-[2rem] overflow-hidden p-0 border border-white/10">
              <div className="p-6 border-b border-white/5 bg-[#050508]/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-neon-cyan" />
                    Templates
                  </h3>
                  <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded-md text-gray-400">{templates.length}/19</span>
                </div>
                
                <div className="relative">
                  <input 
                    type="text" 
                    value={templateSearchQuery}
                    onChange={e => setTemplateSearchQuery(e.target.value)}
                    placeholder="Search templates..." 
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    disabled={isPreviewMode}
                  />
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-[#0a0a0f]/30">
                {filteredTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50 px-4 text-center">
                    <LayoutTemplate className="w-10 h-10 text-gray-500 mb-3" />
                    <p className="text-sm font-medium text-gray-400">Library Empty</p>
                    <p className="text-xs text-gray-500 mt-1">Save a draft to reuse later.</p>
                  </div>
                ) : (
                  filteredTemplates.map(tpl => (
                    <div key={tpl.id} className="p-4 bg-[#0a0a0f] border border-white/5 rounded-xl hover:border-neon-cyan/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,243,255,0.05)]">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-bold text-white truncate pr-2 group-hover:text-neon-cyan transition-colors">{tpl.name}</span>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => deleteTemplate(tpl.id)} disabled={isPreviewMode} className="text-gray-500 hover:text-red-400 p-1 bg-white/5 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 truncate mb-4 bg-[#050508] p-2 rounded border border-white/5">{tpl.subject}</p>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] text-gray-600 font-mono tracking-wider">{tpl.createdAt}</span>
                         <button 
                           onClick={() => insertTemplate(tpl.id)}
                           disabled={isPreviewMode}
                           className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-neon-cyan hover:border-neon-cyan hover:text-black rounded-lg text-gray-300 transition-all hover-float"
                         >
                           Insert
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-white/5 bg-[#050508]/80">
                <button 
                  onClick={saveAsTemplate}
                  disabled={isPreviewMode || !subject || !emailBody}
                  className="w-full py-3 bg-white/5 border border-dashed border-white/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 hover:text-neon-cyan text-xs font-bold uppercase tracking-widest text-gray-400 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/20 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                >
                  <Save className="w-4 h-4" /> Save as Template
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10 w-full lg:max-w-[70vw] xl:max-w-7xl mx-auto md:ml-auto md:mr-4 lg:mr-8 xl:mr-auto mt-4 px-4 sm:px-6 md:px-0">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neon-cyan/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 glass p-6 sm:p-8 rounded-[2rem] border border-white/5 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Outreach Operations</span>
          </div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight mb-2">Campaigns.</h1>
          <p className="text-gray-400 font-medium">Manage and monitor your active outreach sequences.</p>
        </div>
        <button onClick={() => setIsBuilding(true)} className="btn-primary hover-glow-cyan w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm">
          <Plus className="w-5 h-5" />
          <span>New Sequence</span>
        </button>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/5 bg-[#050508]/50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-neon-cyan transition-colors shadow-inner"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-neon-cyan transition-colors" />
          </div>
          <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold text-sm tracking-wide hover:bg-white/10 hover:text-white flex items-center justify-center gap-2 transition-all hover-float">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {isLoading ? (
          <div className="p-0">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-20 px-4 flex justify-center">
            <EmptyState 
              title="No active sequences" 
              description="Start reaching out to prospects by creating your first automated campaign."
              action={
                <button onClick={() => setIsBuilding(true)} className="btn-primary hover-glow-cyan flex items-center gap-2 mt-6 px-8 py-3 rounded-xl font-bold text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Build Sequence</span>
                </button>
              }
            />
          </div>
        ) : (
          <div className="p-10 text-center text-gray-400 font-medium bg-[#0a0a0f]">Campaign list data...</div>
        )}
      </div>
    </div>
  );
}

