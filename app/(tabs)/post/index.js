import { StyleSheet, Text, View, ScrollView, Image, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { firebase } from '../../../firebase'
import axios from 'axios';
import { useRouter } from 'expo-router';

const index = () => {
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [userId, setUserId] = useState('')
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await AsyncStorage.getItem('authToken').then((token) => {
                    console.log('theToken---', token)
                    if (token) {
                        const decodedToken = jwt_decode(token)
                        setUserId(decodedToken.userId)
                    }
                })
            } catch (error) {
                console.error('Error fetching or decoding token:', error)
            }
        }
        fetchUser()
    }, [])

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
    const createPost = async () => {
        try {
            const uploadedURL = await uploadFile()
            const postData = {
                description: description,
                imageUrl: uploadedURL,
                userId: userId
            }

            await axios.post('https://00ea-217-43-47-167.ngrok-free.app/create', postData).then((res) => {
                if (res.status === 201) {
                    console.log('res_data ==', res.data)
                    router.replace('/(tabs)/home')
                }
            })

        } catch (error) {
            console.log(error)
        }
    }
    async function uploadFile() {
        console.log('image', image)

        try {
            const { uri } = await FileSystem.getInfoAsync(image)

            if (!uri) {
                throw new Error('Invalid File Uri')
            }

            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response)
                }
                xhr.onerror = (e) => {
                    reject(new TypeError('Network request failed'))
                }
                xhr.responseType = "blob"
                xhr.open('GET', uri, true)
                xhr.send(null)
            })
            const filename = image.substring(image.lastIndexOf('/') + 1)
            const ref = firebase.storage().ref().child(filename)
            await ref.put(blob)
            const downloadURL = await ref.getDownloadURL()
            return downloadURL
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-around", marginVertical: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Entypo name="circle-with-cross" size={24} color="black" />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, }}>
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20
                            }}
                            source={{ uri: 'https://www.freepnglogos.com/uploads/globe-png/globe-true-friends-and-sewing-collectibles-quilty-pleasures-blog-37.png' }}
                        />
                        <Text style={{ fontWeight: '500' }}>Anyone</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 8 }}>
                    <Entypo name="back-in-time" size={24} color="black" />
                    <Pressable
                        onPress={() => createPost()}
                        style={{
                            padding: 10,
                            backgroundColor: '#0072B1',
                            borderRadius: 20,
                            width: 80
                        }}
                    >

                        <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Post</Text>
                    </Pressable>
                </View>
            </View>
            <TextInput
                value={description}
                onChangeText={(text) => setDescription(text)}
                placeholder='Say Something'
                placeholderTextColor={'black'}
                multiline={true}
                numberOfLines={3}
                textAlignVertical='top'
                style={{
                    marginHorizontal: 10,
                    fontWeight: '500',
                    fontSize: 16,
                    marginTop: 10
                }}
            />
            {
                image && (
                    <Image
                        style={{
                            width: '100%',
                            height: 240,
                            marginVertical: 20
                        }}
                        source={{ uri: image }}
                    />
                )
            }
            <Pressable
                style={{
                    flexDirection: 'column',
                    marginRight: 'auto',
                    marginLeft: 'auto'
                }}

            >
                <Pressable
                    onPress={() => pickImage()}
                    style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#808080',
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <MaterialIcons name="perm-media" size={24} color="black" />
                </Pressable>
                <Text>Media</Text>
            </Pressable>
        </ScrollView>
    )
}

export default index

const styles = StyleSheet.create({})