// features/chat/MessageInput.jsx
import { useRef, useState } from "react";
import { Send, Paperclip, Smile, Mic, Square } from "lucide-react";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const toggleRecording = async () => {
    if (recording) { recorderRef.current?.stop(); return; }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      const reader = new FileReader();
      reader.onloadend = () => onSend(reader.result);
      reader.readAsDataURL(blob);
      stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 border-t border-border p-3 bg-card"
    >
      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled}
        className={`w-10 h-10 rounded-full flex items-center justify-center ${recording ? "bg-red-500 text-white" : "text-muted-foreground hover:bg-muted"}`}
        title={recording ? "إيقاف التسجيل" : "تسجيل صوتي"}
      >{recording ? <Square className="w-4 h-4" /> : <Mic className="w-5 h-5" />}</button>
      <button
        type="button"
        className="w-10 h-10 rounded-full text-muted-foreground hover:bg-muted flex items-center justify-center"
        title="إرفاق ملف"
      >
        <Paperclip className="w-5 h-5" />
      </button>
      <button
        type="button"
        className="w-10 h-10 rounded-full text-muted-foreground hover:bg-muted flex items-center justify-center"
        title="إيموجي"
      >
        <Smile className="w-5 h-5" />
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? "غير متصل…" : "اكتب رسالتك…"}
        disabled={disabled}
        className="flex-1 rounded-full bg-muted/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition"
        title="إرسال"
      >
        <Send className="w-5 h-5 -rotate-180 rtl:rotate-0" />
      </button>
    </form>
  );
}
