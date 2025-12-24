import { View, Text, TouchableOpacity } from 'react-native';
import { MarketEvent } from '../services/polymarket';

interface MarketCardProps {
    event: MarketEvent;
    onBelieve: (event: MarketEvent) => void;
    isBelieved?: boolean;
}

export const MarketCard = ({ event, onBelieve, isBelieved = false }: MarketCardProps) => {
    const market = event.markets?.[0];
    if (!market) return null;

    let yesPrice = 0;
    try {
        // outcomePrices is likely an array of strings like ["0.3", "0.7"] based on API types (or JSON string if old API).
        // Safest approach: check type.
        const prices = market.outcomePrices;
        let priceStr = "0";

        if (Array.isArray(prices)) {
            priceStr = prices[0];
        } else if (typeof prices === 'string') {
            // Fallback if API returns JSON string
            try {
                const p = JSON.parse(prices);
                priceStr = p[0];
            } catch (e) { }
        }

        if (priceStr) {
            yesPrice = parseFloat(priceStr) * 100;
        }
    } catch (e) {
        yesPrice = 0;
    }

    return (
        <View className={`bg-gray-800 rounded-xl p-4 mb-4 border ${isBelieved ? 'border-green-500' : 'border-gray-700'}`}>
            <View className="flex-row justify-between items-start mb-2">
                <Text className="text-white font-bold text-lg flex-1 mr-2">{event.title}</Text>
                <View className={`px-2 py-1 rounded ${yesPrice > 50 ? 'bg-green-900' : 'bg-red-900'}`}>
                    <Text className={`font-bold ${yesPrice > 50 ? 'text-green-400' : 'text-red-400'}`}>
                        {yesPrice.toFixed(0)}%
                    </Text>
                </View>
            </View>

            <Text className="text-gray-400 text-sm mb-4" numberOfLines={2}>
                {market.question}
            </Text>

            <TouchableOpacity
                className={`py-3 rounded-lg items-center ${isBelieved ? 'bg-gray-700' : 'bg-blue-600 active:bg-blue-700'}`}
                onPress={() => !isBelieved && onBelieve(event)}
                disabled={isBelieved}
            >
                <Text className={`font-bold font-lg ${isBelieved ? 'text-gray-400' : 'text-white'}`}>
                    {isBelieved ? 'BELIEVED' : 'BELIEVE!'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
