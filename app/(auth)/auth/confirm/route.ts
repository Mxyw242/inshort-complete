import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) { //ตรวจสอบ token_hash และ type ที่ได้จาก URL
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) { // เรียก Supabase auth.verifyOtp() เพื่อยืนยัน OTP
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      redirectTo.searchParams.delete('next') // ถ้าสำเร็จ → ไปหน้า next
      return NextResponse.redirect(redirectTo)
    }
  }

  redirectTo.pathname = '/error' // ถ้าล้มเหลว → ไปหน้า error
  return NextResponse.redirect(redirectTo)
}