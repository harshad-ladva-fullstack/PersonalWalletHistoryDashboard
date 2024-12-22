"use client";

import Loading from "@/components/common/Loading";
import { usePathname, useRouter } from "next/navigation"; // Changed from next/router

import { useEffect } from "react";

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") {
      router.push("/dashboard");
    }
  }, [pathname, router]);

  return <Loading />;
}
