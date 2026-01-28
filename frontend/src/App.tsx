import { AlertTriangle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function App() {
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Poll messages every 2 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch("http://localhost:3001/messages");
                const data: unknown = await res.json();

                if (Array.isArray(data)) {
                    setMessages(data as string[]);
                }
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Auto scroll to latest message
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
        <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-tr from-violet-950 to-violet-500">
            <div className="flex flex-col h-[80vh] sm:w-[80vw] lg:w-[60vw] border-4 border-black rounded-3xl overflow-hidden my-8 shadow-2xl">

                {/* HEADER */}
                <div className="flex items-center bg-red-700 px-4 py-3">
                    <AlertTriangle className="text-yellow-400 w-12 h-12" />
                    <div className="text-white ml-4">
                        <p className="text-2xl font-bold">DisasterNet</p>
                        <p className="text-sm opacity-90">
                            Emergency Communication • No Internet Required
                        </p>
                    </div>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 bg-slate-700 px-6 py-4 overflow-y-auto space-y-2">
                    {messages.length > 0 ? (
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className="text-white bg-slate-800 px-4 py-2 rounded-xl max-w-[90%] shadow"
                            >
                                {msg}
                            </div>
                        ))
                    ) : (
                        <div className="text-slate-300 text-center mt-6">
                            No messages yet
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT */}
                <div className="bg-slate-800 flex items-center px-4 py-3 gap-3">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1 p-2 rounded-lg bg-slate-600 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />

                    <button
                        onClick={sendMessage}
                        className="p-2 rounded-full hover:bg-slate-700 transition"
                        aria-label="Send message"
                    >
                        <Send className="text-gray-300 w-7 h-7" />
                    </button>
                </div>
            </div>

            {/* FOOTER */}
            <div className="px-4 w-full flex justify-center my-6">
                <div className="max-w-2xl w-full bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-md text-center">
                    <p className="text-xl font-bold mb-2">
                        Created by{" "}
                        <a
                            href="https://github.com/M1D0R1x"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                        >
                            M1D0R1x
                        </a>
                    </p>

                    <p className="text-gray-300 mb-4">
                        Frontend of <strong>DisasterNet</strong> — built for communication
                        when the internet fails.
                    </p>

                    <a
                        href="https://github.com/M1D0R1x/Disaster_Net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline font-medium"
                    >
                        View full project on GitHub →
                    </a>
                </div>
            </div>
        </div>
    );
}
