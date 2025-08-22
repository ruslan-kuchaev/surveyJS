"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
	return (
		<button onClick={() => signOut({ callbackUrl: "/" })} className="btn-primary px-3 py-2">Выйти</button>
	);
}
