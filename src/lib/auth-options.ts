import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
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
          console.log("❌ Missing credentials");
          throw new Error("Please provide email and password");
        }

        try {
          // Connect to MongoDB
          await connectDB();
          console.log("✅ MongoDB connected for login");

          // Find user by email (include password field)
          const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');
          console.log("📧 User lookup result:", user ? "Found" : "Not found");

          if (!user) {
            console.log("❌ No user found with email:", credentials.email);
            throw new Error("Invalid email or password");
          }

          if (!user.password) {
            console.log("❌ User has no password (OAuth user?)");
            throw new Error("Please sign in with the provider you used to register");
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log("🔐 Password validation:", isPasswordValid ? "Valid" : "Invalid");

          if (!isPasswordValid) {
            console.log("❌ Invalid password for:", credentials.email);
            throw new Error("Invalid email or password");
          }

          console.log("✅ Login successful for:", user.email);

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role || 'user',
          };
        } catch (error: any) {
          console.error("❌ Credentials login error:", error.message);
          throw new Error(error.message || "Invalid email or password");
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
