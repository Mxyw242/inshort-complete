'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.push("/"), 2000); //  setTimeout ให้เปลี่ยนเส้นทาง หลังจากนั้น 2s จะ redirect กลับไป "/"
  }, []);
  return <div>You have logged out... redirecting in a sec.</div>;
};

export default LogoutPage;