import React, { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiSearch,
  FiSend,
  FiPlus,
  FiChevronLeft,
  FiPaperclip,
  FiX,
  FiFileText,
  FiImage,
  FiVideo,
} from "react-icons/fi";
import { FaInstagram, FaYoutube, FaTiktok, FaFacebook } from "react-icons/fa";

const STORAGE_KEY = "brand_dashboard_messages_v1";

/**
 * Attachment size limit.
 * NOTE: localStorage often fails even below 3MB because:
 * - base64 expands size ~33%
 * - your app may already store other things
 */
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024; // 2MB (adjust if you want)

function nowTs() {
  return Date.now();
}

function safeId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return String(Date.now() + Math.random());
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleDateString();
  } catch {
    return "";
  }
}

function platformIcon(platform) {
  const p = String(platform || "").toLowerCase();
  if (p.includes("instagram")) return <FaInstagram className="text-pink-600" />;
  if (p.includes("youtube")) return <FaYoutube className="text-red-600" />;
  if (p.includes("tiktok")) return <FaTiktok className="text-gray-900" />;
  if (p.includes("facebook")) return <FaFacebook className="text-blue-600" />;
  return <span className="text-gray-500">•</span>;
}

function seedThreads() {
  const t = nowTs();
  return [
    {
      id: "t1",
      name: "Sarah Jenkins",
      platform: "Instagram",
      unread: 2,
      lastMessageAt: t - 1000 * 60 * 15,
      messages: [
        {
          id: "m1",
          from: "influencer",
          type: "text",
          text: "Hi! I’m interested in your campaign. What deliverables do you need?",
          at: t - 1000 * 60 * 60,
        },
        {
          id: "m2",
          from: "brand",
          type: "text",
          text: "Hey Sarah! We need 1 Reel + 3 Stories. Can you share your rates?",
          at: t - 1000 * 60 * 50,
        },
        {
          id: "m3",
          from: "influencer",
          type: "text",
          text: "Sure. Reel: $350, Stories: $120. Do you need whitelisting?",
          at: t - 1000 * 60 * 15,
        },
      ],
    },
    {
      id: "t2",
      name: "TechGuru42",
      platform: "YouTube",
      unread: 0,
      lastMessageAt: t - 1000 * 60 * 60 * 3,
      messages: [
        {
          id: "m1",
          from: "brand",
          type: "text",
          text: "Hello! Are you available for a YouTube review next month?",
          at: t - 1000 * 60 * 60 * 4,
        },
        {
          id: "m2",
          from: "influencer",
          type: "text",
          text: "Yes, I’m available. Please share product details and timeline.",
          at: t - 1000 * 60 * 60 * 3,
        },
      ],
    },
  ];
}

