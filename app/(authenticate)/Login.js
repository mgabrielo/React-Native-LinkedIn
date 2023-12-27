import { Image, KeyboardAvoidingView, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    useEffect(() => {
        const loginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken')
                console.log(token)
                if (token) {
                    router.replace('/(tabs)/home')
                }
            } catch (error) {
                console.log(error)
            }
        }
        loginStatus()
    }, [])

    const handleLogin = () => {
        const user = { email: email, password: password }
        axios.post('https://00ea-217-43-47-167.ngrok-free.app/login', user).then((res) => {
            if (res) {
                console.log(res.data)
                const token = res.data.token
                AsyncStorage.setItem('authToken', token)
                router.replace('/(tabs)/home')
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', }}>
            <Image
                style={{ width: 150, height: 100, resizeMode: 'contain', marginTop: 12 }}
                source={{ uri: 'https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-16.png' }}
            />
            <KeyboardAvoidingView>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 12, color: '#808080' }}>
                        Login Into Your Acount
                    </Text>
                </View>
                <View style={{ marginTop: 50 }}>
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
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, justifyContent: 'space-between' }}>
                    <Text>Keep Me Logged In</Text>
                    <Text style={{ color: '#007FFF', fontWeight: 'bold', fontSize: 16 }}>Forgot Password ?</Text>
                </View>
                <View style={{ marginTop: 60 }}>
                    <Pressable onPress={handleLogin} style={{ width: 200, backgroundColor: '#0072B1', borderRadius: 6, marginLeft: 'auto', marginRight: 'auto', padding: 12 }}>
                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: 'bold' }}>Login</Text>
                    </Pressable>

                    <Pressable onPress={() => router.push("/Register")} style={{ marginTop: 17 }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, color: '#808080' }}>Don't Have An Account ?</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({})