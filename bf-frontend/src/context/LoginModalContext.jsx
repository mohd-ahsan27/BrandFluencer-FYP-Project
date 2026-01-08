import React, { createContext, useContext, useMemo, useState } from "react";

const LoginModalContext = createContext(null);

/**
 * mode: "login" | "signup"
 */
export function LoginModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login");

  const value = useMemo(
    () => ({
      open,
      mode,
      openLogin: () => {
        setMode("login");
        setOpen(true);
      },
      openSignup: () => {
        setMode("signup");
        setOpen(true);
      },
      closeModal: () => setOpen(false),
    }),
    [open, mode]
  );

  return (
    <LoginModalContext.Provider value={value}>
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) {
    throw new Error("useLoginModal must be used inside <LoginModalProvider>");
  }
  return ctx;
}