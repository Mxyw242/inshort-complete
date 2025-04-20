'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';


type Summary = {
  id: string;
  original_text: string;
  summary: string;
  created_at: string;
};

export default function HistoryPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSummaries = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error getting user:', userError.message);
        setLoading(false);
        return;
      }

      if (!user) {
        console.warn('No user found. Are you logged in?');
        setLoading(false);
        return;
      }

      console.log('Logged in as:', user.id);

      const { data, error } = await supabase
        .from('summaries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching summaries:', error);
        alert('Failed to fetch summaries. Please try again later.');
      } else {
        console.log('Fetched summaries:', data);
        setSummaries(data || []);
      }

      setLoading(false);

    };

    fetchSummaries();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Summaries</h1>
        <button
          onClick={() => router.push('/')}
          className="
            inline-block
            px-6 py-2.5
            bg-pink-400 hover:bg-pink-500
            text-white
            rounded-full
            text-base
            font-medium
            cursor-pointer
            transition-colors duration-200
  "
        >
          Go Back
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : summaries.length === 0 ? (
        <p>ยังไม่มีประวัติการสรุปข้อความ</p>
      ) : (
        summaries.map((summary) => (
          <div key={summary.id} className="mb-4 p-4 bg-white rounded shadow">
            <p><strong>Original:</strong> {summary.original_text}</p>
            <p><strong>Summary:</strong> {summary.summary}</p>
            <p className="text-sm text-gray-500">
              Created at: {new Date(summary.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
