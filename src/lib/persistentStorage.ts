/**
 * Persistent File-Based Storage
 * Fallback when MongoDB is unavailable
 * Data persists across server restarts
 */

import fs from 'fs';
import path from 'path';

interface StoredUser {
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

interface StoredOTP {
  email: string;
  otp: string;
  purpose: 'login' | 'register' | 'password-reset';
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  createdAt: Date;
}

const STORAGE_FILE = path.join(process.cwd(), '.data', 'users.json');
const OTP_STORAGE_FILE = path.join(process.cwd(), '.data', 'otps.json');

// Ensure storage directory exists
function ensureStorageDir() {
  const dir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Load users from file
function loadUsers(): Map<string, StoredUser> {
  try {
    ensureStorageDir();
    console.log(`📂 Checking for users file at: ${STORAGE_FILE}`);
    
    if (fs.existsSync(STORAGE_FILE)) {
      console.log(`✅ Users file found, reading...`);
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      console.log(`📄 Raw data length: ${data.length} characters`);
      
      const usersArray = JSON.parse(data);
      console.log(`📦 Parsed array with ${usersArray.length} entries`);
      
      const usersMap = new Map<string, StoredUser>(usersArray);
      console.log(`🗺️ Created Map with ${usersMap.size} users:`, Array.from(usersMap.keys()));
      
      return usersMap;
    } else {
      console.log(`❌ Users file does not exist yet`);
    }
  } catch (error) {
    console.error('❌ Error loading users from file:', error);
  }
  return new Map();
}

// Save users to file
function saveUsers(users: Map<string, StoredUser>) {
  try {
    ensureStorageDir();
    const usersArray = Array.from(users.entries());
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(usersArray, null, 2), 'utf-8');
    console.log('💾 Users saved to persistent storage');
  } catch (error) {
    console.error('❌ Error saving users to file:', error);
  }
}

// Load OTPs from file
function loadOTPs(): StoredOTP[] {
  try {
    ensureStorageDir();
    if (fs.existsSync(OTP_STORAGE_FILE)) {
      const data = fs.readFileSync(OTP_STORAGE_FILE, 'utf-8');
      const otps = JSON.parse(data);
      // Convert date strings back to Date objects
      return otps.map((otp: any) => ({
        ...otp,
        expiresAt: new Date(otp.expiresAt),
        createdAt: new Date(otp.createdAt)
      }));
    }
  } catch (error) {
    console.error('❌ Error loading OTPs from file:', error);
  }
  return [];
}

// Save OTPs to file
function saveOTPs(otps: StoredOTP[]) {
  try {
    ensureStorageDir();
    fs.writeFileSync(OTP_STORAGE_FILE, JSON.stringify(otps, null, 2), 'utf-8');
    console.log('💾 OTPs saved to persistent storage');
  } catch (error) {
    console.error('❌ Error saving OTPs to file:', error);
  }
}

class PersistentStorage {
  private static instance: PersistentStorage;
  private users: Map<string, StoredUser>;
  private otps: StoredOTP[];
  private lastLoadTime: number;

  private constructor() {
    this.users = loadUsers();
    this.otps = loadOTPs();
    this.lastLoadTime = Date.now();
    console.log(`🔧 PersistentStorage initialized with ${this.users.size} users and ${this.otps.length} OTPs`);
  }

  public static getInstance(): PersistentStorage {
    // Use global to persist across hot reloads in development
    if (!(global as any).persistentStorageInstance) {
      (global as any).persistentStorageInstance = new PersistentStorage();
    } else {
      // Reload from file if it's been modified or been a while
      const instance = (global as any).persistentStorageInstance;
      instance.reloadIfNeeded();
    }
    return (global as any).persistentStorageInstance;
  }

  private reloadIfNeeded(): void {
    // Reload from file to get latest data
    const fileUsers = loadUsers();
    if (fileUsers.size !== this.users.size) {
      this.users = fileUsers;
      console.log(`🔄 Storage reloaded from file: ${this.users.size} users`);
    }
  }

  public getUsers(): Map<string, StoredUser> {
    return this.users;
  }

  public addUser(email: string, user: StoredUser): void {
    this.users.set(email.toLowerCase(), user);
    saveUsers(this.users);
    console.log(`✅ User added to persistent storage: ${email}`);
    console.log(`📊 Total users: ${this.users.size}`);
  }

  public getUser(email: string): StoredUser | undefined {
    return this.users.get(email.toLowerCase());
  }

  public hasUser(email: string): boolean {
    return this.users.has(email.toLowerCase());
  }

  public getUserCount(): number {
    return this.users.size;
  }

  public getAllUserEmails(): string[] {
    return Array.from(this.users.keys());
  }

  // OTP Methods
  public addOTP(otp: StoredOTP): void {
    this.otps.push(otp);
    saveOTPs(this.otps);
    console.log(`✅ OTP added to persistent storage: ${otp.email} (${otp.purpose})`);
  }

  public getOTP(email: string, purpose: string): StoredOTP | undefined {
    // Clean up expired OTPs
    this.cleanExpiredOTPs();
    
    // Find the most recent OTP for this email and purpose
    const userOTPs = this.otps
      .filter(otp => otp.email.toLowerCase() === email.toLowerCase() && otp.purpose === purpose && !otp.verified)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return userOTPs[0];
  }

  public verifyOTP(email: string, otpCode: string, purpose: string): boolean {
    const otp = this.getOTP(email, purpose);
    if (!otp) return false;
    
    if (otp.otp === otpCode && otp.expiresAt > new Date()) {
      otp.verified = true;
      saveOTPs(this.otps);
      return true;
    }
    
    return false;
  }

  public deleteOTP(email: string, purpose: string): void {
    this.otps = this.otps.filter(
      otp => !(otp.email.toLowerCase() === email.toLowerCase() && otp.purpose === purpose)
    );
    saveOTPs(this.otps);
    console.log(`🗑️ OTP deleted from persistent storage: ${email} (${purpose})`);
  }

  private cleanExpiredOTPs(): void {
    const before = this.otps.length;
    this.otps = this.otps.filter(otp => otp.expiresAt > new Date());
    if (this.otps.length < before) {
      saveOTPs(this.otps);
      console.log(`🧹 Cleaned ${before - this.otps.length} expired OTPs`);
    }
  }
}

// Export singleton instance
export const persistentStorage = PersistentStorage.getInstance();
export type { StoredUser, StoredOTP };
