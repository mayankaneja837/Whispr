import { Toaster } from "../../components/ui/sonner"
import NavBar from "../../components/Navbar"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster richColors />
      <NavBar />
      {children}
    </>
  )
}
