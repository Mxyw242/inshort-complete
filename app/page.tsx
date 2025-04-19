'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import './styles/styles.css'

export default function HomePage() {
  const [inputText, setInputText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [charLimit, setCharLimit] = useState(1000)

  useEffect(() => {
    // ตรวจสอบสถานะล็อกอิน
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user
      setUser(sessionUser)
      setCharLimit(sessionUser ? Infinity : 1000)
    }
    getSession()

    // subscribe login/logout
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user
      setUser(sessionUser)
      setCharLimit(sessionUser ? Infinity : 1000)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user && inputText.length > 1000) {
      alert('*ข้อความเกิน 1000 คำ* กรุณาล็อกอินเพื่อใช้งานแบบไม่จำกัด')
      return
    }

    setIsLoading(true)
    const response = await fetch('/api/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputText }),
    })
    const data = await response.json()
    setSummary(data.summary)
    setIsLoading(false)
  }

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">เครื่องมือสำหรับสรุปข้อความ</h1>
        <div>
          {user ? (
            <button className="button" onClick={handleLogout}>Logout</button>
          ) : (
            <button className="button" onClick={handleLogin}>Login</button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="กรุณาใส่ข้อความที่ต้องการสรุป..."
        />
        <p className="char-count">{inputText.length}{charLimit !== Infinity ? `/1000` : ''}</p>
        <button className="button" disabled={isLoading}>Submit</button>
      </form>

      {summary && (
        <div className="summary">
          <h2>สรุป:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  )
}