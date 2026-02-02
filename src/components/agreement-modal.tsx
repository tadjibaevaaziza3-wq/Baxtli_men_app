"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";

interface AgreementModalProps {
    onAccept: () => void;
    isOpen: boolean;
}

export function AgreementModal({ onAccept, isOpen }: AgreementModalProps) {
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/user/accept-agreement", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ version: "1.0" }),
            });
            if (res.ok) {
                onAccept();
            }
        } catch (err) {
            console.error("Failed to accept agreement:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a2f1e]/95 backdrop-blur-xl p-6"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-full max-w-sm bg-[#0d3d27] border border-[#c9a86a]/30 rounded-3xl p-8 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a86a]/5 rounded-full -translate-y-16 translate-x-16" />

                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-[#c9a86a]/10 flex items-center justify-center mb-6">
                                <Shield className="w-8 h-8 text-[#c9a86a]" />
                            </div>

                            <h2 className="text-2xl font-bold text-[#c9a86a] mb-4">Фойдаланиш шартлари</h2>

                            <div className="text-sm text-gray-300 space-y-4 mb-8 text-left max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                <p>
                                    Baxtli Men платформасига хуш келибсиз! Давом этишдан олдин қуйидаги муҳим шартларни қабул қилишингиз керак:
                                </p>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-[#c9a86a] mt-1 shrink-0" />
                                    <span>Курс материаллари фақат шахсий фойдаланиш учун. Уларни тарқатиш ёки сотиш қатъиян тақиқланади.</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-[#c9a86a] mt-1 shrink-0" />
                                    <span>Видеоларни ёзиб олишга уриниш аккаунтнинг блок қилинишига олиб келади.</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-[#c9a86a] mt-1 shrink-0" />
                                    <span>Сиз ўз соғлиғингиз ҳолати учун масъулсиз. Машқларни эҳтиёткорлик билан бажаринг.</span>
                                </div>
                                <p className="italic text-xs text-gray-400 mt-4">
                                    "Қабул қиламан" тугмасини босиш орқали сиз оммавий оферта шартларига розилик билдирасиз.
                                </p>
                            </div>

                            <button
                                onClick={handleAccept}
                                disabled={loading}
                                className="w-full bg-[#c9a86a] text-[#0a2f1e] py-4 rounded-xl font-bold text-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? "Юкланмоқда..." : "Қабул қиламан"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
