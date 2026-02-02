"use client";

import { ReactNode } from "react";
import "../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function WebLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      {children}
    </div>
  );
}