function randomReply() {
  const replies = [
    "Sounds good. Can you share the brief?",
    "What’s the posting timeline?",
    "Can you confirm deliverables and revision policy?",
    "What’s the budget range for this collaboration?",
    "Do you need raw files / usage rights?",
    "Got it! Please send product details and shipping info.",
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

function isImageType(mime) {
  return String(mime || "").startsWith("image/");
}
function isVideoType(mime) {
  return String(mime || "").startsWith("video/");
}
function isPdfType(mime) {
  return String(mime || "").toLowerCase() === "application/pdf";
}

function fileKindIcon(mime) {
  if (isImageType(mime)) return <FiImage />;
  if (isVideoType(mime)) return <FiVideo />;
  return <FiFileText />;
}

export default function Messages() {
  const outlet = useOutletContext?.() || {};
  const brandName = outlet.brandName || "Brand";

  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [query, setQuery] = useState("");
  const [draftText, setDraftText] = useState("");
  const [mobileView, setMobileView] = useState("list"); // list | chat
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);

  // NEW: attachment state
  const fileInputRef = useRef(null);
  const [attachment, setAttachment] = useState(null); // { name, mime, size, dataUrl }
  const [attachError, setAttachError] = useState("");
  const [storageError, setStorageError] = useState("");

  const endRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          setThreads(parsed);
          setActiveId(parsed[0].id);
          return;
        }
      } catch {}
    }

    const seeded = seedThreads();
    setThreads(seeded);
    setActiveId(seeded[0].id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    } catch {}
  }, []);

  useEffect(() => {
    if (!threads.length) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
      setStorageError("");
    } catch {
      // If storage fails, UI still works in-memory, but won't persist.
      setStorageError(
        "Storage is full. Messages will work now but may not persist after refresh. Use smaller attachments."
      );
    }
  }, [threads]);

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeId) || null,
    [threads, activeId]
  );

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = (threads || [])
      .slice()
      .sort((a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0));

    if (!q) return list;

    return list.filter((t) => {
      const name = String(t.name || "").toLowerCase();
      const platform = String(t.platform || "").toLowerCase();
      const last = t.messages?.[t.messages.length - 1];
      const lastText = String(last?.type === "text" ? last?.text : last?.file?.name || "").toLowerCase();
      return name.includes(q) || platform.includes(q) || lastText.includes(q);
    });
  }, [threads, query]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, activeThread?.messages?.length]);

  const openThread = (id) => {
    setActiveId(id);
    setMobileView("chat");
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
  };

  const createNewThread = () => {
    const name = window.prompt("Influencer name?");
    if (!name) return;

    const platform =
      window.prompt("Platform? (Instagram / YouTube / TikTok / Facebook)") || "Instagram";

    const id = safeId();
    const t = nowTs();

    const newThread = {
      id,
      name: name.trim(),
      platform: platform.trim(),
      unread: 0,
      lastMessageAt: t,
      messages: [
        {
          id: safeId(),
          from: "brand",
          type: "text",
          text: `Hi ${name.trim()}! We’d love to collaborate. Are you available?`,
          at: t,
        },
      ],
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveId(id);
    setMobileView("chat");
  };

  const pushIncomingText = (threadId, text) => {
    const t = nowTs();
    const msg = { id: safeId(), from: "influencer", type: "text", text, at: t };

    setThreads((prev) =>
      prev.map((th) => {
        if (th.id !== threadId) return th;

        const isActiveNow = threadId === activeId && mobileView === "chat";
        const unreadNext = isActiveNow ? 0 : (th.unread || 0) + 1;

        return {
          ...th,
          messages: [...(th.messages || []), msg],
          lastMessageAt: t,
          unread: unreadNext,
        };
      })
    );
  };

  // -------- Attachment handling --------
  const pickAttachment = () => {
    setAttachError("");
    fileInputRef.current?.click();
  };

  const clearAttachment = () => {
    setAttachError("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAttachmentFile = (e) => {
    setAttachError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // allow images, videos, and docs (pdf + common docs)
    const mime = String(file.type || "").toLowerCase();
    const allowed =
      mime.startsWith("image/") ||
      mime.startsWith("video/") ||
      mime === "application/pdf" ||
      mime === "application/msword" ||
      mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mime === "application/vnd.ms-powerpoint" ||
      mime === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      mime === "application/vnd.ms-excel" ||
      mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (!allowed) {
      setAttachError("Unsupported file type. Use image, video, PDF, or office document.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_ATTACHMENT_BYTES) {
      setAttachError(`File too large. Max ${(MAX_ATTACHMENT_BYTES / (1024 * 1024)).toFixed(0)}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Read as DataURL so it can be stored and downloaded
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setAttachment({
        name: file.name,
        mime: file.type || "application/octet-stream",
        size: file.size,
        dataUrl,
      });
    };
    reader.onerror = () => setAttachError("Could not read file. Try again.");
    reader.readAsDataURL(file);
  };

  // -------- Send message (text + optional file) --------
  const sendMessage = () => {
    if (!activeThread) return;

    const text = draftText.trim();
    const hasFile = Boolean(attachment);

    if (!text && !hasFile) return;

    const t = nowTs();

    const msg =
      hasFile && text
        ? {
            id: safeId(),
            from: "brand",
            type: "mixed",
            text,
            file: attachment,
            at: t,
          }
        : hasFile
        ? {
            id: safeId(),
            from: "brand",
            type: "file",
            file: attachment,
            at: t,
          }
        : {
            id: safeId(),
            from: "brand",
            type: "text",
            text,
            at: t,
          };

    setThreads((prev) =>
      prev.map((th) => {
        if (th.id !== activeThread.id) return th;
        return {
          ...th,
          messages: [...(th.messages || []), msg],
          lastMessageAt: t,
          unread: 0,
        };
      })
    );

    setDraftText("");
    clearAttachment();

    // Simulated incoming reply
    if (autoReplyEnabled) {
      window.setTimeout(() => {
        pushIncomingText(activeThread.id, randomReply());
      }, 1200);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Conversation list */}
        <div className={`lg:col-span-1 ${mobileView === "chat" ? "hidden lg:block" : "block"}`}>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-[#5b2333]">Messages</h1>
                <p className="text-xs text-gray-500">Brand: {brandName}</p>
              </div>

              <button
                type="button"
                onClick={createNewThread}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white text-sm font-semibold hover:opacity-95 transition"
              >
                <FiPlus />
                <span className="hidden sm:inline">New</span>
              </button>
            </div>

            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                <FiSearch className="text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full bg-transparent outline-none text-sm text-gray-700"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={autoReplyEnabled}
                  onChange={(e) => setAutoReplyEnabled(e.target.checked)}
                />
                Auto-reply simulation (incoming messages)
              </label>

              {storageError ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  {storageError}
                </div>
              ) : null}
            </div>

            <div className="max-h-[70vh] lg:max-h-[72vh] overflow-y-auto">
              {filteredThreads.length === 0 ? (
                <div className="p-6 text-gray-500 text-sm">No conversations found.</div>
              ) : (
                filteredThreads.map((t) => {
                  const last = t.messages?.[t.messages.length - 1];
                  const isActive = t.id === activeId;

                  const lastPreview =
                    last?.type === "text"
                      ? last.text
                      : last?.type === "file"
                      ? `📎 ${last?.file?.name || "Attachment"}`
                      : last?.type === "mixed"
                      ? `📎 ${last?.file?.name || "Attachment"} — ${last.text || ""}`
                      : "No messages yet";

                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => openThread(t.id)}
                      className={[
                        "w-full text-left px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition",
                        isActive ? "bg-[#ff6a00]/5" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{platformIcon(t.platform)}</span>
                            <p className="font-semibold text-gray-900 truncate">{t.name}</p>
                          </div>

                          <p className="text-sm text-gray-600 truncate mt-1">
                            {lastPreview}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {t.lastMessageAt ? formatDate(t.lastMessageAt) : ""}
                          </p>
                        </div>

                        <div className="shrink-0 flex flex-col items-end gap-2">
                          <p className="text-xs text-gray-400">
                            {t.lastMessageAt ? formatTime(t.lastMessageAt) : ""}
                          </p>

                          {t.unread > 0 ? (
                            <span className="min-w-[24px] h-6 px-2 rounded-full bg-[#ff6a00] text-white text-xs font-bold flex items-center justify-center">
                              {t.unread}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Chat */}
        <div className={`lg:col-span-2 ${mobileView === "chat" ? "block" : "hidden lg:block"}`}>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col min-h-[70vh] lg:min-h-[72vh]">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
                onClick={() => setMobileView("list")}
                title="Back"
              >
                <FiChevronLeft />
              </button>

              {activeThread ? (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                    {platformIcon(activeThread.platform)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{activeThread.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      Platform: {activeThread.platform}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">Select a conversation</p>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-white to-gray-50">
              {!activeThread ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select a conversation to start chatting.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeThread.messages?.map((m) => (
                    <ChatBubble key={m.id} msg={m} />
                  ))}
                  <div ref={endRef} />
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="p-4 border-t border-gray-100">
              {/* Attachment preview */}
              {attachment ? (
                <div className="mb-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-gray-600">{fileKindIcon(attachment.mime)}</span>
                      <span className="truncate">{attachment.name}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(attachment.size / 1024).toFixed(0)} KB • {attachment.mime}
                    </p>

                    {isImageType(attachment.mime) ? (
                      <img
                        src={attachment.dataUrl}
                        alt={attachment.name}
                        className="mt-2 w-40 h-28 object-cover rounded-xl border border-gray-200"
                      />
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={clearAttachment}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition"
                    title="Remove attachment"
                  >
                    <FiX />
                  </button>
                </div>
              ) : null}

              {attachError ? (
                <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {attachError}
                </div>
              ) : null}

              <div className="flex items-center gap-2">
                {/* Attach button */}
                <button
                  type="button"
                  onClick={pickAttachment}
                  disabled={!activeThread}
                  className={[
                    "w-12 h-12 rounded-xl flex items-center justify-center border transition",
                    !activeThread
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                  title="Attach file"
                >
                  <FiPaperclip />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleAttachmentFile}
                  // Accept images, videos, PDFs, and office docs
                  accept="image/*,video/*,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                />

                <input
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={!activeThread}
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!activeThread || (!draftText.trim() && !attachment)}
                  className={[
                    "w-12 h-12 rounded-xl flex items-center justify-center transition",
                    !activeThread || (!draftText.trim() && !attachment)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white hover:opacity-95",
                  ].join(" ")}
                  title="Send"
                >
                  <FiSend />
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Tip: You can send text, an attachment, or both. Attachments are limited for browser storage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ msg }) {
  const mine = msg.from === "brand";

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[90%] sm:max-w-[70%] rounded-2xl px-4 py-3 border",
          mine
            ? "bg-[#ff6a00]/10 border-[#ff6a00]/20 text-gray-900"
            : "bg-white border-gray-200 text-gray-900",
        ].join(" ")}
      >
        {/* Text */}
        {(msg.type === "text" || msg.type === "mixed") && msg.text ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
        ) : null}

        {/* File */}
        {(msg.type === "file" || msg.type === "mixed") && msg.file ? (
          <div className="mt-2">
            <AttachmentView file={msg.file} />
          </div>
        ) : null}

        <p className="text-[11px] text-gray-500 mt-2 text-right">{formatTime(msg.at)}</p>
      </div>
    </div>
  );
}

function AttachmentView({ file }) {
  const name = file?.name || "Attachment";
  const mime = file?.mime || "application/octet-stream";
  const dataUrl = file?.dataUrl || "";

  if (isImageType(mime) && dataUrl) {
    return (
      <a href={dataUrl} target="_blank" rel="noreferrer" className="block">
        <img
          src={dataUrl}
          alt={name}
          className="w-64 max-w-full rounded-xl border border-gray-200 object-cover"
        />
        <p className="mt-2 text-xs text-gray-600 underline underline-offset-2">
          Open image
        </p>
      </a>
    );
  }

  if (isVideoType(mime) && dataUrl) {
    return (
      <div>
        <video
          controls
          src={dataUrl}
          className="w-72 max-w-full rounded-xl border border-gray-200"
        />
        <a
          href={dataUrl}
          download={name}
          className="mt-2 inline-block text-xs text-gray-600 underline underline-offset-2"
        >
          Download video
        </a>
      </div>
    );
  }

  // Documents (pdf/doc/etc.)
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 flex items-center gap-2">
      <span className="text-gray-600">{fileKindIcon(mime)}</span>
      <div className="min-w-0">
        <p className="text-sm text-gray-900 truncate">{name}</p>
        <p className="text-xs text-gray-500 truncate">{mime}</p>
      </div>
      {dataUrl ? (
        <a
          href={dataUrl}
          download={name}
          className="ml-auto text-xs text-gray-700 underline underline-offset-2"
        >
          Download
        </a>
      ) : null}
    </div>
  );
}