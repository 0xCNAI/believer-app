import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MarketEvent, BELIEVER_SIGNALS } from '@/services/marketData';

export interface Belief {
    id: string;
    marketEvent: MarketEvent;
    initialProbability: number;
    currentProbability: number;
    addedAt: number;
}

interface BeliefState {
    beliefs: Belief[];
    discardedIds: string[];
    faithClicks: number;
    btcPrice: number;

    // Actions
    addBelief: (event: MarketEvent) => void;
    discardEvent: (id: string) => void;
    removeBelief: (id: string) => void;
    incrementFaith: () => void;
    updateBeliefs: (freshEvents: MarketEvent[]) => void;
    setBtcPrice: (price: number) => void;

    // Getters
    hasInteracted: (id: string) => boolean;
    getReversalIndex: () => number; // Previously Bull Score
    getInterpretation: () => string;
    getStats: () => { believed: number, seen: number };
}

const parsePrice = (prices: string[] | string): number => {
    let priceStr = "0";
    try {
        if (Array.isArray(prices)) {
            priceStr = prices[0];
        } else if (typeof prices === 'string') {
            const p = JSON.parse(prices);
            priceStr = p[0];
        }
        return parseFloat(priceStr) * 100;
    } catch (e) {
        return 0;
    }
};

export const useBeliefStore = create<BeliefState>()(
    persist(
        (set, get) => ({
            beliefs: [],
            discardedIds: [],
            faithClicks: 0,
            btcPrice: 94500, // Initial Mock Price for Anchor

            incrementFaith: () => set((state) => ({ faithClicks: state.faithClicks + 1 })),
            setBtcPrice: (price) => set({ btcPrice: price }),

            addBelief: (event) => {
                const market = event.markets?.[0];
                if (!market) return;

                const initialProb = parsePrice(market.outcomePrices);

                set((state) => ({
                    beliefs: [
                        ...state.beliefs,
                        {
                            id: event.id,
                            marketEvent: event,
                            initialProbability: initialProb,
                            currentProbability: initialProb,
                            addedAt: Date.now(),
                        },
                    ],
                }));
            },

            discardEvent: (id) => {
                set((state) => ({
                    discardedIds: [...state.discardedIds, id]
                }));
            },

            removeBelief: (id) => {
                set((state) => ({
                    beliefs: state.beliefs.filter((b) => b.id !== id),
                }));
            },

            updateBeliefs: (freshEvents) => {
                set((state) => {
                    const updatedBeliefs = state.beliefs.map(belief => {
                        const freshEvent = freshEvents.find(e => e.id === belief.id);
                        if (freshEvent && freshEvent.markets?.[0]) {
                            const newProb = parsePrice(freshEvent.markets[0].outcomePrices);
                            return { ...belief, currentProbability: newProb, marketEvent: freshEvent };
                        }
                        return belief;
                    });
                    return { beliefs: updatedBeliefs };
                });
            },

            hasInteracted: (id) => {
                const state = get();
                return state.beliefs.some(b => b.id === id) || state.discardedIds.includes(id);
            },

            getReversalIndex: () => {
                // Formula: (Tech * LiquidityModifier) + User Belief
                const { beliefs } = get();

                // 1. Technical Score (60% Base) -> Mocked 55
                // 2. Liquidity Modifier (The Amplifier)
                // For V1, we simulate this based on the "Liquidity" category events if present,
                // or default to Neutral (1.0)

                // Simple mock logic for "Background State":
                // If any Liquidity event > 50%, we say Improving. Else Neutral/Tight.
                // In production this would come from a dedicated "Regime Signal".

                const liqEvents = BELIEVER_SIGNALS.filter(e => e.category === 'Liquidity');
                // Mock: Assume 1 Improving event exists
                const liquidityStatus: 'tight' | 'neutral' | 'improving' = 'neutral';
                const modifier = liquidityStatus === 'improving' ? 1.2 : (liquidityStatus === 'tight' ? 0.8 : 1.0);

                const techComponent = (55 * 0.6) * modifier; // Base ~33, modified up/down

                // 3. User Belief Score (40%)
                let userComponent = 20;

                if (beliefs.length > 0) {
                    const totalProb = beliefs.reduce((sum, b) => sum + b.currentProbability, 0);
                    const avgProb = totalProb / beliefs.length; // 0-100
                    userComponent = avgProb * 0.4; // Max 40
                }

                // Cap at 100
                return Math.min(100, techComponent + userComponent);
            },

            getInterpretation: () => {
                const index = get().getReversalIndex();
                // Avoid actionable language. Focus on "Perception"
                if (index < 40) return "市場結構受壓制，流動性尚未鬆動。";
                if (index < 60) return "多空力道均衡，等待流動性與結構共振。";
                return "市場結構轉佳，流動性環境支持反轉。";
            },

            getStats: () => {
                const { beliefs, discardedIds } = get();
                return {
                    believed: beliefs.length,
                    seen: beliefs.length + discardedIds.length
                };
            }
        }),
        {
            name: 'belief-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
