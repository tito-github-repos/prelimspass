"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface StudentAuthContextValue {
  isPaidUser: boolean;
  loading: boolean;
}

const StudentAuthContext = createContext<StudentAuthContextValue>({
  isPaidUser: false,
  loading: true,
});

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/students/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsPaidUser(!!data.data.isPaidUser);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch student profile:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <StudentAuthContext.Provider value={{ isPaidUser, loading }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export const useStudentAuth = () => useContext(StudentAuthContext);