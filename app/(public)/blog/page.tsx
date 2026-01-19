import Link from 'next/link';
import { ArrowRight, Calendar, NotebookText, Sparkles, Target } from 'lucide-react';

const highlights = [
  {
    icon: Sparkles,
    title: 'Learning tips',
    description: 'Short, practical guides to build better study habits.',
  },
  {
    icon: NotebookText,
    title: 'Student stories',
    description: 'Real journeys from learners leveling up their skills.',
  },
  {
    icon: Target,
    title: 'Platform updates',
    description: 'New features, releases, and improvements you can use.',
  },
];

const comingSoon = [
  {
    title: 'Build a study routine that sticks',
    tag: 'Learning',
  },
  {
    title: 'From beginner to job ready in 90 days',
    tag: 'Career',
  },
  {
    title: 'Whats new in LearnHub this month',
    tag: 'Updates',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              LearnHub Blog
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Stories, tips, and updates for modern learners
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              The blog is being prepared. In the meantime, explore courses and resources
              tailored for your goals.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
              >
                Explore courses
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/70"
              >
                Visit help center
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">{item.title}</h2>
                  <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Coming soon</h2>
              <p className="mt-2 text-gray-600">
                We are drafting the first posts and will publish them soon.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Calendar className="h-4 w-4" />
              New posts in progress
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {comingSoon.map((post) => (
              <div
                key={post.title}
                className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {post.tag}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{post.title}</h3>
                <p className="mt-2 text-sm text-gray-600">Draft in progress.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
