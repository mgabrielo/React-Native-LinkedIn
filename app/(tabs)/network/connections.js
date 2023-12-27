import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';

const connections = () => {
    const [userId, setUserId] = useState('')
    const [connections, setConnections] = useState([])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await AsyncStorage.getItem('authToken').then((token) => {
                    console.log('connectToken---', token)
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

    useEffect(() => {
        if (userId) {
            fetchConnections()
        }
    }, [userId])

    const fetchConnections = async () => {
        try {
            await axios.get(`https://00ea-217-43-47-167.ngrok-free.app/connections/${userId}`).then((res) => {
                if (res.status) {
                    setConnections(res.data.connections)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    console.log('connections--', connections)
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: 15,
                    marginTop: 10
                }}
            >
                <Text style={{ fontWeight: '500', fontSize: 17 }}>{connections.length} Connections</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10
                    }}
                >
                    <AntDesign name="search1" size={22} color="black" />
                    <Octicons name="three-bars" size={22} color="black" />
                </View>
            </View>
            <View style={{ height: 2, borderWidth: 2, borderColor: '#E0E0E0', marginTop: 12, }} />
            <View
                style={{
                    marginHorizontal: 10,
                    marginTop: 10
                }}
            >
                {
                    connections.length > 0 && connections.map((item, index) => {
                        if (item) {
                            return (
                                <View key={index}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginVertical: 10,
                                        gap: 10
                                    }}
                                >
                                    <Image
                                        source={{ uri: item?.profileImage }}
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 24
                                        }}
                                    />
                                    <View style={{ flexDirection: 'column', gap: 2, marginVertical: 5 }}>
                                        <Text style={{ fontSize: 15, fontWeight: '500' }}>{item?.name}</Text>
                                        <Text style={{ color: '#808080' }}>Tech Company</Text>
                                        <Text style={{ color: '#808080' }}>Connected On {moment(item?.createdAt).format('MMMM Do YYYY')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Entypo name="dots-three-vertical" size={22} color="black" />
                                        <Feather name="send" size={22} color="black" />
                                    </View>
                                </View>
                            )
                        }
                        return null
                    })
                }
            </View>
        </View>
    )
}

export default connections

const styles = StyleSheet.create({})