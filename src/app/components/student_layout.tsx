"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import StudentDashboardLayout from "../student-pages/StudentDashboardLayout";
import StudentHeader from "./StudentHeader";
import NavigationWarningModal from "./NavigationWarningModal";
import LiveExamWarningModal from "./LiveExamWarningModal";

interface StudentLayoutProps {
  readonly children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [showLiveWarning, setShowLiveWarning] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const isExamPage = pathname.startsWith('/student-pages/exam_taking') || pathname.startsWith('/student-pages/exam_res_rev');
  const shouldShowHeader = !isExamPage;

  const handleShowNavigationWarning = (route: string) => {
    setPendingRoute(route);
    const urlParams = new URLSearchParams(window.location.search);
    const attemptId = urlParams.get('attemptId');
    const violationKey = attemptId ? `violation_${attemptId}` : null;
    const currentViolations = violationKey ? parseInt(sessionStorage.getItem(violationKey) || '0', 10) : 0;

    if (currentViolations > 0) {
      sessionStorage.setItem('autoSubmit', 'true');
    } else {
      setShowNavigationWarning(true);
    }
  };

  const handleConfirmNavigation = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const attemptId = urlParams.get('attemptId');
    const violationKey = attemptId ? `violation_${attemptId}` : null;
    if (violationKey) {
      const current = parseInt(sessionStorage.getItem(violationKey) || '0', 10);
      sessionStorage.setItem(violationKey, (current + 1).toString());
    }
    if (pendingRoute) {
      router.push(pendingRoute);
      setPendingRoute(null);
    }
    setShowNavigationWarning(false);
  };

  const handleCancelNavigation = () => {
    setShowNavigationWarning(false);
    setPendingRoute(null);
  };

  return (
    <>
      <StudentDashboardLayout>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
          {shouldShowHeader && (
            <StudentHeader onShowNavigationWarning={handleShowNavigationWarning} />
          )}
          <Box
            sx={{
              width: '100%',
              minHeight: '100vh',
              paddingLeft: isExamPage ? 0 : '20px',
              paddingRight: isExamPage ? 0 : '20px',
              paddingTop: isExamPage ? 0 : { xs: '76px', md: '84px' },
              overflowX: isExamPage ? 'hidden' : 'auto',
            }}
          >
            {children}
          </Box>
        </Box>
      </StudentDashboardLayout>
      <NavigationWarningModal
        open={showNavigationWarning}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />
      <LiveExamWarningModal open={showLiveWarning} violationCount={0} onClose={() => setShowLiveWarning(false)} />
    </>
  );
}