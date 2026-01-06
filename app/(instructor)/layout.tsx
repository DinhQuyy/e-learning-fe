import InstructorNavbar from '@/components/instructor/InstructorNavbar';
import Footer from '@/components/public/Footer';

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <InstructorNavbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}