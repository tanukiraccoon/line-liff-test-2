"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LIFFContext = createContext({
  liff: null,
  liffError: null,
});

function LIFFProvider({ children }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);

  useEffect(() => {
    const initLIFF = async () => {
      try {
        console.log("LIFF init...");

        const liffModule = await import("@line/liff");
        const liff = liffModule.default;

        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) {
          throw new Error("NEXT_PUBLIC_LIFF_ID is not defined.");
        }

        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login();
          return; // login แล้ว redirect ออกทันที
        }

        console.log("LIFF init succeeded.");
        setLiffObject(liff);

      } catch (error) {
        console.log("LIFF init failed.");
        setLiffError(error?.toString() || "Unknown error");
      }
    };

    initLIFF();
  }, []);

  const value = {
    liff: liffObject,
    liffError: liffError,
  };

  return (
    <LIFFContext.Provider value={value}>
      {children}
    </LIFFContext.Provider>
  );
}

function useLIFF() {
  const context = useContext(LIFFContext);

  if (!context) {
    throw new Error("useLIFF must be used within a LIFFProvider");
  }

  return context;
}

export { LIFFProvider, useLIFF };