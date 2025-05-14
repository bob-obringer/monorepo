import React, { useEffect, useState } from "react";

export function FadeIn({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Trigger after mount
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div
      className={`transition-all duration-[2000ms] ease-in-out ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
    >
      {children}
    </div>
  );
}
