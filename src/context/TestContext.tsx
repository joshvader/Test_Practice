'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Practicante, TestRespuesta } from '@/types/test';
import { type QuestionBankId, DEFAULT_BANK_ID, getTestData, resolveBankId } from '@/lib/questions';

interface TestContextType {
  practicante: Practicante | null;
  setPracticante: (practicante: Practicante) => void;
  bankId: QuestionBankId;
  setBankId: (bankId: QuestionBankId) => void;
  respuestas: TestRespuesta;
  setRespuesta: (sectionId: string, questionId: string, value: string) => void;
  startTime: number | null;
  startTest: () => void;
  resetTest: () => void;
}

const buildEmptyRespuestas = (bankId: QuestionBankId): TestRespuesta => {
  const sections = getTestData(bankId);
  return Object.fromEntries(sections.map((s) => [s.id, {}])) as TestRespuesta;
};

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [practicante, setPracticanteState] = useState<Practicante | null>(null);
  const [bankId, setBankIdState] = useState<QuestionBankId>(DEFAULT_BANK_ID);
  const [respuestas, setRespuestasState] = useState<TestRespuesta>(() => buildEmptyRespuestas(DEFAULT_BANK_ID));
  const [startTime, setStartTimeState] = useState<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBankId = localStorage.getItem('test_bankId');
    const savedPracticante = localStorage.getItem('test_practicante');
    const savedRespuestas = localStorage.getItem('test_respuestas');
    const savedStartTime = localStorage.getItem('test_startTime');

    if (savedBankId) setBankIdState(resolveBankId(savedBankId));
    if (savedPracticante) setPracticanteState(JSON.parse(savedPracticante));
    if (savedRespuestas) setRespuestasState(JSON.parse(savedRespuestas));
    if (savedStartTime) setStartTimeState(parseInt(savedStartTime, 10));
  }, []);

  const setPracticante = (p: Practicante) => {
    setPracticanteState(p);
    localStorage.setItem('test_practicante', JSON.stringify(p));
  };

  const setBankId = (id: QuestionBankId) => {
    const resolved = resolveBankId(id);
    setBankIdState(resolved);
    localStorage.setItem('test_bankId', resolved);
    setRespuestasState(buildEmptyRespuestas(resolved));
    localStorage.setItem('test_respuestas', JSON.stringify(buildEmptyRespuestas(resolved)));
  };

  const setRespuesta = (sectionId: string, questionId: string, value: string) => {
    setRespuestasState((prev) => {
      const newRespuestas = {
        ...prev,
        [sectionId]: {
          ...(prev[sectionId] || {}),
          [questionId]: value,
        },
      };
      localStorage.setItem('test_respuestas', JSON.stringify(newRespuestas));
      return newRespuestas;
    });
  };

  const startTest = () => {
    const now = Date.now();
    setStartTimeState(now);
    localStorage.setItem('test_startTime', now.toString());
  };

  const resetTest = () => {
    setPracticanteState(null);
    setRespuestasState(buildEmptyRespuestas(bankId));
    setStartTimeState(null);
    localStorage.removeItem('test_practicante');
    localStorage.removeItem('test_respuestas');
    localStorage.removeItem('test_startTime');
  };

  return (
    <TestContext.Provider
      value={{
        practicante,
        setPracticante,
        bankId,
        setBankId,
        respuestas,
        setRespuesta,
        startTime,
        startTest,
        resetTest,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};
