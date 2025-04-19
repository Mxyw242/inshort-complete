'use client';
import { useState } from 'react';
import './styles/styles.css';
import LoginStatus from '@/components/LoginStatus';
import SummaryForm from '@/components/SummaryForm';

export default function HomePage() {
  const [mode, setMode] = useState<'guest' | 'limited' | 'unlimited'>('guest');

  return (
    <main className="min-h-screen p-4">
      <LoginStatus onStatusChange={setMode} />
      {mode === 'guest' && <p style={{ textAlign: 'center' }}>กรุณาล็อกอินเพื่อใช้บริการสรุปข้อความ</p>}
      {mode === 'limited' && <SummaryForm wordLimit={500} />}
      {mode === 'unlimited' && <SummaryForm />}
    </main>
  );
}