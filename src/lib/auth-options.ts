import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb"; // must import before User so bufferCommands:false is set first
import User from "@/models/User";
import { persistentStorage } from "@/lib/persistentStorage";
import bcrypt from "bcryptjs";

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
            if (!user.password) {
              throw new Error("Please sign in with the provider you used to register");
            }
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) throw new Error("Invalid email or password");

            console.log("✅ MongoDB login successful:", user.email);
            return {
              id: user._id.toString(),
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

          // ── MongoDB unavailable → fall back to persistentStorage ──────────
          console.log("⚠️ MongoDB unavailable, trying persistent storage:", dbError.message);
          try {
            const storedUser = persistentStorage.getUser(emailLower);
            if (!storedUser) throw new Error("Invalid email or password");

            const isValid = await bcrypt.compare(credentials.password, storedUser.password);
            if (!isValid) throw new Error("Invalid email or password");

            console.log("✅ Persistent storage login successful:", emailLower);
            return {
              id: emailLower,
              email: emailLower,
              name: storedUser.name || emailLower,
              image: "",
              role: "user",
            };
          } catch (fallbackError: any) {
            throw new Error(fallbackError.message || "Invalid email or password");
          }
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
      
      // Save user to database in background (non-blocking)
      setImmediate(async () => {
        try {
          // Try MongoDB first
          await connectDB();
          let existingUser = await User.findOne({ email: userEmail });
          
          if (!existingUser) {
            await User.create({
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
          }
        } catch (dbError: any) {
          console.log("⚠️ MongoDB unavailable, using persistent storage");
          
          // Fallback to persistent storage
          if (!persistentStorage.hasUser(userEmail)) {
            persistentStorage.addUser(userEmail, {
              email: userEmail,
              password: '', // OAuth users don't have password
              name: userName,
              createdAt: new Date().toISOString()
            });
            console.log("💾 User saved to persistent storage:", userEmail);
          } else {
            console.log("✅ User already exists in persistent storage");
          }
        }
      });
      
      // Continue sign-in immediately (don't wait for database)
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Handle Google OAuth callback redirect
      console.log('🔄 Redirect callback:', { url, baseUrl });
      
      // After successful Google sign-in, always go to home page
      if (url.includes('/api/auth/callback/google')) {
        console.log('✅ Redirecting to home page after Google sign-in');
        return `${baseUrl}/`;
      }
      
      // Handle other auth callbacks
      if (url.includes('/api/auth/callback')) {
        return `${baseUrl}/`;
      }
      
      // Handle relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Handle same-origin URLs
      if (new URL(url).origin === baseUrl) return url;
      
      // Default to home page
      return `${baseUrl}/`;
    },
    async jwt({ token, user, account }) {
      if (user && user.email) {
        // Skip MongoDB - set default values instantly
        token.role = "user";
        token.id = user.email;
        console.log("🎫 JWT token created instantly for:", user.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "user" | "admin";
        session.user.id = token.id as string;
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
