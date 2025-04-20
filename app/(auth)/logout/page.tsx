'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();
  // setTimeout ให้เปลี่ยนเส้นทาง หลังจากนั้น 2s จะ redirect กลับไป "/"
  useEffect(() => {
    setTimeout(() => router.push("/"), 2000);
  }, []);
  return <div>You have logged out... redirecting in a sec.</div>;
};

export default LogoutPage;