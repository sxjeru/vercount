import { Metadata } from "next";
import { getServerSession, isAuthConfigured } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export const metadata: Metadata = {
	title: "Dashboard | Vercount",
	description: "Manage your website statistics",
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// 如果 auth 未配置，重定向到登录页（会显示未配置提示）
	if (!isAuthConfigured()) {
		redirect("/auth/signin");
	}

	const session = await getServerSession();

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<SidebarProvider defaultOpen={true}>
			<div className="flex h-screen overflow-hidden w-full">
				<DashboardSidebar />
				<div className="flex flex-col flex-1 overflow-auto w-full">
					<div className="flex-1 flex flex-col">
						<SidebarTrigger className="fixed right-4 top-4 z-50 md:hidden p-3 bg-zinc-900 rounded-md" />
						{children}
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
