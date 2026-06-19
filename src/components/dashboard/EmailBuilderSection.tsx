import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, Save, Trash2, Edit2, Search, Plus, Copy,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo, Redo, Link as LinkIcon, Eye, Mail, Smile, Sparkles, Check,
  User, Building2, Briefcase, FileText, CheckCircle2, ChevronRight, HelpCircle, AlertCircle,
  LayoutTemplate, ChevronDown, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
}

interface Signature {
  id: string;
  name: string;
  content: string; // HTML format
  isDefault: boolean;
}

interface EmailBuilderSectionProps {
  activeStep: number;
  availableVariables: string[];
  leads?: any[];
}

export default function EmailBuilderSection({ activeStep, availableVariables, leads = [] }: EmailBuilderSectionProps) {
  // Primary States (Local states for draft)
  const [subject, setSubject] = useState('Re: Transforming outreach at {Company}');
  const [body, setBody] = useState('Hi {Name},<br><br>I enjoyed reading your recent insights. I was thinking about how <b>{Company}</b> handles modern outbound deliverability.<br><br>Are you open to exploring better systems that scale?');
  
  // Custom Templates State (Max 19)
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Deliverability Outreach v1',
      subject: 'Re: Transforming outreach at {Company}',
      body: 'Hi {Name},<br><br>I enjoyed reading your recent insights. I was thinking about how <b>{Company}</b> handles modern outbound deliverability.<br><br>Are you open to exploring better systems that scale?',
      variables: ['Name', 'Company'],
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Sequence Warm Follow-up',
      subject: 'Re: High-deliverability campaign systems',
      body: 'Hey {Name},<br><br>Checking in on this to float it to the top. I saw your post matching <b>{Company}</b> goals. Let me know if you would like to run a short trial.',
      variables: ['Name', 'Company'],
      createdAt: new Date().toISOString()
    }
  ]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  // Signatures State (Max 11)
  const [signatures, setSignatures] = useState<Signature[]>([
    {
      id: '1',
      name: 'Modern Startup Signoff',
      content: 'Best regards,<br><br><b>Sarah Carter</b><br><span style="color:#00f3ff; font-weight:bold; font-size:12px;">VP of Campaigns</span> | nexzivo.io<br><a href="#" style="color:#ff00ff; text-decoration:underline; font-weight:500; font-size:12px; margin-right:10px;">LinkedIn</a> | <a href="#" style="color:#ff00ff; text-decoration:underline; font-weight:500; font-size:12px;">Book 15 mins</a><br><div style="margin-top:10px; display:inline-block; padding:4px 8px; border:1px solid rgba(0,243,255,0.2); border-radius:4px; font-size:10px; font-family:monospace; color:#00f3ff;">⚡ Empowered by Nexzivo</div>',
      isDefault: true
    },
    {
      id: '2',
      name: 'Classic Multi-Line',
      content: 'Sincerely,<br><br><b>Sarah Carter</b><br><span style="color:#94a3b8;">Outbound Lead Developer</span><br>Office: (555) 019-8234<br><span style="font-size:11px; color:#64748b;">Confidentiality warning: This email is private.</span>',
      isDefault: false
    }
  ]);

  // Signature Manager State
  const [isSignatureManagerOpen, setIsSignatureManagerOpen] = useState(false);
  const [signatureSearchQuery, setSignatureSearchQuery] = useState('');
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [editingSignatureId, setEditingSignatureId] = useState<string | null>(null);
  const [signatureNameInput, setSignatureNameInput] = useState('');
  const [signatureIsDefault, setSignatureIsDefault] = useState(false);
  const [signatureEditorHtml, setSignatureEditorHtml] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Signature Selection State
  const [selectedSignatureId, setSelectedSignatureId] = useState<string>('1');

  // Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPreviewLeadIdx, setSelectedPreviewLeadIdx] = useState<number>(0);

  // Auto-Save Simulation State
  const [saveDraftStatus, setSaveDraftStatus] = useState('Draft saved to cloud');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  // Floating Popover Controls
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isInsertSignatureOpen, setIsInsertSignatureOpen] = useState(false);
  const [autocomplete, setAutocomplete] = useState<{
    active: boolean;
    query: string;
    coords: { top: number; left: number } | null;
    selectedIndex: number;
    target: 'body' | 'subject';
  } | null>(null);

  // References
  const editorRef = useRef<HTMLDivElement>(null);
  const signatureEditorRef = useRef<HTMLDivElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const emojis = ['⚡', '✨', '🚀', '🔥', '👋', '🌟', '💼', '📊', '🤝', '🎉', '😊', '🎯', '💡', '💬', '📢'];

  // Init draft save timestamps
  useEffect(() => {
    setLastSavedTime(new Date().toLocaleTimeString());
  }, []);

  // Sync state modifications for contenteditable initial mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== body) {
      editorRef.current.innerHTML = body;
    }
  }, []);

  // ESC key listener to close modals
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSignatureManagerOpen) {
        setIsSignatureManagerOpen(false);
        setIsEditingSignature(false);
        setEditingSignatureId(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSignatureManagerOpen]);

  // Save selection focus context
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
  };

  // Safe Insertion at caret or as fallbacks
  const insertHTMLAtCaret = (html: string, isSignature: boolean = false) => {
    const targetRef = isSignature ? signatureEditorRef : editorRef;
    if (targetRef.current) {
      targetRef.current.focus();
    }
    restoreSelection();
    
    // execCommand natively handles replacing highlighted text and advancing the cursor
    const success = document.execCommand('insertHTML', false, html);
    
    if (!success) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        
        const el = document.createElement("div");
        el.innerHTML = html;
        const frag = document.createDocumentFragment();
        let node: ChildNode | null = null;
        let lastNode: ChildNode | null = null;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        
        if (lastNode) {
          const newRange = range.cloneRange();
          newRange.setStartAfter(lastNode);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      } else if (targetRef.current) {
        targetRef.current.innerHTML += html;
      }
    }

    if (!isSignature) {
      setBody(editorRef.current?.innerHTML || '');
    }
    saveSelection();
  };

  // Basic document commands execution
  const handleCommand = (command: string, value: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setBody(editorRef.current.innerHTML);
    }
    saveSelection();
  };

  const handleSignatureCommand = (command: string, value: string = '') => {
    if (signatureEditorRef.current) {
      signatureEditorRef.current.focus();
    }
    restoreSelection();
    document.execCommand(command, false, value);
    if (signatureEditorRef.current) {
       setSignatureEditorHtml(signatureEditorRef.current.innerHTML);
    }
    saveSelection();
  };

  // Autocomplete support and keyboard events handler
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        handleCommand('bold');
      } else if (e.key === 'i') {
        e.preventDefault();
        handleCommand('italic');
      } else if (e.key === 'u') {
        e.preventDefault();
        handleCommand('underline');
      } else if (e.key === 'z') {
        e.preventDefault();
        handleCommand('undo');
      } else if (e.key === 'y') {
        e.preventDefault();
        handleCommand('redo');
      }
    }

    // Handlers for instant Autocomplete Popovers
    if (autocomplete && autocomplete.active && autocomplete.target === 'body') {
      const matchedVars = availableVariables.filter(v => v.toLowerCase().includes(autocomplete.query.toLowerCase()));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAutocomplete({ 
          ...autocomplete, 
          selectedIndex: Math.min(autocomplete.selectedIndex + 1, matchedVars.length - 1) 
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAutocomplete({ 
          ...autocomplete, 
          selectedIndex: Math.max(autocomplete.selectedIndex - 1, 0) 
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (matchedVars.length > 0) {
          handleInsertAutocomplete(matchedVars[autocomplete.selectedIndex]);
        } else {
          setAutocomplete(null);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setAutocomplete(null);
      }
    }
  };

  const handleEditorKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Escape') {
      return;
    }
    
    saveSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const node = sel.anchorNode;
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      setAutocomplete(null);
      return;
    }

    const textContent = node.textContent || '';
    const offset = sel.anchorOffset;
    const textBeforeCaret = textContent.slice(0, offset);

    // Matches e.g. {Variable Name
    const match = textBeforeCaret.match(/\{([^}]*)$/);

    if (match) {
      const rects = sel.getRangeAt(0).getClientRects();
      let coords = null;
      if (rects.length > 0) {
        coords = {
          top: rects[0].top,
          left: rects[0].left
        };
      }
      setAutocomplete({
        active: true,
        query: match[1],
        coords,
        selectedIndex: 0,
        target: 'body'
      });
    } else {
      setAutocomplete(null);
    }

    if (editorRef.current) {
      setBody(editorRef.current.innerHTML);
    }
  };

  const handleSubjectKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Escape') {
      return;
    }
    
    const input = subjectInputRef.current;
    if (!input) return;

    const cursor = input.selectionStart || 0;
    const textBeforeCaret = input.value.slice(0, cursor);
    const match = textBeforeCaret.match(/\{([^}]*)$/);

    if (match) {
      setAutocomplete({
        active: true,
        query: match[1],
        coords: null, // Subj dropdown position handled via CSS
        selectedIndex: 0,
        target: 'subject'
      });
    } else {
      setAutocomplete(null);
    }
  };

  const handleSubjectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (autocomplete && autocomplete.active && autocomplete.target === 'subject') {
      const matchedVars = availableVariables.filter(v => v.toLowerCase().includes(autocomplete.query.toLowerCase()));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAutocomplete({ 
          ...autocomplete, 
          selectedIndex: Math.min(autocomplete.selectedIndex + 1, matchedVars.length - 1) 
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAutocomplete({ 
          ...autocomplete, 
          selectedIndex: Math.max(autocomplete.selectedIndex - 1, 0) 
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (matchedVars.length > 0) {
          handleInsertSubjectAutocomplete(matchedVars[autocomplete.selectedIndex]);
        } else {
          setAutocomplete(null);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setAutocomplete(null);
      }
    }
  };

  const handleInsertSubjectAutocomplete = (variable: string) => {
    if (!subjectInputRef.current || !autocomplete || autocomplete.target !== 'subject') return;
    const input = subjectInputRef.current;
    
    // Use input.value instead of subject to avoid stale React state references
    const currentValue = input.value;
    const cursor = input.selectionStart || 0;
    const textBeforeTrigger = currentValue.slice(0, cursor - autocomplete.query.length - 1);
    const textAfterCursor = currentValue.slice(cursor);
    
    const newSubject = textBeforeTrigger + `{${variable}}` + textAfterCursor;
    setSubject(newSubject);
    
    // Position cursor after insertion
    setTimeout(() => {
      input.focus();
      const newCursor = textBeforeTrigger.length + variable.length + 2;
      input.setSelectionRange(newCursor, newCursor);
    }, 0);
    
    setAutocomplete(null);
  };

  const handleInsertAutocomplete = (variable: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !autocomplete) return;

    const node = sel.anchorNode;
    if (node && node.nodeType === Node.TEXT_NODE) {
      const offset = sel.anchorOffset;
      const startOffset = Math.max(0, offset - autocomplete.query.length - 1);
      
      const replaceRange = document.createRange();
      replaceRange.setStart(node, startOffset);
      replaceRange.setEnd(node, offset);
      sel.removeAllRanges();
      sel.addRange(replaceRange);

      const success = document.execCommand('insertText', false, `{${variable}}`);
      
      if (!success) {
        replaceRange.deleteContents();
        const textNode = document.createTextNode(`{${variable}}`);
        replaceRange.insertNode(textNode);
        replaceRange.setStartAfter(textNode);
        replaceRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(replaceRange);
      }
    }
    
    setAutocomplete(null);
    if (editorRef.current) {
      setBody(editorRef.current.innerHTML);
    }
    saveSelection();
  };

  // Prevents Outlook or Word raw XML garbage in pasting
  const handlePasteCleanup = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const cleanedText = text
      .replace(/\r\n/g, '<br>')
      .replace(/\n/g, '<br>');
    document.execCommand('insertHTML', false, cleanedText);
    if (editorRef.current) {
      setBody(editorRef.current.innerHTML);
    }
  };

  // Custom Outreach Templates management (Max 19)
  const handleSaveTemplate = () => {
    if (!templateName) return;
    
    if (editingTemplateId) {
      setTemplates(templates.map(t => 
        t.id === editingTemplateId ? { ...t, name: templateName, subject, body } : t
      ));
    } else {
      if (templates.length >= 19) {
        alert("Maximum of 19 saved templates allowed.");
        return;
      }
      const newTemplate: Template = {
        id: Date.now().toString(),
        name: templateName,
        subject,
        body,
        variables: [...availableVariables],
        createdAt: new Date().toISOString()
      };
      setTemplates([newTemplate, ...templates]);
    }
    
    setIsTemplateModalOpen(false);
    setTemplateName('');
    setEditingTemplateId(null);
  };

  const openNewTemplateModal = () => {
    setEditingTemplateId(null);
    setTemplateName('');
    setIsTemplateModalOpen(true);
  };

  const handleSelectTemplate = (t: Template) => {
    setSubject(t.subject);
    setBody(t.body);
    if (editorRef.current) {
      editorRef.current.innerHTML = t.body;
    }
    setShowTemplateMenu(false);
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTemplates(templates.filter(t => t.id !== id));
  };

  const openEditTemplateModal = (t: Template) => {
    setEditingTemplateId(t.id);
    setTemplateName(t.name);
    setSubject(t.subject);
    setBody(t.body);
    setIsTemplateModalOpen(true);
  };

  // Signatures State Management (Max 11)
  const handleSaveOrUpdateSignature = () => {
    if (!signatureNameInput) return;
    const signatureHTML = signatureEditorRef.current?.innerHTML || '';

    if (editingSignatureId) {
      setSignatures(prev => {
        let list = prev.map(s => s.id === editingSignatureId ? { 
          ...s, 
          name: signatureNameInput, 
          content: signatureHTML, 
          isDefault: signatureIsDefault 
        } : s);
        if (signatureIsDefault) {
          list = list.map(s => s.id !== editingSignatureId ? { ...s, isDefault: false } : s);
        }
        return list;
      });
    } else {
      if (signatures.length >= 11) {
        alert("Maximum limit of 11 saved signatures reached.");
        return;
      }
      const newSig: Signature = {
        id: Date.now().toString(),
        name: signatureNameInput,
        content: signatureHTML,
        isDefault: signatureIsDefault
      };
      setSignatures(prev => {
        let list = [...prev, newSig];
        if (signatureIsDefault) {
          list = list.map(s => s.id !== newSig.id ? { ...s, isDefault: false } : s);
        }
        return list;
      });
    }

    // Reset interface states
    setSignatureNameInput('');
    setSignatureIsDefault(false);
    setIsEditingSignature(false);
    setEditingSignatureId(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleAddNewSignature = () => {
    setEditingSignatureId(null);
    setSignatureNameInput('Corporate Outbound Team');
    setSignatureIsDefault(false);
    setIsEditingSignature(true);
    setTimeout(() => {
      if (signatureEditorRef.current) {
        const initialHtml = 'Best regards,<br><br><b>Name</b><br>Title | company.com';
        signatureEditorRef.current.innerHTML = initialHtml;
        setSignatureEditorHtml(initialHtml);
        signatureEditorRef.current.focus();
      }
    }, 50);
  };

  const handleEditSignature = (s: Signature) => {
    setEditingSignatureId(s.id);
    setSignatureNameInput(s.name);
    setSignatureIsDefault(s.isDefault);
    setIsEditingSignature(true);
    setTimeout(() => {
      if (signatureEditorRef.current) {
        signatureEditorRef.current.innerHTML = s.content;
        setSignatureEditorHtml(s.content);
        signatureEditorRef.current.focus();
      }
    }, 50);
  };

  const handleDuplicateSignature = (s: Signature, e: React.MouseEvent) => {
    e.stopPropagation();
    if (signatures.length >= 11) {
      alert("Maximum of 11 signatures allowed.");
      return;
    }
    const dup: Signature = {
      id: Date.now().toString(),
      name: `${s.name} (Copy)`,
      content: s.content,
      isDefault: false
    };
    setSignatures([...signatures, dup]);
  };

  const handleDeleteSignature = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = signatures.filter(s => s.id !== id);
    setSignatures(filtered);
  };

  const handleSetDefaultSignature = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSignatures(signatures.map(s => ({
      ...s,
      isDefault: s.id === id
    })));
  };

  // Simulated Auto-Saving State Listener and Token sync
  useEffect(() => {
    localStorage.setItem('genzio_campaign_subject', subject);
    localStorage.setItem('genzio_campaign_body', body);
    setSaveDraftStatus('Autosaving...');
    const timer = setTimeout(() => {
      setSaveDraftStatus('Draft auto-saved');
      setLastSavedTime(new Date().toLocaleTimeString());
    }, 700);
    return () => clearTimeout(timer);
  }, [body, subject, signatures]);

  // Insert specialized formatting helpers (buttons, image place holders, social widgets)
  const insertSignaturePreset = (presetType: 'social' | 'button' | 'image' | 'hybrid') => {
    let html = '';
    if (presetType === 'social') {
      html = `Best regards,<br><br><b>Sarah Carter</b><br><span style="color:#94a3b8; font-size:12px;">VP of Growth</span><br><div style="margin-top:8px; display:flex; gap:6px; align-items:center;"><a href="#" style="background:#0a0a0f; border:1px solid #ff00ff; color:#ff00ff; text-decoration:none; padding:3px 8px; border-radius:12px; font-size:10px; font-family:sans-serif; font-weight:bold;">[LinkedIn]</a> <a href="#" style="background:#0a0a0f; border:1px solid #00f3ff; color:#00f3ff; text-decoration:none; padding:3px 8px; border-radius:12px; font-size:10px; font-family:sans-serif; font-weight:bold;">[Twitter]</a></div>`;
    } else if (presetType === 'button') {
      html = `Thanks,<br><b>Outreach Team</b><br><a href="https://calendly.com/nexzivo" style="display:inline-block; margin-top:8px; background:linear-gradient(135deg, #ff00ff, #00f3ff); border:none; padding:8px 16px; border-radius:6px; color:#ffffff; font-size:12px; font-weight:bold; text-decoration:none; line-height:1; shadow:0 4px 10px rgba(0,243,255,0.25);">Schedule Demo Call</a>`;
    } else if (presetType === 'image') {
      html = `<div style="display:flex; align-items:center; gap:10px;"><div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg, #00f3ff, #ff00ff); text-align:center; line-height:36px; color:#ffffff; font-weight:bold; font-size:13px; font-family:sans-serif;">SC</div><div><b style="font-size:13px;">Sarah Carter</b><br><span style="color:#64748b; font-size:11px;">NEXZIVO Campaigns</span></div></div>`;
    } else {
      html = `Cheers,<br><b>Sarah Carter</b><br><span style="font-size:12px; color:#00f3ff; font-weight:bold;">Deliverability Architect</span> | nexzivo.io<br><div style="margin-top:6px; width:150px; height:1px; background:linear-gradient(to right, #00f3ff, transparent);"></div><span style="font-size:10px; color:#475569;">Pioneering next-generation cold email protocols</span>`;
    }

    if (signatureEditorRef.current) {
      signatureEditorRef.current.innerHTML = html;
      signatureEditorRef.current.focus();
    }
  };

  // Variable Substitutor for live previews
  const resolvePreviewVariables = (text: string) => {
    const selectedLead = leads && leads.length > 0 ? leads[selectedPreviewLeadIdx] : null;
    let resolved = text;
    
    const regex = /\{([^}]+)\}/g;
    
    if (selectedLead) {
      resolved = resolved.replace(regex, (match, varName) => {
        const val = selectedLead[varName] !== undefined ? selectedLead[varName] : (selectedLead[varName.toLowerCase()] !== undefined ? selectedLead[varName.toLowerCase()] : selectedLead[Object.keys(selectedLead).find(k => k.toLowerCase() === varName.toLowerCase()) || '']);
        if (val !== undefined && val !== null) {
           return val === '' ? '' : val;
        } else {
           return `<span style="color:#ff4444; font-weight:bold; padding:0 3px; background:rgba(255,0,0,0.1); border-radius:3px;" title="Warning: Variable '${varName}' not found in spreadsheet">{${varName}} ⚠️</span>`;
        }
      });
    } else {
      resolved = resolved.replace(regex, `<span style="color:#00f3ff; font-weight:bold; padding:0 3px; background:rgba(0,243,255,0.1); border-radius:3px;">[$1]</span>`);
    }

    return resolved;
  };

  const activeSignature = signatures.find(s => s.id === selectedSignatureId) || signatures.find(s => s.isDefault);

  const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(templateSearchQuery.toLowerCase()));
  const filteredSignatures = signatures.filter(s => s.name.toLowerCase().includes(signatureSearchQuery.toLowerCase()));

  return (
    <section className={`glass p-6 md:p-8 rounded-2xl border transition-all duration-300 ${activeStep >= 3 ? 'border-neon-cyan/30' : 'border-white/5 opacity-50 pointer-events-none'}`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center font-bold text-neon-cyan text-sm shrink-0">3</div>
          <div>
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              Email Builder <Sparkles className="w-5 h-5 text-neon-cyan" />
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">Define your message template and customize content with variables.</p>
          </div>
        </div>

        {/* Global Action status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121216] border border-white/5 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-gray-400">{saveDraftStatus}</span>
            <span className="text-gray-600">({lastSavedTime})</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* =================================================================== */}
        {/* CREATE EMAIL SECTION                                                */}
        {/* =================================================================== */}
        <div className="bg-[#08080c] border border-white/10 rounded-xl p-5 relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 w-24 h-1 bg-neon-cyan"></div>
          
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-neon-cyan/25 flex items-center justify-center text-neon-cyan text-[11px] font-bold">1</span>
              Create Outbound Email
            </h3>

            {/* Template quick inject menu */}
            <div className="relative">
              <button 
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 bg-[#121214] hover:bg-white/5 border border-white/10 rounded-md transition-all text-gray-300 hover:text-neon-cyan"
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-neon-cyan" /> 
                Insert Saved Template <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
              
              {showTemplateMenu && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-[#0a0a0f] border border-white/10 rounded-lg shadow-2xl z-50 p-2">
                  <div className="relative mb-2">
                    <Search className="w-3 h-3 absolute left-2.5 top-2 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Search templates..."
                      value={templateSearchQuery}
                      onChange={(e) => setTemplateSearchQuery(e.target.value)}
                      className="w-full bg-[#121214] border border-white/10 rounded pl-8 pr-2 py-1 text-xs text-white focus:border-neon-cyan outline-none"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                    {filteredTemplates.length === 0 && (
                      <div className="text-[11px] text-gray-500 p-2 text-center italic">No templates match.</div>
                    )}
                    {filteredTemplates.map(t => (
                      <div key={t.id} className="group/item flex items-center justify-between rounded hover:bg-white/5 transition-colors p-1">
                        <button 
                          onClick={() => handleSelectTemplate(t)}
                          className="text-left px-2 py-1 text-xs text-gray-300 hover:text-white flex-1 truncate font-mono"
                        >
                          {t.name}
                        </button>
                        <div className="flex gap-1 pr-1 opacity-10 group-hover/item:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditTemplateModal(t)} 
                            className="p-1 text-gray-400 hover:text-neon-cyan"
                            title="Edit Label"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteTemplate(t.id, e)}
                            className="p-1 text-gray-400 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/5 mt-1.5 pt-1.5 flex justify-between items-center px-1">
                    <span className="text-[9px] text-gray-500 font-mono">Count: {templates.length}/19</span>
                    <button onClick={openNewTemplateModal} className="text-[10px] text-neon-cyan hover:underline font-bold">New Template</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email subject */}
          <div className="mb-4 relative">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1.5">Subject Line</label>
            <input 
              ref={subjectInputRef}
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyUp={handleSubjectKeyUp}
              onKeyDown={handleSubjectKeyDown}
              placeholder="Subject Line (e.g. Question re: {Company})" 
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:border-neon-cyan outline-none transition-all placeholder-gray-600 font-medium relative z-10" 
            />
            {/* Variables autocomplete menu for subject line */}
            {autocomplete && autocomplete.active && autocomplete.target === 'subject' && (
              <div 
                onMouseDown={(e) => e.preventDefault()}
                className="absolute left-0 mt-1 w-48 bg-[#0b0b0e] border border-neon-cyan/40 rounded shadow-2xl py-1 z-50 animate-in fade-in duration-300"
              >
                <div className="px-2 py-0.5 text-[9px] font-mono text-neon-cyan uppercase tracking-wider border-b border-white/5 mb-1 bg-[#14141a] flex justify-between items-center bg-gray-900/40">
                  <span>Subject Variables</span>
                  <span className="text-gray-500 font-normal">Enter</span>
                </div>
                <div className="max-h-36 overflow-y-auto custom-scrollbar">
                  {availableVariables
                    .filter(v => v.toLowerCase().includes(autocomplete.query.toLowerCase()))
                    .map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleInsertSubjectAutocomplete(v)}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => setAutocomplete({ ...autocomplete, selectedIndex: idx })}
                        className={`w-full text-left px-2 py-1 text-xs font-mono transition-all flex items-center justify-between ${autocomplete.selectedIndex === idx ? 'bg-neon-cyan/20 text-white font-bold' : 'text-gray-400 hover:bg-neon-cyan/5'}`}
                      >
                        <span>{'{'}{v}{'}'}</span>
                        {autocomplete.selectedIndex === idx && <Check className="w-3 h-3 text-neon-cyan" />}
                      </button>
                    ))
                  }
                </div>
              </div>
            )}
          </div>

          {/* Editor Container with STICKY TOOLBAR and pristine typography */}
          <div className="flex flex-col border border-white/10 rounded-lg overflow-hidden bg-[#09090d] focus-within:border-neon-cyan/40 transition-colors">
            
            {/* STICKY TOOLBAR IMPLEMENTED IN LINE WITH INSTRUCTIONS */}
            <div 
              onMouseDown={(e) => {
                if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'SELECT' && (e.target as HTMLElement).tagName !== 'OPTION') {
                  e.preventDefault();
                }
              }}
              className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-1.5 bg-[#121216] border-b border-white/10 select-none"
            >
              
              {/* Formatting actions */}
              <button 
                onClick={() => handleCommand('bold')}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleCommand('italic')}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleCommand('underline')}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>

              <div className="relative flex items-center gap-1.5 ml-1">
                <div className="relative">
                  <select onChange={(e) => handleCommand('fontName', e.target.value)} defaultValue="Inter" className="bg-[#1a1a20] border border-white/10 text-xs text-gray-300 outline-none hover:border-white/20 focus:border-neon-cyan cursor-pointer px-2 py-1 rounded appearance-none font-medium pr-6 min-w-[100px]">
                    <option value="Consolas">Consolas</option>
                    <option value="Inter">Inter</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Roboto">Roboto</option>
                    <option value="'Open Sans'">Open Sans</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Lato">Lato</option>
                    <option value="'Source Sans 3'">Source Sans Pro</option>
                    <option value="Nunito">Nunito</option>
                    <option value="'Work Sans'">Work Sans</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1.5 pointer-events-none" />
                </div>
                <div className="relative">
                  <select onChange={(e) => handleCommand('fontSize', e.target.value)} defaultValue="3" className="bg-[#1a1a20] border border-white/10 text-xs text-gray-300 outline-none hover:border-white/20 focus:border-neon-cyan cursor-pointer px-2 py-1 rounded appearance-none font-medium pr-6 min-w-[80px]">
                    <option value="1">Small</option>
                    <option value="3">Medium</option>
                    <option value="5">Large</option>
                    <option value="7">Huge</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1.5 pointer-events-none" />
                </div>
                <label className="cursor-pointer rounded border border-transparent hover:border-white/20 flex flex-col items-center justify-center w-7 h-7 relative hover:bg-white/5 transition-colors" title="Text Color">
                  <span className="absolute text-[11px] font-bold text-gray-400 pointer-events-none">A</span>
                  <input type="color" onChange={(e) => handleCommand('foreColor', e.target.value)} className="w-[150%] h-[150%] opacity-0 cursor-pointer" />
                </label>
              </div>

              <div className="w-px h-5 bg-white/5 mx-1"></div>

              {/* Headings */}
              <button 
                onClick={() => handleCommand('formatBlock', '<h3>')}
                className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors font-mono font-bold"
                title="Insert Heading H1"
              >
                H1
              </button>
              <button 
                onClick={() => handleCommand('formatBlock', '<h4>')}
                className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors font-mono font-bold"
                title="Insert Heading H2"
              >
                H2
              </button>
              <button 
                onClick={() => handleCommand('formatBlock', '<p>')}
                className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                title="Restore Paragraph Style"
              >
                Text
              </button>

              <div className="w-px h-5 bg-white/5 mx-1"></div>

              {/* Lists */}
              <button 
                onClick={() => handleCommand('insertUnorderedList')}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                title="Unordered Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleCommand('insertOrderedList')}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                title="Ordered Decimals List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-white/5 mx-1"></div>

              {/* Alignment */}
              <button 
                onClick={() => handleCommand('justifyLeft')}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded"
                title="Align Justify Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleCommand('justifyCenter')}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded"
                title="Align Justify Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-white/5 mx-1"></div>

              {/* Undo/Redo */}
              <button 
                onClick={() => handleCommand('undo')}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded"
                title="Undo last change (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleCommand('redo')}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded"
                title="Redo previous change"
              >
                <Redo className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-white/5 mx-1"></div>

              {/* Insert hyperlink */}
              <button 
                onClick={() => {
                  const url = prompt('Enter the link destination URL (https://...):');
                  if (url) handleCommand('createLink', url);
                }}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded"
                title="Insert Link Anchor"
              >
                <LinkIcon className="w-4 h-4" />
              </button>

              {/* Emoji popover dropdown trigger */}
              <div className="relative">
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded"
                  title="Insert Emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-[#121215] border border-white/10 rounded-lg p-1.5 grid grid-cols-5 gap-1 shadow-2xl z-50 w-36">
                    {emojis.map(e => (
                      <button 
                        key={e} 
                        onClick={() => {
                          insertHTMLAtCaret(e);
                          setShowEmojiPicker(false);
                        }}
                        className="pt-1 pb-1 hover:bg-white/5 rounded text-sm hover:scale-110 transition-transform"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="ml-auto w-px h-5 bg-white/5 mx-1 hidden sm:block"></div>

              {/* Inject placeholders dynamically */}
              <div className="relative group mx-2">
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-neon-cyan bg-neon-cyan/15 hover:bg-neon-cyan/25 px-2 py-1 rounded transition-colors font-sans border border-neon-cyan/10">
                  <Plus className="w-3.5 h-3.5" /> Variables
                </button>
                <div className="absolute top-full right-0 mt-1 w-44 bg-[#121214] border border-white/10 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1">
                  {availableVariables.map((v, idx) => (
                    <button 
                      key={idx}
                      onClick={() => insertHTMLAtCaret(`{${v}}`)}
                      onMouseDown={(e) => e.preventDefault()}
                      className="w-full text-left px-3 py-1 text-xs text-gray-300 hover:bg-neon-cyan/10 hover:text-white font-mono"
                    >
                      {'{'}{v}{'}'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsInsertSignatureOpen(!isInsertSignatureOpen)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-neon-pink bg-neon-pink/15 hover:bg-neon-pink/25 px-2 py-1 rounded transition-colors font-sans border border-neon-pink/10"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Insert Signature
                </button>
                
                {isInsertSignatureOpen && (
                  <div className="absolute top-full right-0 mt-1 w-64 bg-[#121214] border border-white/10 rounded-lg shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 pb-2 border-b border-white/10 mb-2">
                       <input 
                         type="text" 
                         placeholder="Search signatures..." 
                         value={signatureSearchQuery}
                         onChange={(e) => setSignatureSearchQuery(e.target.value)}
                         className="w-full bg-[#1a1a20] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-neon-pink outline-none transition-colors"
                       />
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                      {filteredSignatures.length === 0 ? (
                        <div className="px-3 py-4 text-center">
                           <p className="text-[10px] text-gray-500 italic mb-3">No signatures available.</p>
                           <button onClick={() => { setIsInsertSignatureOpen(false); setIsSignatureManagerOpen(true); handleAddNewSignature(); }} className="text-[10px] font-bold text-neon-pink bg-neon-pink/15 hover:bg-neon-pink/25 px-3 py-1.5 rounded transition-colors border border-neon-pink/20">Create Signature</button>
                        </div>
                      ) : (
                        filteredSignatures.map(s => (
                          <button 
                            key={s.id}
                            onClick={() => { 
                              insertHTMLAtCaret('<br/><br/>' + s.content);
                              setIsInsertSignatureOpen(false); 
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-neon-pink/10 hover:text-white group flex flex-col gap-1 transition-colors border-l-2 border-transparent hover:border-neon-pink"
                          >
                            <span className="font-bold flex items-center justify-between text-white">
                               {s.name}
                               {s.isDefault && <span className="text-[9px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded font-mono uppercase">Default</span>}
                            </span>
                            <span className="text-[10px] text-gray-500 truncate" dangerouslySetInnerHTML={{ __html: s.content.replace(/<[^>]+>/g, ' ') }} />
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* RICH EDITABLE FIELD BODY */}
            <div className="relative w-full min-h-[300px]">
              <div 
                ref={editorRef}
                contentEditable
                onInput={() => setBody(editorRef.current?.innerHTML || '')}
                onKeyUp={handleEditorKeyUp}
                onKeyDown={handleEditorKeyDown}
                onPaste={handlePasteCleanup}
                onMouseUp={saveSelection}
                className="w-full bg-transparent px-4 py-3.5 text-white/95 outline-none min-h-[300px] max-h-[500px] overflow-y-auto leading-relaxed text-sm custom-editor font-sans"
                placeholder="Type your outline message here. Type '{' to search and select variables automatically..."
              />

              {/* Variables autocomplete menu floating inside text bounds */}
              {autocomplete && autocomplete.active && autocomplete.target === 'body' && (
                <div 
                  className="absolute w-48 bg-[#0b0b0e] border border-neon-cyan/40 rounded shadow-2xl py-1 z-50 animate-in fade-in duration-700"
                  onMouseDown={(e) => e.preventDefault()}
                  style={{
                    top: autocomplete.coords ? `${autocomplete.coords.top - (editorRef.current?.getBoundingClientRect().top || 0) + 26}px` : '40px',
                    left: autocomplete.coords ? `${autocomplete.coords.left - (editorRef.current?.getBoundingClientRect().left || 0) + 8}px` : '15px'
                  }}
                >
                  <div className="px-2 py-0.5 text-[9px] font-mono text-neon-cyan uppercase tracking-wider border-b border-white/5 mb-1 bg-[#14141a] flex justify-between items-center bg-gray-900/40">
                    <span>Header Variables</span>
                    <span className="text-gray-500 font-normal">Enter</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto custom-scrollbar">
                    {availableVariables
                      .filter(v => v.toLowerCase().includes(autocomplete.query.toLowerCase()))
                      .map((v, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleInsertAutocomplete(v)}
                          onMouseDown={(e) => e.preventDefault()}
                          onMouseEnter={() => setAutocomplete({ ...autocomplete, selectedIndex: idx })}
                          className={`w-full text-left px-2 py-1 text-xs font-mono transition-all flex items-center justify-between ${autocomplete.selectedIndex === idx ? 'bg-neon-cyan/20 text-white font-bold' : 'text-gray-400 hover:bg-neon-cyan/5'}`}
                        >
                          <span>{'{'}{v}{'}'}</span>
                          {autocomplete.selectedIndex === idx && <Check className="w-3 h-3 text-neon-cyan" />}
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-neon-cyan" />
              Variable Suggestion: Type {'{'} to trigger autocomplete.
            </span>
            <span>Draft will keep syncing locally.</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSignatureManagerOpen(true)}
                className="text-xs font-bold leading-none bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-lg transition-all flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-neon-pink" /> Manage Signatures
              </button>
              <select 
                value={selectedSignatureId}
                onChange={(e) => setSelectedSignatureId(e.target.value)}
                className="bg-[#121215] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-pink outline-none appearance-none font-medium custom-select"
              >
                {signatures.map(s => (
                  <option key={s.id} value={s.id}>{s.name} {s.isDefault ? '(Default)' : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setIsPreviewModalOpen(true)}
                className="flex-1 sm:flex-none text-xs font-bold leading-none bg-[#121216] border border-white/10 hover:border-neon-cyan/50 text-gray-200 px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-neon-cyan" /> Preview Email
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Save Template Modal */}
      <AnimatePresence>
        {isTemplateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsTemplateModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#0a0a0f] border border-white/15 rounded-xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-display font-bold mb-2 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-neon-cyan" />
                {editingTemplateId ? 'Rename Template Label' : 'Save as Outreach Template'}
              </h3>
              <p className="text-xs text-gray-400 mb-6">Store this subject and rich message body to quickly swap presets while creating sequences.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1.5">Template Custom Name</label>
                  <input 
                    type="text" 
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g. Sales Deliverability Warm Outreach 1"
                    className="w-full bg-[#121215] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-neon-cyan outline-none transition-all font-medium"
                  />
                </div>
                
                <div className="pt-2 flex justify-end gap-2.5">
                  <button 
                    onClick={() => setIsTemplateModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveTemplate}
                    disabled={!templateName}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-black bg-neon-cyan hover:bg-neon-cyan/80 transition-all disabled:opacity-40"
                  >
                    {editingTemplateId ? 'Commit Changes' : 'Draft New Template'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Email Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsPreviewModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#050508] border border-white/15 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-neon-cyan to-neon-pink"></div>
              
              <div className="p-5 flex justify-between items-center border-b border-white/5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#00f3ff] flex items-center gap-2">
                    <Eye className="w-4 h-4 text-neon-cyan" /> Email Preview Mockup
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1">Review rendering with sample merge tags.</p>
                </div>
                <button onClick={() => setIsPreviewModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-[#0a0a0f] border-b border-white/5 flex items-center justify-between">
                <label className="block text-[9px] uppercase font-bold tracking-widest text-gray-500 mb-1.5">Cycle Preview Lead</label>
                <div className="flex items-center gap-4 bg-[#15151a] border border-white/10 rounded px-2 py-1 flex-1 max-w-[280px] justify-between">
                  <button 
                    onClick={() => setSelectedPreviewLeadIdx(prev => Math.max(0, prev - 1))}
                    disabled={selectedPreviewLeadIdx === 0}
                    className="px-3 py-1 text-xs font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed bg-white/5 rounded transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-mono text-gray-300 font-bold tracking-widest">
                    {selectedPreviewLeadIdx + 1} / {leads?.length || 0}
                  </span>
                  <button 
                    onClick={() => setSelectedPreviewLeadIdx(prev => Math.min((leads?.length || 1) - 1, prev + 1))}
                    disabled={leads === undefined || leads.length === 0 || selectedPreviewLeadIdx === (leads?.length || 1) - 1}
                    className="px-3 py-1 text-xs font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed bg-white/5 rounded transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-[#0e0e12] p-6 max-h-[60vh] overflow-y-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-gray-800">
                  <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 text-sm">
                    <div className="flex mb-2">
                      <span className="w-16 text-gray-500 font-medium">From:</span>
                      <span className="text-gray-900 font-medium">sarah.carter@nexzivo.io</span>
                    </div>
                    <div className="flex mb-2">
                      <span className="w-16 text-gray-500 font-medium">To:</span>
                      <span className="text-gray-900">{leads && leads[selectedPreviewLeadIdx] ? leads[selectedPreviewLeadIdx].email || 'lead@example.com' : 'lead@example.com'}</span>
                    </div>
                    <div className="flex pt-2 mt-2 border-t border-gray-200">
                      <span className="w-16 text-gray-500 font-medium">Subject:</span>
                      <span className="font-bold text-gray-900">
                        {subject ? resolvePreviewVariables(subject) : <span className="text-gray-400 font-normal italic">No Subject</span>}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 min-h-[250px] font-sans text-sm leading-relaxed">
                    <div dangerouslySetInnerHTML={{ 
                        __html: resolvePreviewVariables(body) || '<span style="color: #9ca3af; font-style: italic;">No body content</span>'
                      }} 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Signature Manager Modal */}
      <AnimatePresence>
        {isSignatureManagerOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => {
                setIsSignatureManagerOpen(false);
                setIsEditingSignature(false);
                setEditingSignatureId(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl bg-[#0a0a0f] border border-white/15 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh] md:h-[80vh]"
            >
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#050508] shrink-0">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-display font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-neon-pink" /> Manage Signatures
                  </h3>
                  <AnimatePresence>
                    {showSuccessToast && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, filter: 'blur(2px)' }}
                        className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/20 rounded-md text-xs font-medium flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Saved successfully
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button 
                  onClick={() => {
                    setIsSignatureManagerOpen(false);
                    setIsEditingSignature(false);
                    setEditingSignatureId(null);
                  }}
                  className="text-gray-400 hover:text-white p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left side list */}
                <div className={`w-full md:w-1/3 bg-[#08080c] border-r border-white/5 flex flex-col shrink-0 ${isEditingSignature ? 'hidden md:flex opacity-50 pointer-events-none' : ''}`}>

                  <div className="p-4 border-b border-white/5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="Search signatures..."
                        value={signatureSearchQuery}
                        onChange={(e) => setSignatureSearchQuery(e.target.value)}
                        className="w-full bg-[#121215] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-neon-pink outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {filteredSignatures.map(s => (
                      <div key={s.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors group">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-200 truncate flex items-center gap-2">
                              {s.name}
                              {s.isDefault && <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider bg-neon-pink/20 text-neon-pink leading-none">Default</span>}
                            </h4>
                            <div className="text-[10px] text-gray-500 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: s.content }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditSignature(s)} className="text-[10px] bg-white/5 hover:bg-neon-pink/20 hover:text-neon-pink px-2 py-1 rounded text-gray-300 font-bold transition-colors">Edit</button>
                          <button onClick={(e) => handleDuplicateSignature(s, e)} className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-gray-300 transition-colors">Duplicate</button>
                          {!s.isDefault && (
                            <button onClick={(e) => handleSetDefaultSignature(s.id, e)} className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-gray-300 transition-colors ml-auto mr-1" title="Set Default">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={(e) => handleDeleteSignature(s.id, e)} className="text-[10px] text-gray-500 hover:text-red-400 p-1 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    {filteredSignatures.length === 0 && (
                      <div className="text-xs text-gray-500 text-center py-6 italic">No signatures found.</div>
                    )}
                  </div>
                  <div className="p-4 border-t border-white/5 bg-[#0a0a0f]">
                    <button 
                      onClick={handleAddNewSignature}
                      disabled={signatures.length >= 11}
                      className="w-full flex justify-center items-center gap-2 py-2 bg-neon-pink/15 hover:bg-neon-pink/25 text-neon-pink border border-neon-pink/20 rounded-lg text-xs font-bold transition-all"
                    >
                      <Plus className="w-4 h-4" /> Create Signature ({signatures.length}/11)
                    </button>
                  </div>
                </div>

                {/* Right side editor */}
                <div className={`w-full md:w-2/3 bg-[#0a0a0f] flex-col min-w-0 ${isEditingSignature ? 'flex' : 'hidden md:flex justify-center items-center'}`}>
                  {isEditingSignature ? (
                    <div className="h-full flex flex-col flex-1 min-h-0 animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-6 border-b border-white/5 shrink-0 bg-[#0a0a0f]">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-bold text-white uppercase tracking-widest">{editingSignatureId ? 'Edit Signature' : 'New Signature'}</h4>
                          <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded">HTML Supported</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1.5">Signature Name <span className="text-neon-pink">*</span></label>
                            <input 
                              type="text" 
                              placeholder="e.g. Sales Account Team"
                              value={signatureNameInput}
                              onChange={(e) => setSignatureNameInput(e.target.value)}
                              className={`w-full bg-[#121215] border ${!signatureNameInput ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-neon-pink'} rounded-lg px-3 py-2 text-xs text-white outline-none font-medium transition-colors`}
                            />
                            {!signatureNameInput && <p className="text-[10px] text-red-400 mt-1.5 font-medium">Signature Name is required.</p>}
                          </div>
                          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={signatureIsDefault}
                              onChange={(e) => setSignatureIsDefault(e.target.checked)}
                              className="rounded border-white/10 bg-[#121214] text-neon-pink focus:ring-neon-pink/30 accent-neon-pink w-4 h-4"
                            />
                            Set as default signature
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar p-6">
                        <div className="border border-white/10 rounded-xl bg-[#0d0d12] flex flex-col flex-none min-h-[200px] overflow-hidden focus-within:border-neon-pink/40 transition-colors mb-6">

                          <div 
                            onMouseDown={(e) => {
                              if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'SELECT' && (e.target as HTMLElement).tagName !== 'OPTION') {
                                e.preventDefault();
                              }
                            }}
                            className="flex flex-wrap items-center gap-1 border-b border-white/5 p-1.5 bg-[#121216]"
                          >
                            {/* Text Styles */}
                            <button onClick={() => handleSignatureCommand('bold')} className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"><Bold className="w-4 h-4" /></button>
                            <button onClick={() => handleSignatureCommand('italic')} className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"><Italic className="w-4 h-4" /></button>
                            <button onClick={() => handleSignatureCommand('underline')} className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"><Underline className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-white/10 mx-1"></div>
                            
                            {/* Font Config */}
                            <div className="relative flex items-center gap-1.5">
                              <div className="relative">
                                <select onChange={(e) => handleSignatureCommand('fontName', e.target.value)} defaultValue="Inter" className="bg-[#1a1a20] border border-white/10 text-xs text-gray-300 outline-none hover:border-white/20 focus:border-neon-pink cursor-pointer px-2 py-1 rounded appearance-none font-medium pr-6 min-w-[100px]">
                                  <option value="Consolas">Consolas</option>
                                  <option value="Inter">Inter</option>
                                  <option value="Poppins">Poppins</option>
                                  <option value="Roboto">Roboto</option>
                                  <option value="'Open Sans'">Open Sans</option>
                                  <option value="Montserrat">Montserrat</option>
                                  <option value="Lato">Lato</option>
                                  <option value="'Source Sans 3'">Source Sans Pro</option>
                                  <option value="Nunito">Nunito</option>
                                  <option value="'Work Sans'">Work Sans</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1.5 pointer-events-none" />
                              </div>
                              <div className="relative">
                                <select onChange={(e) => handleSignatureCommand('fontSize', e.target.value)} defaultValue="3" className="bg-[#1a1a20] border border-white/10 text-xs text-gray-300 outline-none hover:border-white/20 focus:border-neon-pink cursor-pointer px-2 py-1 rounded appearance-none font-medium pr-6 min-w-[80px]">
                                  <option value="1">Small</option>
                                  <option value="3">Medium</option>
                                  <option value="5">Large</option>
                                  <option value="7">Huge</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1.5 pointer-events-none" />
                              </div>
                              <label className="cursor-pointer rounded-full overflow-hidden w-6 h-6 border border-white/20 hover:border-white/50 flex items-center justify-center bg-[#1a1a20] relative" title="Text Color">
                                <span className="absolute text-[10px] pb-[1px] font-bold text-gray-400 pointer-events-none">A</span>
                                <input type="color" onChange={(e) => handleSignatureCommand('foreColor', e.target.value)} className="w-[150%] h-[150%] opacity-0 cursor-pointer" />
                              </label>
                            </div>
                            <div className="w-px h-4 bg-white/10 mx-1.5"></div>

                            {/* Lists & Align */}
                            <button onClick={() => handleSignatureCommand('insertUnorderedList')} className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"><List className="w-4 h-4" /></button>
                            <button onClick={() => handleSignatureCommand('insertOrderedList')} className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"><ListOrdered className="w-4 h-4" /></button>
                            <button onClick={() => handleSignatureCommand('justifyLeft')} className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"><AlignLeft className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleSignatureCommand('justifyCenter')} className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"><AlignCenter className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleSignatureCommand('justifyRight')} className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"><AlignRight className="w-3.5 h-3.5" /></button>
                            <div className="w-px h-4 bg-white/10 mx-1"></div>

                            <button onClick={() => handleSignatureCommand('undo')} className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"><Undo className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleSignatureCommand('redo')} className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"><Redo className="w-3.5 h-3.5" /></button>
                            <div className="w-px h-4 bg-white/10 mx-1"></div>

                            <button 
                              onClick={() => {
                                const url = prompt('Insert link destination (https://...):');
                                if (url) handleSignatureCommand('createLink', url);
                              }} 
                              className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"
                            >
                              <LinkIcon className="w-4 h-4" />
                            </button>
                            
                            <div className="ml-auto flex items-center gap-1.5">
                              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mr-2 hidden xl:block">Presets:</span>
                              <button onClick={() => insertSignaturePreset('social')} className="text-[10px] font-medium bg-white/5 px-2 py-1 rounded hover:bg-white/10 text-gray-300 transition-colors">Social</button>
                              <button onClick={() => insertSignaturePreset('button')} className="text-[10px] font-medium bg-white/5 px-2 py-1 rounded hover:bg-white/10 text-gray-300 transition-colors">CTA</button>
                              <button onClick={() => insertSignaturePreset('image')} className="text-[10px] font-medium bg-white/5 px-2 py-1 rounded hover:bg-white/10 text-gray-300 transition-colors">Avatar</button>
                            </div>
                          </div>
                          <div 
                            ref={signatureEditorRef}
                            contentEditable
                            onInput={(e) => {
                               setSignatureEditorHtml(e.currentTarget.innerHTML);
                            }}
                            onMouseUp={saveSelection}
                            onKeyUp={(e) => {
                               saveSelection();
                            }}
                            className="flex-none bg-transparent px-4 py-4 text-sm text-white/95 outline-none overflow-y-auto leading-relaxed select-text font-sans bg-white/5 min-h-[150px] max-h-[250px]"
                            placeholder="Type your signature here..."
                          />
                        </div>
                        
                        <div className="flex flex-col flex-1">
                           <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 mt-2">Live Preview (Scale 1:1)</label>
                           <div className="flex-auto bg-white p-6 rounded-xl border border-white/10 shadow-inner relative min-h-[200px]">
                             <div className="absolute top-2 right-2 text-[10px] text-gray-400 font-mono">Simulated Email Client</div>
                             <div 
                               className="text-sm font-sans text-gray-900" 
                               dangerouslySetInnerHTML={{ __html: signatureEditorHtml || '<span style="color:#aaa;font-style:italic">Your signature will appear here...</span>'}} 
                             />
                           </div>
                        </div>
                      </div>

                      <div className="p-4 md:p-6 border-t border-white/5 bg-[#0a0a0f] sticky bottom-0 z-10 flex justify-between items-center shrink-0">
                        {editingSignatureId ? (
                          <button 
                            onClick={(e) => handleDeleteSignature(editingSignatureId, e)}
                            className="px-4 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        ) : (
                          <div></div>
                        )}
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => {
                              setIsEditingSignature(false);
                              setEditingSignatureId(null);
                            }}
                            className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleSaveOrUpdateSignature}
                            disabled={!signatureNameInput}
                            className="px-6 py-2 rounded-lg text-xs font-bold text-white bg-neon-pink hover:bg-neon-pink/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {editingSignatureId ? 'Update Signature' : 'Save Signature'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-sm font-medium">Select a signature from the list to edit,<br/>or create a new one.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.6rem center;
          background-repeat: no-repeat;
          background-size: 1.1em 1.1em;
        }
        .custom-editor ul, .text-gray-200 ul {
          list-style-type: disc !important;
          padding-left: 1.25rem !important;
          margin-bottom: 0.5rem !important;
        }
        .custom-editor ol, .text-gray-200 ol {
          list-style-type: decimal !important;
          padding-left: 1.25rem !important;
          margin-bottom: 0.5rem !important;
        }
        .custom-editor h3, .text-gray-200 h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 0.75rem;
          margin-bottom: 0.35rem;
          color: white;
        }
        .custom-editor h4, .text-gray-200 h4 {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 0.6rem;
          margin-bottom: 0.25rem;
          color: white;
        }
        .custom-editor a, .text-gray-200 a {
          color: #00f3ff;
          text-decoration: underline;
        }
        /* contenteditable placeholder behavior */
        .custom-editor:empty:before {
          content: attr(placeholder);
          color: rgba(156, 163, 175, 0.3);
          cursor: text;
        }
      `}</style>
    </section>
  );
}
