/**
 * Fallback In-Memory Storage
 * Used when MongoDB is unavailable
 * Shared across all API routes
 */

interface FallbackUser {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

// Use a simple in-memory Map that persists in Node.js process
// This will survive across Next.js hot reloads in development
class FallbackStorage {
  private static instance: FallbackStorage;
  private users: Map<string, FallbackUser>;

  private constructor() {
    this.users = new Map<string, FallbackUser>();
    console.log('🔧 FallbackStorage instance created');
  }

  public static getInstance(): FallbackStorage {
    if (!FallbackStorage.instance) {
      FallbackStorage.instance = new FallbackStorage();
    }
    return FallbackStorage.instance;
  }

  public getUsers(): Map<string, FallbackUser> {
    return this.users;
  }

  public addUser(email: string, user: FallbackUser): void {
    this.users.set(email.toLowerCase(), user);
    console.log(`✅ User added to storage: ${email}`);
    console.log(`📊 Total users in storage: ${this.users.size}`);
    console.log(`📝 All users:`, Array.from(this.users.keys()));
  }

  public getUser(email: string): FallbackUser | undefined {
    return this.users.get(email.toLowerCase());
  }

  public hasUser(email: string): boolean {
    return this.users.has(email.toLowerCase());
  }

  public getUserCount(): number {
    return this.users.size;
  }
}

// Export singleton instance
export const fallbackStorage = FallbackStorage.getInstance();
export const fallbackUsers = fallbackStorage.getUsers();

console.log('📦 Fallback storage module loaded. Current users:', fallbackStorage.getUserCount());
