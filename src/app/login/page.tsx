"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(useGSAP, TextPlugin);

const schema = z.object({
  email: z.email("Некорректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

type FormValues = z.infer<typeof schema>;

type Providers = Record<string, { id: string; name: string } | undefined>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Providers>({});
  const { 
    register, 
    handleSubmit, 
    formState: { isSubmitting, errors } 
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "coordinator@example.com", password: "password123" },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | HTMLButtonElement)[]>([]);

  
  useGSAP(() => {
    if (!containerRef.current) return;

   
    gsap.set([titleRef.current, subtitleRef.current, formRef.current, '.social-section', '.home-link'], {
      opacity: 0,
      y: 20
    });

    
    const tl = gsap.timeline({ defaults: { ease: "back.out(1.7)", duration: 0.8 } });
    
    tl.fromTo(containerRef.current, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
    )
    .to(titleRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.2)
    .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.4)
    .to(formRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.6)
    .to('.social-section', { opacity: 1, y: 0, duration: 0.7 }, 0.8)
    .to('.home-link', { opacity: 1, y: 0, duration: 0.7 }, 1.0);

  }, { scope: containerRef });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/providers");
        if (res.ok) {
          const data = await res.json();
          setProviders(data || {});
        }
      } catch { }
    })();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const res = await signIn("credentials", { 
      ...values, 
      redirect: false,
      callbackUrl: "/" 
    });
    
    if (res?.error) {
      setError("Неверные учетные данные");
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  const hasGitHub = Boolean(providers?.github);

  // Функция для добавления ссылок в ref
  const addToLinksRef = (el: HTMLAnchorElement | HTMLButtonElement | null) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div 
        ref={containerRef}
        className="glass-effect w-full max-w-md p-8 rounded-2xl shadow-xl backdrop-blur-lg border border-white/20"
      >
        <div className="text-center mb-8">
          <h1 ref={titleRef} className="text-3xl font-bold text-gray-800 mb-2">Добро пожаловать</h1>
          <p ref={subtitleRef} className="text-gray-600">Используйте демо-аккаунты из сида</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              {...register("email")} 
              className="glass-input"
              placeholder="you@example.com" 
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <input 
              type="password" 
              {...register("password")} 
              className="glass-input"
              placeholder="••••••••" 
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium transition-all hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Входим...
              </span>
            ) : "Войти"}
          </button>
        </form>
        

          <div className="social-section mt-6">
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-500">Или войдите с помощью</span>
              </div>
            </div>
            
            <button 
              ref={addToLinksRef}
              onClick={() => signIn("github", { callbackUrl: "/" })} 
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 text-white rounded-lg font-medium transition-all hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-md"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Войти через GitHub
            </button>
          </div>

        
        <div className="home-link mt-6 text-center">
          <Link 
            ref={addToLinksRef}
            href="/" 
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}