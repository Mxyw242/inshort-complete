'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function HistoryPage() {
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    const fetchSummaries = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('summaries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching summaries:', error);
        } else {
          setSummaries(data);
        }
      }
    };

    fetchSummaries();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Summaries</h1>
      {summaries.map((summary) => (
        <div key={summary.id} className="mb-4 p-4 bg-white rounded shadow">
          <p><strong>Original:</strong> {summary.original_text}</p>
          <p><strong>Summary:</strong> {summary.summary}</p>
          <p className="text-sm text-gray-500">
            Created at: {new Date(summary.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
