import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      user_id: string;
      role: "user" | "admin";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "user" | "admin";
    user_id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: "user" | "admin";
    id: string;
    user_id?: string;
  }
}
