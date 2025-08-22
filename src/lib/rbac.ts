import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function requireCoordinator() {
	const session = await getServerSession(authOptions);
	if (!session || session.user?.role !== "COORDINATOR") {
		throw new Error("FORBIDDEN");
	}
	return session;
}

export async function getOptionalUser() {
	const session = await getServerSession(authOptions);
	return session?.user;
}
