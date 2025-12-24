import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useState } from 'react';

const { width } = Dimensions.get('window');

const STEPS = [
    {
        icon: 'pulse-outline',
        title: 'Signal Detection',
        subtitle: 'The system continuously scans market chaos for identifiable patterns.',
        accent: '#3b82f6' // blue-500
    },
    {
        icon: 'finger-print-outline',
        title: 'Belief Verification',
        subtitle: 'You validate signals with your intuition. Your belief shapes reality.',
        accent: '#f97316' // orange-500
    },
    {
        icon: 'sync-outline',
        title: 'Consensus Sync',
        subtitle: 'When individual beliefs align, a market trend is born.',
        accent: '#10b981' // emerald-500
    }
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { completeOnboarding } = useOnboardingStore();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeOnboarding();
            router.replace('/(tabs)');
        }
    };

    const stepData = STEPS[currentStep];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.content}>
                {/* Progress Indicators */}
                <View style={styles.progressContainer}>
                    {STEPS.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.progressBar,
                                { backgroundColor: index <= currentStep ? '#fff' : '#27272a' }
                            ]}
                        />
                    ))}
                </View>

                {/* Main Content */}
                <Animated.View
                    key={currentStep}
                    entering={SlideInRight}
                    exiting={SlideOutLeft}
                    style={styles.stepContent}
                >
                    <View style={[styles.iconContainer, { backgroundColor: `${stepData.accent}20` }]}>
                        <Ionicons
                            name={stepData.icon as any}
                            size={64}
                            color={stepData.accent}
                        />
                    </View>
                    <Text style={styles.title}>{stepData.title}</Text>
                    <Text style={styles.subtitle}>{stepData.subtitle}</Text>
                </Animated.View>

                {/* Action Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    style={styles.button}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        {currentStep === STEPS.length - 1 ? 'ENTER SYSTEM' : 'PROCEED'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 32,
        paddingBottom: 64,
    },
    progressContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 16,
    },
    progressBar: {
        flex: 1,
        height: 4,
        borderRadius: 999,
    },
    stepContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#27272a', // zinc-800
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -1,
    },
    subtitle: {
        color: '#a1a1aa', // zinc-400
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#fff',
        height: 64,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 2,
    },
});
