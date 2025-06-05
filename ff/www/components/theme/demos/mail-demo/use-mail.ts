import { Mail, mails } from "./data";
import { create } from "zustand";

interface Config {
  selected: Mail["id"] | null;
}

const useMailStore = create<
  Config & { setState: (newState: Partial<Config>) => void }
>((set) => ({
  selected: mails[0].id,
  setState: (newState) => set((state) => ({ ...state, ...newState })),
}));

export function useMail(): [Config, (newState: Partial<Config>) => void] {
  const selected = useMailStore((state) => state.selected);
  const setState = useMailStore((state) => state.setState);
  return [{ selected }, setState];
}
