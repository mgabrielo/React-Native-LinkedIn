import { Alert, Image, KeyboardAvoidingView, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router';
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState('')
    const router = useRouter()

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (result.canceled) {
            return;
        }
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const handleRegister = async () => {
        const user = { name: name, email: email, password: password, profileImage: image }
        await axios.post('https://00ea-217-43-47-167.ngrok-free.app/register', user).then((res) => {
            if (res.data) {
                console.log(res.data)
                Alert.alert(`msg - ${res.data?.message}`)
                router.replace('/Login')
            }
            setName(''); setEmail(''); setPassword(''); setImage('');
        }).catch((err) => {
            console.log(err)
            Alert.alert(`msg failed ${err?.message}`)
        })
    }

    function ProfileImage() {
        return (
            <Pressable onPress={() => pickImage()} style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {image ? (
                    <Image source={{ uri: image }}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 0,
                            backgroundColor: "#e8e8e8",
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    />
                ) : (<Image
                    source={require("../../assets/img/avatar.png")}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 0,
                        backgroundColor: "#e8e8e8",
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}
                />)}
            </Pressable>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', }}>
            <Image
                style={{ width: 150, height: 100, resizeMode: 'contain' }}
                source={{ uri: 'https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-16.png' }}
            />
            <KeyboardAvoidingView>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 5, color: '#808080' }}>
                        Register Your Acount
                    </Text>
                </View>
                <View style={{ marginTop: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E0E0E0', paddingVertical: 5, borderRadius: 5, marginTop: 25 }}>
                        <Ionicons name="md-person" size={24} style={{ marginLeft: 8 }} color="black" />
                        <TextInput
                            value={name}
                            onChangeText={(text) => setName(text)}
                            placeholder='Enter Your name'
                            style={{ color: name ? 'black' : 'gray', paddingHorizontal: 2, fontSize: name ? 17 : 16, marginVertical: 10, width: 300 }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E0E0E0', paddingVertical: 5, borderRadius: 5, marginTop: 25 }}>
                        <MaterialIcons name="email" size={24} style={{ marginLeft: 8 }} color="black" />
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholder='Enter Your Email'
                            style={{ color: email ? 'black' : 'gray', paddingHorizontal: 2, fontSize: email ? 17 : 16, marginVertical: 10, width: 300 }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E0E0E0', paddingVertical: 5, borderRadius: 5, marginTop: 25 }}>
                        <FontAwesome name="lock" size={24} style={{ marginLeft: 8 }} color="black" />
                        <TextInput
                            placeholder='Enter Your Password'
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            style={{ paddingHorizontal: 2, color: password ? 'black' : 'gray', fontSize: password ? 17 : 16, marginVertical: 10, width: 300 }} />
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center', gap: 5, backgroundColor: '#E0E0E0', paddingVertical: 5, borderRadius: 5, marginTop: 25 }}>
                        <Text style={{ textAlign: 'center', marginBottom: 5, marginLeft: 'auto', marginRight: 'auto', fontSize: 18, color: '#000' }}>Pick a Profile Image</Text>
                        <ProfileImage />
                    </View>
                </View>
                <View style={{ marginTop: 30 }}>
                    <Pressable
                        onPress={handleRegister}
                        style={{
                            width: 200,
                            backgroundColor: '#0072B1',
                            borderRadius: 6,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            padding: 12
                        }}
                    >
                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: 'bold' }}>Register</Text>
                    </Pressable>

                    <Pressable onPress={() => router.push("/Login")} style={{ marginTop: 17 }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, color: '#808080' }}>Already Have An Account ?</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Register

const styles = StyleSheet.create({})