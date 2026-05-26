import { create } from 'zustand'

type Character = {
  name: string
  age: string
  power: string
  images: string[]
  category: string
}

type Store = {
  lastCharacters: Record<string, Character | null>
  setLastCharacter: (category: string, char: Character) => void
  clearAll: () => void
}

export const useAnimeStore = create<Store>((set) => ({
  lastCharacters: {
    naruto: null,
    saintseiya: null,
    onepiece: null,
    hunterxhunter: null,
  },
  setLastCharacter: (category, char) => set((state) => ({
    lastCharacters: { ...state.lastCharacters, [category]: char },
  })),
  clearAll: () => set({
    lastCharacters: {
      naruto: null, saintseiya: null,
      onepiece: null, hunterxhunter: null,
    },
  }),
}))
