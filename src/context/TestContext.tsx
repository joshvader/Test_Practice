'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Practicante, TestRespuesta } from '@/types/test';

interface TestContextType {
  practicante: Practicante | null;
  setPracticante: (practicante: Practicante) => void;
  respuestas: TestRespuesta;
  setRespuesta: (section: keyof TestRespuesta, questionId: string, value: string) => void;
  startTime: number | null;
  startTest: () => void;
  resetTest: () => void;
}

const initialRespuestas: TestRespuesta = {
  seccion_1: {},
  seccion_2: {},
  seccion_3: {},
};

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [practicante, setPracticanteState] = useState<Practicante | null>(null);
  const [respuestas, setRespuestasState] = useState<TestRespuesta>(initialRespuestas);
  const [startTime, setStartTimeState] = useState<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPracticante = localStorage.getItem('test_practicante');
    const savedRespuestas = localStorage.getItem('test_respuestas');
    const savedStartTime = localStorage.getItem('test_startTime');

    if (savedPracticante) setPracticanteState(JSON.parse(savedPracticante));
    if (savedRespuestas) setRespuestasState(JSON.parse(savedRespuestas));
    if (savedStartTime) setStartTimeState(parseInt(savedStartTime, 10));
  }, []);

  const setPracticante = (p: Practicante) => {
    setPracticanteState(p);
    localStorage.setItem('test_practicante', JSON.stringify(p));
  };

  const setRespuesta = (section: keyof TestRespuesta, questionId: string, value: string) => {
    setRespuestasState((prev) => {
      const newRespuestas = {
        ...prev,
        [section]: {
          ...prev[section],
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
    setRespuestasState(initialRespuestas);
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
