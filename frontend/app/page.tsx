'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: promptText }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptText, thread_id: threadId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (!threadId) setThreadId(data.thread_id);
        const { answer, final_response, flight_results, hotel_results, itinerary, budget_results, requires_approval, approval_request } = data;
        
        let responseText = "";
        if (flight_results) responseText += `✈️ **Flights:**\n${flight_results}\n\n`;
        if (hotel_results) responseText += `🏨 **Hotels:**\n${hotel_results}\n\n`;
        if (budget_results) responseText += `💰 **Budget:**\n${budget_results}\n\n`;
        if (itinerary) responseText += `📅 **Itinerary:**\n${itinerary}\n\n`;
        
        if (requires_approval) {
          responseText += `\n⚠️ **Approval Required:** ${approval_request}`;
        }
        
        if (!responseText.trim()) {
           responseText = final_response || answer || "Failed to generate detailed plan.";
        }
        
        setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${data.error}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: `Failed to fetch: ${error}` }]);
    } finally {
        setLoading(false);
    }
  };

  const handleApprove = async (approved: boolean) => {
      setLoading(true);
      setMessages(prev => [...prev, { role: 'user', text: approved ? 'Approve Draft ✅' : 'Reject Draft ❌' }]);

      try {
        const response = await fetch('http://localhost:8000/api/travel/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              thread_id: threadId,
              approved: approved,
              feedback: approved ? '' : 'Please improve the itinerary.'
          })
        });

        const data = await response.json();
        if (data.success) {
           setMessages(prev => [...prev, { role: 'assistant', text: data.final_response || data.answer || "Plan Finalized!" }]);
        }
      } catch(e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            TripMate Travel AI
          </h1>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Agent Online
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto p-4 pb-32 flex flex-col gap-6 mt-4">
        {messages.length === 0 ? (
          <div className="text-center mt-20 flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
               ✈️
            </div>
            <h2 className="text-3xl font-light tracking-tight">Where will we go today?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 w-full max-w-2xl">
               <button onClick={() => sendPrompt("Plan a 7 days Japan trip from Bangladesh under 2 lakhs.")} className="p-4 flex flex-col items-start gap-1 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all text-left group">
                  <span className="font-medium group-hover:text-indigo-400 transition-colors">Japan Trip</span>
                  <span className="text-sm text-neutral-500">7 days under 2L BDT</span>
               </button>
               <button onClick={() => sendPrompt("Plan a 5 days Dubai trip from Dhaka")} className="p-4 flex flex-col items-start gap-1 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all text-left group">
                  <span className="font-medium group-hover:text-purple-400 transition-colors">Dubai Trip</span>
                  <span className="text-sm text-neutral-500">5 days luxury escape</span>
               </button>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[85%] rounded-2xl p-5 ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' : 'bg-neutral-800/80 border border-neutral-700/50 prose prose-invert overflow-x-auto shadow-sm'}`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                    {msg.text}
                </div>
                
                {msg.role === 'assistant' && msg.text.includes('Approval Required') && (
                    <div className="mt-4 flex gap-3 border-t border-neutral-700/50 pt-4">
                        <button onClick={() => handleApprove(true)} className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-sm font-medium">Approve ✅</button>
                        <button onClick={() => handleApprove(false)} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-medium">Reject & Revise ❌</button>
                    </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
           <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl p-5 bg-neutral-800/50 border border-neutral-700/30 flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.15s]"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Form Top Layer */}
      <div className="fixed bottom-0 w-full bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent pt-12 pb-6 px-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendPrompt(input); }} 
          className="max-w-4xl mx-auto relative flex items-end shadow-2xl"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Plan my trip..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendPrompt(input);
              }
            }}
            className="w-full bg-neutral-800/80 border border-neutral-700 rounded-2xl p-4 pr-16 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none min-h-[60px] max-h-40 overflow-y-auto backdrop-blur-md"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-3 bottom-3 p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all active:scale-95 shadow-md shadow-indigo-900/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </form>
        <div className="max-w-4xl mx-auto text-center mt-3">
            <p className="text-xs text-neutral-600">TripMate AI can make mistakes. Please verify important flight and booking info.</p>
        </div>
      </div>
    </div>
  );
}
