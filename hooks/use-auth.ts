import { User } from "lucia";
import useSWR from "swr";

interface AuthState {
  isSignedIn: boolean;
  user: User;
  sessionId: string | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAuth() {
  const { data, error } = useSWR<AuthState>("/api/auth", fetcher);

  return {
    isSignedIn: data?.isSignedIn ?? false,
    isLoaded: !error && !!data,
    user: data?.user ?? null,
    sessionId: data?.sessionId ?? null,
  };
}
