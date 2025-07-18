import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button, ScrollView, TextInput } from 'react-native';
import {
    generateNoirProof,
    verifyNoirProof
} from "@/modules/mopro";
import * as FileSystem from "expo-file-system";
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function App() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);


    const [inputs, setInputs] = useState<string[]>([]);
    const [proof, setProof] = useState<Uint8Array>(new Uint8Array());
    const [isValid, setIsValid] = useState<string>("");

    const [latitude, setLatitude] = useState(43.5513755);
    const [longitude, setLongitude] = useState(7.017384);
    const [address, setAddress] = useState("0x1D95dBD536F114258c0a50BC7194eF4504ec9427");

    async function genProof(): Promise<void> {
        const lat = (latitude * 1_000_000).toFixed(0);
        const long = (longitude * 1_000_000).toFixed(0);
        const circuitInputs = [lat, long];
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
                setErrorMsg("Error generating proof, maybe you are too far from palais des congrès");
            }
        }
    }

    async function verifyProof(): Promise<void> {
        if (Platform.OS === "web") {
            setIsValid("not implemented");
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
                const res: boolean = await verifyNoirProof(
                    newFilePath.replace("file://", ""),
                    proof
                );
                setIsValid(res.toString());
            } catch (error) {
                console.error("Error verifying proof:", error);
                setErrorMsg("Error verifying proof: " + error);
            }
        }
    }

    useEffect(() => {


       // getCurrentLocation();
    }, []);

    async function getCurrentLocation() {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        if (location.coords) {
            setLatitude(location.coords.latitude)
            setLongitude(location.coords.longitude)
        }
    }

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    async function mintNFT() {
        try {
            const response = await fetch('https://localhost:3000/mint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address, proof }),
            });
            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Erreur serveur : ${err}`);
            }
            const data = await response.json();
            console.log('NFT minté avec succès :', data.txHash);
            return data;
        } catch (error) {
            console.error('Erreur mint NFT :', error);
            throw error;
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Latitude</Text>
                <TextInput
                    style={styles.input}
                    value={latitude.toString()}
                    onChangeText={(e) => setLatitude(parseFloat(e))}
                    keyboardType="decimal-pad"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Longitude</Text>
                <TextInput
                    style={styles.input}
                    value={longitude.toString()}
                    onChangeText={(e) => setLongitude(parseFloat(e))}
                    keyboardType="decimal-pad"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    keyboardType="default"
                />
            </View>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <Button title="Get location" onPress={() => getCurrentLocation()} />
            <Button title="Generate Noir Proof" onPress={() => genProof()} />
            <Button title="Verify Noir Proof" onPress={() => verifyProof()} />
            <Button title="Mint" onPress={() => mintNFT()} />
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Proof is Valid:</ThemedText>
                <Text style={styles.output}>{isValid}</Text>
                {/* TODO: add public signals */}
                {/* <ThemedText type="subtitle">Public Signals:</ThemedText>
                            <ScrollView style={styles.outputScroll}>
                                <Text style={styles.output}>{JSON.stringify(inputs)}</Text>
                            </ScrollView> */}
                <ThemedText type="subtitle">Proof:</ThemedText>
                <ScrollView style={styles.outputScroll}>
                    <Text style={styles.output}>{proof}</Text>
                </ScrollView>
            </ThemedView>
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
    errorText: {
        fontSize: 18,
        textAlign: 'center',
        color: 'red'
    },
    outputScroll: {
        maxHeight: 150,
        borderWidth: 1,
        borderColor: "gray",
        marginBottom: 10,
    },
    output: {
        fontSize: 14,
        padding: 10,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        flex: 1,
        paddingHorizontal: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginRight: 10,
    },
});