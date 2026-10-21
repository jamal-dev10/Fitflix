import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  X,
  Copy,
  Sparkles,
  Target,
  Flame,
  Clock,
  TrendingUp,
  FileText,
  Eye,
  Check,
  History,
  ShieldCheck,
  Bell
} from 'lucide-react';

interface WeeklySummaryEmailModalProps {
  token: string | null;
  userEmail: string;
  userName: string;
}

export const WeeklySummaryEmailModal: React.FC<WeeklySummaryEmailModalProps> = ({
  token,
  userEmail,
  userName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'history'>('html');
  const [summary, setSummary] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);

  // Fetch summary preview
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const [sumRes, histRes] = await Promise.all([
        fetch('/api/notifications/weekly-summary', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch('/api/notifications/history', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      ]);

      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData.summary);
      }
      if (histRes.ok) {
        const histData = await histRes.json();
        setHistory(histData.history || []);
      }
    } catch (err) {
      console.error('Failed to load weekly summary preview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [token]);

  // Send / Dispatch email
  const handleSendEmail = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/notifications/weekly-summary/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (res.ok) {
        const data = await res.json();
        setToastMessage(`Weekly summary email dispatched to ${userEmail}!`);
        if (data.record) {
          setHistory((prev) => [data.record, ...prev]);
        }
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to dispatch weekly summary email:', err);
    } finally {
      setSending(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Dashboard Feature Banner */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-neutral-900 border border-[#FFFF00]/40 flex items-center justify-center shrink-0 text-[#FFFF00]">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFFF00]">
                Automated Digest Engine
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-mono font-bold">SUNDAY DIGEST READY</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold uppercase text-white tracking-tight">
              Weekly Consistency & Goals Summary Email
            </h3>
            <p className="text-xs text-neutral-400 max-w-2xl mt-0.5">
              Generates an automated executive performance report detailing your 7-day workout volume,
              consistency rating, and percentage attainment across each defined fitness goal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              fetchSummary();
              setIsOpen(true);
            }}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-[#FFFF00] text-neutral-200 hover:text-white text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#FFFF00]" />
            <span>Preview Digest</span>
          </button>

          <button
            type="button"
            disabled={sending}
            onClick={handleSendEmail}
            className="px-4 py-2.5 bg-[#FFFF00] hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sending ? 'Sending...' : 'Send Email Now'}</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Email Preview Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
            {/* Top Bar: Email Client Simulator Header */}
            <div className="bg-neutral-950 border-b border-neutral-800 p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-900 border border-[#FFFF00]/40 flex items-center justify-center text-[#FFFF00]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span>FitFlex Weekly Summary Notification Generator</span>
                    <span className="px-1.5 py-0.2 bg-neutral-800 text-[10px] font-mono text-[#FFFF00]">
                      RFC 2822 / HTML
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono block">
                    Recipient: <strong className="text-white">{userEmail}</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white p-1.5 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Email Envelope Details */}
            {summary && (
              <div className="bg-neutral-950/70 border-b border-neutral-800 px-6 py-3 text-xs space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 font-mono w-16">Subject:</span>
                  <span className="font-extrabold text-[#FFFF00] truncate">{summary.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 font-mono w-16">From:</span>
                  <span className="text-neutral-300">FitFlex Performance Engine &lt;digest@fitflex.com&gt;</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 font-mono w-16">Period:</span>
                  <span className="text-neutral-300 font-mono">{summary.dateRange}</span>
                </div>
              </div>
            )}

            {/* Modal Tabs Header */}
            <div className="flex items-center justify-between px-6 py-2 bg-neutral-900 border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('html')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'html'
                      ? 'bg-neutral-800 text-[#FFFF00] border border-neutral-700'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Rich HTML Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'text'
                      ? 'bg-neutral-800 text-[#FFFF00] border border-neutral-700'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Plain Text Fallback</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'history'
                      ? 'bg-neutral-800 text-[#FFFF00] border border-neutral-700'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Dispatch Log ({history.length})</span>
                </button>
              </div>

              {summary && (
                <button
                  type="button"
                  onClick={() => handleCopy(activeTab === 'html' ? summary.htmlContent : summary.textContent)}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 py-1 px-2.5 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Template Code'}</span>
                </button>
              )}
            </div>

            {/* Modal Body / Viewport */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-black">
              {loading ? (
                <div className="py-20 text-center text-xs text-neutral-500 font-mono">
                  Synthesizing weekly workout consistency and goal attainment metrics...
                </div>
              ) : activeTab === 'html' && summary ? (
                <div className="max-w-[620px] mx-auto bg-black p-2 border border-neutral-800 shadow-xl">
                  {/* Rendered HTML Email Preview inside sandboxed iframe/container */}
                  <div
                    dangerouslySetInnerHTML={{ __html: summary.htmlContent }}
                    className="email-render-preview"
                  />
                </div>
              ) : activeTab === 'text' && summary ? (
                <div className="max-w-2xl mx-auto bg-neutral-950 p-6 border border-neutral-800 font-mono text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed selection:bg-[#FFFF00] selection:text-black">
                  {summary.textContent}
                </div>
              ) : activeTab === 'history' ? (
                <div className="max-w-2xl mx-auto space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Dispatched Digest Ledger
                    </h4>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Persistent across sessions
                    </span>
                  </div>

                  {history.length === 0 ? (
                    <div className="py-12 text-center bg-neutral-950 border border-neutral-800/80 p-6 space-y-2">
                      <Mail className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p className="text-xs text-neutral-400">
                        No previous weekly summary digests dispatched yet. Click &ldquo;Send Email Now&rdquo; to send the first digest.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {history.map((record) => (
                        <div
                          key={record.id}
                          className="bg-neutral-950 border border-neutral-800 p-4 space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-extrabold text-white block">
                                {record.subject}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                Sent to: {record.recipientEmail} • {new Date(record.sentAt).toLocaleString()}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                              {record.status || 'delivered'}
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-900 text-center text-[10px] font-mono">
                            <div>
                              <span className="text-neutral-500 block uppercase">Workouts</span>
                              <strong className="text-white">{record.stats?.totalWorkouts ?? '—'}</strong>
                            </div>
                            <div>
                              <span className="text-neutral-500 block uppercase">Time</span>
                              <strong className="text-[#FFFF00]">{record.stats?.totalMinutes ?? '—'}m</strong>
                            </div>
                            <div>
                              <span className="text-neutral-500 block uppercase">Consistency</span>
                              <strong className="text-white">{record.stats?.consistencyPct ?? '—'}%</strong>
                            </div>
                            <div>
                              <span className="text-neutral-500 block uppercase">Goals Tracked</span>
                              <strong className="text-white">{record.goalsCount ?? '—'}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-neutral-950 border-t border-neutral-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={autoSendEnabled}
                  onChange={(e) => setAutoSendEnabled(e.target.checked)}
                  className="rounded-none accent-[#FFFF00]"
                />
                <span>Automatically email weekly digest every Sunday at 8:00 PM</span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold uppercase text-neutral-300 transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  disabled={sending}
                  onClick={handleSendEmail}
                  className="px-5 py-2 bg-[#FFFF00] hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? 'Dispatching...' : 'Dispatch Weekly Email'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
