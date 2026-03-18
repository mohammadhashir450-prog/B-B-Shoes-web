import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb"; // must import before User so bufferCommands:false is set first
import User from "@/models/User";
import bcrypt from "bcryptjs";

async function generateUniqueUserId(): Promise<string> {
  let nextId = `USR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  while (await User.findOne({ user_id: nextId }).select('_id')) {
    nextId = `USR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
  return nextId;
}

function fallbackUserId(email?: string | null): string {
  const seed = String(email || "guest")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 20) || "guest";
  return `USR-G-${seed}`;
}

export const authOptions: NextAuthOptions = {
  // ❌ Don't use MongoDBAdapter - it fails when MongoDB is down
  // We handle user creation manually in callbacks instead
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", // Force account selection every time
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔑 Credentials login attempt:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        const emailLower = credentials.email.toLowerCase();

        // ── Try MongoDB first ──────────────────────────────────────────────
        try {
          await connectDB();
          console.log("✅ MongoDB connected for login");

          const user = await User.findOne({ email: emailLower }).select('+password');
          console.log("📧 MongoDB user lookup:", user ? "Found" : "Not found");

          if (user) {
            if (!user.user_id) {
              user.user_id = await generateUniqueUserId();
              await user.save();
            }
            if (!user.password) {
              throw new Error("Please sign in with the provider you used to register");
            }
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) throw new Error("Invalid email or password");

            console.log("✅ MongoDB login successful:", user.email);
            return {
              id: user._id.toString(),
              user_id: user.user_id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role || 'user',
            };
          }
          // User not found in MongoDB — fall through to persistentStorage check
          throw new Error("Invalid email or password");

        } catch (dbError: any) {
          // If it's a business-logic error (wrong password / not found), rethrow immediately
          if (dbError.message === "Invalid email or password" ||
              dbError.message === "Please sign in with the provider you used to register") {
            throw dbError;
          }

          // MongoDB-only auth: do not use users.json fallback.
          console.log("❌ MongoDB unavailable for credentials login:", dbError.message);
          throw new Error("Authentication service unavailable. Please try again.");
        }
      }
    }),
  ],
  session: {
    strategy: "jwt", // ✅ JWT works without database
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.log("❌ Sign in failed: No email provided");
        return false;
      }
      
      const userEmail = user.email; // Store for use in callback
      const userName = user.name || profile?.name || "User";
      const userImage = user.image || (profile as any)?.picture || "";
      
      console.log("✅ Google Sign-In successful:", userEmail);
      
      // Persist/ensure user synchronously so user_id exists in User documents.
      try {
        await connectDB();
        let existingUser = await User.findOne({ email: userEmail });

        if (!existingUser) {
          const generatedUserId = await generateUniqueUserId();
          existingUser = await User.create({
            user_id: generatedUserId,
            name: userName,
            email: userEmail,
            image: userImage,
            role: "user",
            isAdmin: false,
            provider: "google",
            wishlist: [],
            cart: [],
          });
          console.log("💾 User saved to MongoDB:", userEmail);
        } else if (!existingUser.user_id) {
          existingUser.user_id = await generateUniqueUserId();
          await existingUser.save();
        }
      } catch (dbError: any) {
        console.log("❌ MongoDB unavailable during Google sign-in:", dbError.message || dbError);
        // Do not block OAuth success when DB write fails in production.
        // JWT/session callbacks already have safe fallbacks for id/user_id.
        return true;
      }
      
      // Continue sign-in immediately (don't wait for database)
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Enforce a single deterministic post-auth destination.
      // This prevents users from getting stuck on /login or /register after OAuth.
      console.log('🔄 Redirect callback forced to home:', { url, baseUrl });
      return '/';
    },
    async jwt({ token, user, account }) {
      if (user && user.email) {
        token.role = (user.role as "user" | "admin") || "user";

        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email }).select('_id user_id role');
          if (dbUser) {
            if (!dbUser.user_id) {
              dbUser.user_id = await generateUniqueUserId();
              await dbUser.save();
            }
            token.id = dbUser._id.toString();
            token.user_id = dbUser.user_id;
            token.role = (dbUser.role as "user" | "admin") || "user";
          } else {
            token.id = (user.id as string) || String(user.email);
            token.user_id = (user.user_id as string) || (token.user_id as string) || fallbackUserId(user.email);
          }
        } catch {
          token.id = (user.id as string) || String(user.email);
          token.user_id = (user.user_id as string) || (token.user_id as string) || fallbackUserId(user.email);
        }

        console.log("🎫 JWT token created for:", user.email, "id:", token.id, "user_id:", token.user_id);
      }

      // Handle existing sessions where token was created before user_id was added.
      if ((!token.user_id || !token.id) && token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email }).select('_id user_id role');
          if (dbUser) {
            if (!dbUser.user_id) {
              dbUser.user_id = await generateUniqueUserId();
              await dbUser.save();
            }
            token.id = dbUser._id.toString();
            token.user_id = dbUser.user_id;
            token.role = (dbUser.role as "user" | "admin") || (token.role as "user" | "admin") || "user";
          }
        } catch {
          // Keep existing token values on DB failure.
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "user" | "admin";
        session.user.id = token.id as string;
        session.user.user_id = (token.user_id as string) || fallbackUserId(session.user.email);
        console.log("✅ Session created for:", session.user.email, "Role:", session.user.role);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
