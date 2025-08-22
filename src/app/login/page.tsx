"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

type Providers = Record<string, { id: string; name: string } | undefined>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Providers>({});
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "coordinator@example.com", password: "password123" },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/providers");
        if (res.ok) {
          const data = await res.json();
          setProviders(data || {});
        }
      } catch {}
    })();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const res = await signIn("credentials", { ...values, redirect: true, callbackUrl: "/" });
    if (res?.error) setError("Неверные учетные данные");
  };

  const hasGitHub = Boolean(providers?.github);
  const hasGoogle = Boolean(providers?.google);

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-6 fade-in">
        <h1 className="text-2xl font-semibold mb-2">Войти</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">Используйте демо-аккаунты из сида</p>
        {error && (
          <div className="mb-4 text-sm text-white rounded-md bg-[var(--color-error)]/90 px-3 py-2">{error}</div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-[var(--color-text-muted)]">Email</label>
            <input {...register("email")} className="input w-full px-3 py-2" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[var(--color-text-muted)]">Пароль</label>
            <input type="password" {...register("password")} className="input w-full px-3 py-2" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary w-full h-10">{isSubmitting ? "Входим..." : "Войти"}</button>
        </form>
        {(hasGoogle || hasGitHub) && (
          <div className="mt-4 grid grid-cols-1 gap-2">
            {hasGoogle && (
              <button onClick={() => signIn("google", { callbackUrl: "/" })} className="btn-primary w-full h-10">Войти через Google</button>
            )}
            {hasGitHub && (
              <button onClick={() => signIn("github", { callbackUrl: "/" })} className="btn-primary w-full h-10">Войти через GitHub</button>
            )}
          </div>
        )}
        <div className="mt-4 text-center text-sm">
          <Link href="/" className="text-[var(--color-primary)] hover:underline">На главную</Link>
        </div>
      </div>
    </div>
  );
}


