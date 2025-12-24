import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ExperienceLevel = 'novice' | 'experienced' | 'veteran';
export type RiskPreference = 'conservative' | 'neutral' | 'aggressive';

interface UserState {
    experience: ExperienceLevel;
    riskPreference: RiskPreference;
    selectedBeliefs: string[]; // IDs of selected beliefs

    setExperience: (level: ExperienceLevel) => void;
    setRiskPreference: (pref: RiskPreference) => void;
    toggleBelief: (beliefId: string) => void;
    resetProfile: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            experience: 'novice',
            riskPreference: 'neutral',
            selectedBeliefs: [],

            setExperience: (level) => set({ experience: level }),
            setRiskPreference: (pref) => set({ riskPreference: pref }),
            toggleBelief: (beliefId) => set((state) => {
                const isSelected = state.selectedBeliefs.includes(beliefId);
                if (isSelected) {
                    return { selectedBeliefs: state.selectedBeliefs.filter(id => id !== beliefId) };
                } else {
                    // Max 3 beliefs
                    if (state.selectedBeliefs.length >= 3) return state;
                    return { selectedBeliefs: [...state.selectedBeliefs, beliefId] };
                }
            }),
            resetProfile: () => set({
                experience: 'novice',
                riskPreference: 'neutral',
                selectedBeliefs: []
            }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
