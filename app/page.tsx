import Sidebar from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 flex items-center justify-center h-screen bg-slate-100">

        <Card className="p-6 w-[350px]">
          <CardContent>

            <div className="flex justify-end mb-4">
              <ThemeToggle />
            </div>

            <h1 className="text-2xl font-bold">
              RBAC Dashboard
            </h1>

          </CardContent>
        </Card>

      </div>

    </div>
  )
}