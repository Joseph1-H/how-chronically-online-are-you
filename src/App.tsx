import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Landing from './pages/Landing';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import { FEATURED_QUIZ_SLUG } from './data/quizzes';

/** Scroll to top on every route change (snappy on mobile). */
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <div className="relative min-h-[100dvh]">
      <div className="bg-paper" aria-hidden="true" />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz/:slug" element={<Quiz />} />
        <Route path="/quiz/:slug/result" element={<Result />} />
        {/* Convenience + legacy fallbacks. */}
        <Route path="/quiz" element={<Navigate to={`/quiz/${FEATURED_QUIZ_SLUG}`} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </div>
  );
}
