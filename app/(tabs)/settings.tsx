import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function SettingsScreen() {
    const router = useRouter();
    const { resetOnboarding } = useOnboardingStore();
    const { resetProfile, riskPreference, experience } = useUserStore();
    const { logout } = useAuthStore();

    const handleReset = async () => {
        resetProfile();
        await resetOnboarding();
        router.replace('/onboarding');
    };

    const handleLogout = () => {
        logout();
        // Auth protection in _layout will redirect to /login
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerTitle}>Settings</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile Summary</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Experience</Text>
                            <Text style={styles.rowValue}>{experience}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Style</Text>
                            <Text style={styles.rowValue}>{riskPreference}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.spacer} />

                <View style={styles.actionsContainer}>
                    <Text style={styles.actionTitle}>Account Actions</Text>

                    <TouchableOpacity
                        onPress={handleLogout}
                        style={styles.logoutButton}
                    >
                        <Text style={styles.logoutText}>LOG OUT</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleReset}
                        style={styles.resetButton}
                    >
                        <Text style={styles.resetText}>RESET DEV DATA (ONBOARDING)</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 50,
    },
    headerTitle: {
        color: '#71717a', // zinc-500
        fontWeight: 'bold',
        letterSpacing: 3, // tracking-widest
        textTransform: 'uppercase',
        marginBottom: 32,
        fontSize: 12,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20, // text-xl
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#18181b', // zinc-900
        borderRadius: 12, // rounded-xl
        padding: 16,
        borderWidth: 1,
        borderColor: '#27272a', // zinc-800
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowLabel: {
        color: '#a1a1aa', // zinc-400
    },
    rowValue: {
        color: '#fff',
        textTransform: 'capitalize',
    },
    spacer: {
        flex: 1,
    },
    actionsContainer: {
        marginTop: 40,
        paddingTop: 40,
        borderTopWidth: 1,
        borderTopColor: '#18181b', // zinc-900
        gap: 16,
    },
    actionTitle: {
        color: '#52525b', // zinc-600
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    logoutButton: {
        backgroundColor: '#18181b', // zinc-900
        borderWidth: 1,
        borderColor: '#27272a', // zinc-800
        padding: 16,
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    resetButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // red-500/10
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)', // red-500/30
        padding: 16,
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        marginTop: 16,
    },
    resetText: {
        color: '#ef4444', // red-500
        fontWeight: 'bold',
    },
});
