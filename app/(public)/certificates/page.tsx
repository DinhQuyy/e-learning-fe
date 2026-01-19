import Link from 'next/link';
import {
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Star,
  Target,
  Users,
} from 'lucide-react';

type Certificate = {
  id: string;
  title: string;
  course: string;
  issuedOn: string;
  instructor: string;
  score: string;
};

const certificates: Certificate[] = [];

const stats = [
  { label: 'Certificates issued', value: '30,000+', icon: Award },
  { label: 'Active learners', value: '50,000+', icon: Users },
  { label: 'Top course rating', value: '4.8/5', icon: Star },
  { label: 'Expert instructors', value: '500+', icon: GraduationCap },
];

const steps = [
  {
    title: 'Finish a full learning path',
    description:
      'Complete all lessons, quizzes, and capstone projects in your course.',
    icon: BookOpen,
  },
  {
    title: 'Hit the mastery target',
    description:
      'Achieve the required score to unlock a verified certificate.',
    icon: Target,
  },
  {
    title: 'Share your achievement',
    description:
      'Add your certificate to LinkedIn or send it to employers.',
    icon: Award,
  },
];

export default function CertificatesPage() {
  const hasCertificates = certificates.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                <Award className="h-4 w-4" />
                Verified learning achievements
              </span>
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                Certificates that prove your skills
              </h1>
              <p className="text-lg leading-relaxed text-gray-600">
                Complete courses, pass assessments, and earn credentials you
                can share anywhere.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
                >
                  Browse courses
                </Link>
                <Link
                  href="/my-learning"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
                >
                  View my learning
                </Link>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  Secure verification for every certificate.
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  Shareable links with instant validation.
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Certificate of completion
                    </p>
                    <p className="text-xs text-gray-500">
                      LearnHub verified credential
                    </p>
                  </div>
                </div>
                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  Front-End Essentials
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Issued to your account after passing the final project.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Learner
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Your name here
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Issued on
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Mar 2025
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Score
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      97 / 100
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Credential ID
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      LH-2025-0021
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-blue-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified within seconds by employers.
                </div>
              </div>
              <div className="absolute -left-6 bottom-6 h-40 w-40 rounded-full bg-blue-200/50 blur-3xl" />
              <div className="absolute -right-6 top-6 h-40 w-40 rounded-full bg-purple-200/60 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5"
                >
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Your certificate library
              </h2>
              <p className="mt-2 text-gray-600">
                Track every credential you earn in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <button
                type="button"
                className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700"
              >
                All certificates
              </button>
              <button
                type="button"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-600"
              >
                In progress
              </button>
              <button
                type="button"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-600"
              >
                Completed
              </button>
            </div>
          </div>

          {hasCertificates ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                    <span>Issued {certificate.issuedOn}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {certificate.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {certificate.course}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <GraduationCap className="h-4 w-4" />
                    {certificate.instructor}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-500" />
                      Score {certificate.score}
                    </span>
                    <Link
                      href="/wishlist"
                      className="font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      View certificate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-blue-200 bg-white/70 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                No certificates yet
              </h3>
              <p className="mt-2 text-gray-600">
                Finish a course to unlock your first verified certificate.
              </p>
              <Link
                href="/courses"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Start learning
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900">
              How certificates work
            </h2>
            <p className="mt-3 text-gray-600">
              Every credential is tied to your progress and verified learning
              outcomes.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="inline-flex rounded-xl bg-blue-100 p-3 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-10 text-white md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold">
                  Ready to earn your next certificate?
                </h2>
                <p className="mt-3 text-lg text-blue-100">
                  Pick a course, complete the projects, and add a new credential
                  to your profile.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:shadow-lg"
                >
                  Browse courses
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Create free account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
