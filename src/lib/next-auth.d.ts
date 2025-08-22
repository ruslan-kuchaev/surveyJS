import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface User {
		role?: "COORDINATOR" | "RESPONDENT";
	}
	interface Session {
		user: DefaultSession["user"] & {
			id?: string;
			role?: "COORDINATOR" | "RESPONDENT";
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		role?: "COORDINATOR" | "RESPONDENT";
	}
}
