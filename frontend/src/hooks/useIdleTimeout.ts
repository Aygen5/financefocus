import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/features/auth/authSlice";
import toast from "react-hot-toast";

const IDLE_TIMEOUT_MS = 20 * 60 * 1000;
const THROTTLE_MS = 1000;

export const useIdleTimeout = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isAuthenticated) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        dispatch(logout());
        toast.error(
          "Oturumunuz güvenlik nedeniyle zaman aşımına uğradı. Lütfen tekrar giriş yapın.",
        );
      }, IDLE_TIMEOUT_MS);
    };

    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current >= THROTTLE_MS) {
        lastActivityRef.current = now;
        resetTimer();
      }
    };

    const events = ["mousemove", "click", "keydown", "scroll", "touchstart"];

    resetTimer();

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isAuthenticated, dispatch]);
};
