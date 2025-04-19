'use client';
import { useEffect, useState } from 'react';

export default function LoginStatus({ onStatusChange }: { onStatusChange: (status: 'guest' | 'limited' | 'unlimited') => void }) {
  const [status, setStatus] = useState<'guest' | 'limited' | 'unlimited'>('guest');

  useEffect(() => {
    // จำลองการตรวจสอบ session (คุณอาจใช้ Supabase auth จริงแทน)
    const isLoggedIn = true;
    const hasPremium = false;

    if (isLoggedIn) {
      setStatus(hasPremium ? 'unlimited' : 'limited');
    } else {
      setStatus('guest');
    }
    onStatusChange(status);
  }, [status, onStatusChange]);

  return (
    <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
      {status === 'guest' ? (
        <button className="submit-button">Login</button>
      ) : (
        <button className="submit-button">Logout</button>
      )}
    </div>
  );
}
