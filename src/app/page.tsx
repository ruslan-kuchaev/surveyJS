import Link from "next/link";
import { getSession } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Page() {
	const session = await getSession();
	const userRole = session?.user?.role ?? null;

	return (
		<main className="min-h-dvh p-6">
			<div className="max-w-5xl mx-auto space-y-6">
				<header className="flex items-center justify-between">
					<h1 className="text-3xl font-semibold">Survey</h1>
					<nav className="flex items-center gap-3">
						<Link href="/surveys" className="btn-primary px-3 py-2">Опросы</Link>
						{userRole === "COORDINATOR" && (
							<>
								<Link href="/surveys/new" className="btn-primary px-3 py-2">Создать опрос</Link>
								<Link href="/admin" className="btn-primary px-3 py-2">Админ</Link>
							</>
						)}
						<ThemeToggle />
						{session ? (
							<>
								<span className="text-sm text-[var(--color-text-muted)]">{session.user?.email}</span>
								<SignOutButton />
							</>
						) : (
							<Link href="/login" className="btn-primary px-3 py-2">Войти</Link>
						)}
					</nav>
				</header>

				<section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="card p-6">
						<h2 className="text-xl font-semibold mb-2">Открытые опросы</h2>
						<p className="text-sm text-[var(--color-text-muted)]">Перейдите в раздел &quot;Опросы&quot;</p>
					</div>
					<div className="card p-6">
						<h2 className="text-xl font-semibold mb-2">Закрытые опросы</h2>
						<p className="text-sm text-[var(--color-text-muted)]">Смотрите результаты с графиками</p>
					</div>
					{userRole === "COORDINATOR" && (
						<div className="card p-6">
							<h2 className="text-xl font-semibold mb-2">Админ</h2>
							<p className="text-sm text-[var(--color-text-muted)]">Создавайте и управляйте опросами</p>
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
