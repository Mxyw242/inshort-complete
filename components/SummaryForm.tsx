'use client';
import { useState, FormEvent, ChangeEvent } from 'react';

interface Props {
  wordLimit?: number;
}

const SummaryForm: React.FC<Props> = ({ wordLimit }) => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (wordLimit && inputText.trim().split(/\s+/).length > wordLimit) {
      alert(`กรุณาใส่ข้อความไม่เกิน ${wordLimit} คำ`);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">เครื่องมือสำหรับสรุปข้อความ</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="textarea"
          value={inputText}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
          placeholder="กรุณาใส่ข้อความที่ต้องการสรุป..."
        />
        <p style={{ textAlign: 'right', fontSize: '0.9rem' }}>
          {wordLimit ? `${inputText.trim().split(/\s+/).length}/${wordLimit}` : `${inputText.trim().split(/\s+/).length} คำ`}
        </p>
        <button disabled={isLoading} className="submit-button">Submit</button>
      </form>
      {summary && (
        <div className="summary-container">
          <h2>สรุป:</h2>
          <p className="summary-text">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default SummaryForm;
