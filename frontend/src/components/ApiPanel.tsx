import ShadowDOM from "react-shadow";
import { Box, Typography } from "@mui/material";
import { ApiDefinition } from "@/config/api";
import { useEffect, useRef } from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

interface ApiPanelProps {
  api: ApiDefinition;
  messages: string[];
}

export default function ApiPanel({ api, messages }: ApiPanelProps) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const searchText = useSelector((state: RootState) => state.chat.searchText);
  const matchRef = useRef<HTMLDivElement | null>(null);
  let firstMatch: HTMLDivElement | null = null;

  useEffect(() => {
    matchRef.current = null;
  }, [messages]);

  useEffect(() => {
    const hasMatch = searchText
      ? messages.some((msg) =>
          msg.toLowerCase().includes(searchText.toLowerCase())
        )
      : false;
    if (!messagesRef.current) return;
    const container = messagesRef.current;
    if (searchText && hasMatch) {
      // Scroll to match
      const el = matchRef.current;
      if (el) {
        const targetTop = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2 - 90;
        container.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      }
    } else {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    
  }, [messages, searchText]);

  return (
    <ShadowDOM.div data-testid={`api-panel-${api.id}`}>
      <style>{`
        .panel {
          display: flex;
          flex-direction: column;
          padding: 4px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: lavender;
          box-shadow: 0 0 8px rgb(0 0 0 / 0.1);
          height: 250px;
          opacity: 1;
          box-sizing: border-box;
        }
        .title {
          font-weight: bold;
          margin-bottom: 0 0 8px 0;
          font-family: 'Inter', sans-serif;
          line-height: 1.2;
          display: flex;
          align-items: center;
          height: 28px;
          flex-shrink: 0;
        }
        .messages {
          overflow-y: auto;
          overflow-x: hidden;
          white-space: pre-wrap;
          word-break: break-word;
          flex-grow: 1;
          padding-right: 4px;
        }
        .messages::-webkit-scrollbar {
          width: 8px;
        }
        .messages::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.3);
          border-radius: 4px;
        }
        mark {
          background-color: yellow;
          padding: 0;
        }
      `}</style>

      <Box className="panel" sx={{ width: "100%" }}>
        <Typography variant="h3" className="title">{api.name}</Typography>
        <Box className="messages" ref={messagesRef}>
          {messages.map((msg, idx) => {
            const hasMatch = searchText && msg.toLowerCase().includes(searchText.toLowerCase());
            const parts = searchText ? msg.split(new RegExp(`(${(searchText)})`, "gi")) : [msg];

            return (
              <Typography
                key={idx}
                variant="body2"
                component="div"
                sx={{ lineHeight: 1.2, margin: 0 }}
                ref={(el) => {
                  if (hasMatch && !firstMatch && el) {
                    firstMatch = el;
                    matchRef.current = el;
                  }
                }}
              >
                {parts.map((part, i) =>
                  searchText && part.toLowerCase() === searchText.toLowerCase() ? (
                    <mark key={i}>{part}</mark>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </Typography>
            );
          })}
        </Box>
      </Box>
    </ShadowDOM.div>
  );
}
