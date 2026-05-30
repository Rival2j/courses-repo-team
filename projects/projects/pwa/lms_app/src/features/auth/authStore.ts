import create from "zustand";
import type { User } from "../../types";

const AUTH_STORAGE_KEY = "lms-auth-user";
const REGISTERED_USERS_STORAGE_KEY = "lms-auth-users";

const DEFAULT_USER: RegisteredUser = {
  name: "Alumno Demo",
  email: "demo@lms.local",
  password: "Demo1234",
};

export interface RegisteredUser extends User {
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function loadRegisteredUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return [DEFAULT_USER];
  try {
    const raw = window.localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as RegisteredUser[]) : [];
    const hasDefault = stored.some((user) => user.email === DEFAULT_USER.email);
    return hasDefault ? stored : [DEFAULT_USER, ...stored];
  } catch {
    return [DEFAULT_USER];
  }
}

function persistUser(user: User | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // ignore localStorage errors
  }
}

function persistRegisteredUsers(users: RegisteredUser[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore localStorage errors
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  isAuthenticated: Boolean(loadUser()),
  login: (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = loadRegisteredUsers();
    const match = users.find(
      (stored) => stored.email === normalizedEmail && stored.password === password.trim()
    );

    if (!match) {
      return false;
    }

    const user: User = { name: match.name, email: match.email };
    persistUser(user);
    set({ user, isAuthenticated: true });
    return true;
  },
  signup: (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = loadRegisteredUsers();

    if (!name.trim() || !normalizedEmail || !password.trim()) {
      return { success: false, message: "Completa todos los campos para crear la cuenta." };
    }

    if (users.some((stored) => stored.email === normalizedEmail)) {
      return { success: false, message: "Ya existe una cuenta con este correo." };
    }

    const newUser: RegisteredUser = {
      name: name.trim(),
      email: normalizedEmail,
      password: password.trim(),
    };

    const updatedUsers = [newUser, ...users];
    persistRegisteredUsers(updatedUsers);
    persistUser({ name: newUser.name, email: newUser.email });
    set({ user: { name: newUser.name, email: newUser.email }, isAuthenticated: true });
    return { success: true, message: "Cuenta creada correctamente." };
  },
  logout: () => {
    persistUser(null);
    set({ user: null, isAuthenticated: false });
  },
}));
