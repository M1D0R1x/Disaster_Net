import { AlertTriangle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function App() {
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch("http://localhost:3001/messages");
                const data: unknown = await res.json();
                if (Array.isArray(data)) setMessages(data as string[]);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            await fetch("http://localhost:3001/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            setMessage("");
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
            <div className="flex flex-col h-[82vh] sm:w-[85vw] lg:w-[62vw] rounded-3xl overflow-hidden my-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/10 bg-slate-900/60 backdrop-blur-xl">

                {/* HEADER */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-cyan-500/10">
                    <div className="p-2 rounded-xl bg-red-600/20">
                        <AlertTriangle className="text-red-400 w-9 h-9" />
                    </div>
                    <div className="text-white">
                        <p className="text-2xl font-semibold tracking-wide">DisasterNet</p>
                        <p className="text-xs text-slate-300">
                            Offline-first emergency communication system
                        </p>
                    </div>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 px-6 py-5 overflow-y-auto space-y-3">
                    {messages.length > 0 ? (
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className="w-fit max-w-[85%] rounded-2xl px-4 py-2 text-sm text-slate-100 bg-gradient-to-br from-slate-800 to-slate-700 shadow-md"
                            >
                                {msg}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-slate-400 mt-10 text-sm">
                            Waiting for incoming messages…
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT */}
                <div className="px-5 py-4 border-t border-white/10 bg-slate-900/80 flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Transmit message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                    />

                    <button
                        onClick={sendMessage}
                        className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 hover:brightness-110 transition"
                        aria-label="Send message"
                    >
                        <Send className="text-white w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* FOOTER */}
            <div className="w-full flex justify-center px-4 mb-8">
                <div className="max-w-2xl w-full rounded-2xl p-6 text-center bg-slate-900/40 border border-white/10 backdrop-blur-md">
                    <p className="text-lg font-semibold text-white mb-2">
                        Built by{" "}
                        <a
                            href="https://github.com/M1D0R1x"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline"
                        >
                            M1D0R1x
                        </a>
                    </p>

                    <p className="text-slate-300 text-sm mb-4">
                        DisasterNet is designed for communication when infrastructure
                        collapses — simple, fast, and resilient.
                    </p>

                    <a
                        href="https://github.com/M1D0R1x/Disaster_Net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 text-sm hover:underline"
                    >
                        View full project on GitHub →
                    </a>
                </div>
            </div>
        </div>
    );
}
