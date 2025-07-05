import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
import {
    generateNoirProof,
    verifyNoirProof
} from "@/modules/mopro";
import * as FileSystem from "expo-file-system";
import * as Location from 'expo-location';

export default function App() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);


    const [inputs, setInputs] = useState<string[]>([]);
    const [proof, setProof] = useState<Uint8Array>(new Uint8Array());
    const [isValid, setIsValid] = useState<string>("");

    async function genProof(): Promise<void> {
        const a = Math.trunc(location?.coords.latitude || 0 * 1_000_000);
        const b = Math.trunc(location?.coords.longitude || 0 * 1_000_000);
        const circuitInputs = [a, b];
        if (Platform.OS === "web") {
            console.log("not implemented");
        } else if (Platform.OS === "android" || Platform.OS === "ios") {
            const circuitName = "noir.json";

            const content = require(`@/assets/keys/${circuitName}`);

            const newFilePath = `${FileSystem.documentDirectory}${circuitName}`;

            const fileInfo = await FileSystem.getInfoAsync(newFilePath);
            if (!fileInfo.exists) {
                try {
                    await FileSystem.writeAsStringAsync(
                        newFilePath,
                        JSON.stringify(content)
                    );
                } catch (error) {
                    console.error("Error copying file:", error);
                    throw error;
                }
            }

            try {
                const res: Uint8Array = await generateNoirProof(
                    newFilePath.replace("file://", ""),
                    null,
                    circuitInputs
                );
                setProof(res);
            } catch (error) {
                console.error("Error generating proof:", error);
            }
        }
    }

    async function verifyProof(): Promise<void> {
        if (Platform.OS === "web") {
            setIsValid("not implemented");
        } else if (Platform.OS === "android" || Platform.OS === "ios") {
            const circuitName = "noir_multiplier2.json";

            const content = require(`@/assets/keys/${circuitName}`);

            const newFilePath = `${FileSystem.documentDirectory}${circuitName}`;

            const fileInfo = await FileSystem.getInfoAsync(newFilePath);
            if (!fileInfo.exists) {
                try {
                    await FileSystem.writeAsStringAsync(
                        newFilePath,
                        JSON.stringify(content)
                    );
                } catch (error) {
                    console.error("Error copying file:", error);
                    throw error;
                }
            }

            try {
                const res: boolean = await verifyNoirProof(
                    newFilePath.replace("file://", ""),
                    proof
                );
                setIsValid(res.toString());
            } catch (error) {
                console.error("Error verifying proof:", error);
            }
        }
    }

    useEffect(() => {
        async function getCurrentLocation() {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        getCurrentLocation();
    }, []);

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>{text}</Text>
            <Button title="Generate Noir Proof" onPress={() => genProof()} />
            <Button title="Verify Noir Proof" onPress={() => verifyProof()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
});