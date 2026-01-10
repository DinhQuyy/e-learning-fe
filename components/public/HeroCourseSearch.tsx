'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

type Suggestion = {
  id: string | number;
  title: string;
  instructor?: string;
};

type HeroCourseSearchProps = {
  placeholder: string;
  buttonLabel: string;
};

export default function HeroCourseSearch({
  placeholder,
  buttonLabel,
}: HeroCourseSearchProps) {
  const router = useRouter();
  const [courseSearch, setCourseSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    const term = courseSearch.trim();
    if (!showSuggestions || !term) {
      setSuggestions([]);
      setIsSuggesting(false);
      return;
    }

    let isActive = true;
    const controller = new AbortController();

    const handler = setTimeout(async () => {
      setIsSuggesting(true);
      try {
        const res = await fetch(
          `/api/courses?search=${encodeURIComponent(term)}&limit=6`,
          { cache: 'no-store', signal: controller.signal }
        );
        const data = await res.json().catch(() => null);
        const items = Array.isArray(data?.courses)
          ? data.courses
          : Array.isArray(data?.data)
            ? data.data
            : [];
        if (!isActive) return;
        const mapped = items
          .map((course: any) => ({
            id: course.id,
            title: course.title ?? course.name ?? '',
            instructor:
              course.teacher_name ?? course.instructor_name ?? course.instructor ?? '',
          }))
          .filter((course: any) => course.title);
        setSuggestions(mapped.slice(0, 6));
      } catch (error) {
        if (!isActive) return;
        setSuggestions([]);
      } finally {
        if (isActive) setIsSuggesting(false);
      }
    }, 250);

    return () => {
      isActive = false;
      clearTimeout(handler);
      controller.abort();
    };
  }, [courseSearch, showSuggestions]);

  const handleCourseSearch = (value?: string) => {
    const term = (value ?? courseSearch).trim();
    const nextUrl = term ? `/courses?search=${encodeURIComponent(term)}` : '/courses';
    router.push(nextUrl);
    setShowSuggestions(false);
  };

  const handleSuggestionSelect = (course: { id: string | number; title: string }) => {
    setCourseSearch(course.title);
    setShowSuggestions(false);
    router.push(`/courses/${course.id}`);
  };

  return (
    <div className="relative">
      <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
      <input
        type="text"
        placeholder={placeholder}
        value={courseSearch}
        onChange={(event) => setCourseSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            handleCourseSearch(event.currentTarget.value);
          }
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 150);
        }}
        className="w-full py-4 pl-12 pr-4 text-lg border-2 border-gray-200 shadow-sm rounded-xl focus:outline-none focus:border-blue-500"
      />
      <button
        type="button"
        onClick={() => handleCourseSearch()}
        className="absolute px-6 py-2 text-white transition-colors -translate-y-1/2 bg-blue-600 rounded-lg right-2 top-1/2 hover:bg-blue-700"
      >
        {buttonLabel}
      </button>
      {showSuggestions && courseSearch.trim() && (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {isSuggesting ? (
            <div className="px-4 py-3 text-sm text-gray-500">Dang tim...</div>
          ) : suggestions.length ? (
            suggestions.map((course) => (
              <button
                key={course.id}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSuggestionSelect(course);
                }}
                className="w-full px-4 py-2 text-left transition-colors hover:bg-gray-50"
              >
                <p className="text-sm font-semibold text-gray-900">{course.title}</p>
                {course.instructor ? (
                  <p className="text-xs text-gray-500">{course.instructor}</p>
                ) : null}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              Khong tim thay khoa hoc
            </div>
          )}
        </div>
      )}
    </div>
  );
}
