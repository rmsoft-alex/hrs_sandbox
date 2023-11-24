import MainLayout from "@/components/common/layout/main";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex justify-center">
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
