import { StyleSheet, Text, View, ScrollView, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import UserProfile from '../../components/UserProfile'
import ConnectionRequest from '../../components/ConnectionRequest'
import { useRouter } from 'expo-router';

const index = () => {
    const [userId, setUserId] = useState('')
    const [user, setUser] = useState({})
    const [users, setUsers] = useState([])
    const [connectionRequest, setConnectionRequest] = useState([])
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

    useEffect(() => {
        if (userId) {
            fetchUserProfile()
        }
    }, [userId])
    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`https://00ea-217-43-47-167.ngrok-free.app/profile/${userId}`)
            const userData = res.data?.user
            setUser(userData)
        } catch (error) {
            console.log('Error fetching user profile')
        }
    }

    useEffect(() => {
        if (userId) {
            fetchFriendRequests()
        }
    }, [userId])

    const fetchFriendRequests = async () => {
        try {
            const res = await axios.get(`https://00ea-217-43-47-167.ngrok-free.app/connection-request/${userId}`)
            if (res.status === 200) {
                const connectionRequestData = res.data?.connectionRequests.length > 0 &&
                    res.data?.connectionRequests.map((friendRequest) => ({
                        _id: friendRequest._id,
                        name: friendRequest.name,
                        email: friendRequest.email,
                        image: friendRequest.profileImage
                    }))
                setConnectionRequest(connectionRequestData)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUsers()
    }, [userId])
    const fetchUsers = async () => {
        try {
            await axios.get(`https://00ea-217-43-47-167.ngrok-free.app/users/${userId}`).then((res) => {
                setUsers(res.data.users)
            }).catch((err) => {
                console.log(err)
            })
        } catch (error) {
            console.log('error fetching other users')
        }
    }
    // console.log('users--', users)
    console.log('connectionRequest---', connectionRequest)

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }} >
                <Pressable
                    onPress={() => router.push('/network/connections')}
                    style={{
                        marginTop: 10,
                        marginHorizontal: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <AntDesign name="arrowright" size={24} color="black" />
                    <Text style={{ fontSize: 17, fontWeight: '800' }}>Manage My Network</Text>
                </Pressable>
                <View style={{ borderColor: '#808080', borderWidth: 2, marginVertical: 10 }} />
                <View
                    style={{
                        marginTop: 10,
                        marginHorizontal: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Invitations({connectionRequest.length})</Text>
                    <AntDesign name="arrowright" size={24} color="black" />
                </View>
                <View style={{ borderColor: '#808080', borderWidth: 2, marginVertical: 10 }} />
                <View>
                    {/* show all connections */}
                    {
                        connectionRequest.length > 0 && connectionRequest.map((item, index) => {
                            if (item) {
                                return (
                                    <ConnectionRequest
                                        item={item}
                                        key={index}
                                        setConnectionRequest={setConnectionRequest}
                                        connectionRequests={connectionRequest}
                                        userId={userId}
                                    />
                                )
                            }
                            return null
                        })
                    }
                </View>

                <View style={{ marginHorizontal: 15 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text>Grow your network</Text>
                        <Entypo name="cross" size={24} color="black" />
                    </View>
                    <Text>Find And Contact the Right People</Text>
                    <View
                        style={{
                            backgroundColor: '#FFC72C',
                            width: 140,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 25,
                            marginTop: 8
                        }}
                    >
                        <Text style={{ textAlign: 'center', color: '#000', fontWeight: '600' }}>Try Premium</Text>
                    </View>
                </View>
                {users.length > 0 &&
                    <FlatList
                        scrollEnabled={false}
                        data={users}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        numColumns={2}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, index }) => (
                            <UserProfile item={item} userId={userId} key={index} />
                        )}
                    />
                }
            </ScrollView>
        </>
    )
}

export default index

const styles = StyleSheet.create({})