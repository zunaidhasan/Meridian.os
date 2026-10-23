"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Icon } from "./ui";

type Tone = "success" | "error" | "info";

interface ToastItem {
  id: number;
  msg: string;
  tone: Tone;
}

const ToastCtx = createContext<{
  toast: (msg: string, tone?: Tone) => void;
}>({ toast: () => {} });

export const useToast = () => useContext(ToastCtx);

const TONE: Record<Tone, { cls: string; icon: "check" | "x" | "spark" }> = {
  success: { cls: "bg-moss-soft text-moss-deep", icon: "check" },
  error: { cls: "bg-danger-soft text-danger-deep", icon: "x" },
  info: { cls: "bg-gold-soft text-gold-deep", icon: "spark" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((msg: string, tone: Tone = "success") => {
    const id = ++idRef.current;
    setItems((p) => [...p.slice(-3), { id, msg, tone }]);
    setTimeout(() => setItems((p) => p.filter((i) => i.id !== id)), 3800);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(340px,calc(100vw-40px))] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="card animate-toast pointer-events-auto flex items-start gap-3 px-4 py-3 shadow-lg"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${TONE[t.tone].cls}`}
            >
              <Icon name={TONE[t.tone].icon} className="h-3 w-3" />
            </span>
            <p className="text-sm font-medium leading-snug text-ink">{t.msg}</p>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
