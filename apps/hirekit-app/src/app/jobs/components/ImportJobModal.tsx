'use client';

import { useState, useRef, useCallback } from 'react';
import type { JobFormData } from './JobForm';

interface ImportJobModalProps {
  onImport: (data: Partial<JobFormData>) => void;
}

type Tab = 'paste' | 'upload';

export function ImportJobModal({ onImport }: ImportJobModalProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('paste');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setText('');
    setFile(null);
    setError('');
    setLoading(false);
    setDragOver(false);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleFileSelect = (f: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (f.size > maxSize) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }
    const name = f.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.txt')) {
      setError('Please upload a PDF or TXT file.');
      return;
    }
    setFile(f);
    setError('');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  }, []);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      let res: Response;

      if (tab === 'paste') {
        if (!text.trim()) {
          setError('Please paste some text first.');
          setLoading(false);
          return;
        }
        res = await fetch('/api/v1/jobs/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
      } else {
        if (!file) {
          setError('Please select a file first.');
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        res = await fetch('/api/v1/jobs/import', {
          method: 'POST',
          body: formData,
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to extract job data.');
        setLoading(false);
        return;
      }

      onImport(data.jobData);
      handleClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F0EDFF] text-[#4F46E5] font-semibold text-sm hover:bg-[#E0E7FF] transition-colors"
      >
        <i className="ph ph-upload-simple text-base" />
        Import existing job
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">Import Job Listing</h3>
                <p className="text-sm text-[#64748B] mt-0.5">
                  Paste text or upload a file to auto-fill the form
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
              >
                <i className="ph ph-x text-lg" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                onClick={() => { setTab('paste'); setError(''); }}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                  tab === 'paste'
                    ? 'text-[#4F46E5] border-b-2 border-[#4F46E5]'
                    : 'text-[#94A3B8] hover:text-[#64748B]'
                }`}
              >
                <i className="ph ph-clipboard-text mr-1.5" />
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => { setTab('upload'); setError(''); }}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                  tab === 'upload'
                    ? 'text-[#4F46E5] border-b-2 border-[#4F46E5]'
                    : 'text-[#94A3B8] hover:text-[#64748B]'
                }`}
              >
                <i className="ph ph-file-arrow-up mr-1.5" />
                Upload File
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {tab === 'paste' ? (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your job listing text here..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all resize-none text-sm"
                />
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    dragOver
                      ? 'border-[#4F46E5] bg-[#F0EDFF]'
                      : file
                      ? 'border-green-300 bg-green-50'
                      : 'border-slate-200 hover:border-[#4F46E5] hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileSelect(f);
                    }}
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <i className="ph ph-file-text text-2xl" />
                      <span className="font-medium text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="ml-2 text-[#94A3B8] hover:text-red-500"
                      >
                        <i className="ph ph-x" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <i className="ph ph-cloud-arrow-up text-3xl text-[#94A3B8] mb-2" />
                      <p className="text-sm font-medium text-[#64748B]">
                        Drop a file here or click to browse
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        PDF or TXT, up to 5MB
                      </p>
                    </>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <i className="ph ph-warning-circle" />
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || (tab === 'paste' ? !text.trim() : !file)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white font-semibold text-sm hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Extracting...
                  </>
                ) : (
                  <>
                    <i className="ph ph-magic-wand text-base" />
                    Extract Job Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
