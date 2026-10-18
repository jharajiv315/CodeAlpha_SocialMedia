// Toast Notification Management Hook

import { useState, useCallback } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

type ToastListener = (toasts: ToastMessage[]) => void;

let toastsState: ToastMessage[] = [];
const listeners: Set<ToastListener> = new Set();

function emit() {
  listeners.forEach((l) => l([...toastsState]));
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
  const item: ToastMessage = { id, type, message };
  toastsState = [...toastsState, item];
  emit();

  setTimeout(() => {
    toastsState = toastsState.filter((t) => t.id !== id);
    emit();
  }, 4000);
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>(toastsState);

  const subscribe = useCallback(() => {
    const l = (t: ToastMessage[]) => setToasts(t);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return {
    toasts,
    subscribe,
    showToast
  };
}
