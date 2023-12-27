import { StyleSheet, Text, View, ScrollView, Pressable, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import { AntDesign, Feather, Entypo, Ionicons } from '@expo/vector-icons';
import moment from 'moment'



const index = () => {
    const [userId, setUserId] = useState('')
    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])

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
        const fetchAllPosts = async () => {
            try {
                await axios.get(`https://00ea-217-43-47-167.ngrok-free.app/all`).then((res) => {
                    if (res.status === 200) {
                        setPosts(res.data?.posts)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllPosts()
    }, [])
    const Max_Lines = 2
    const [showFullText, setShowFullText] = useState(false)
    const toggleShowFullText = () => {
        setShowFullText(!showFullText)
    }
    return (
        <ScrollView>
            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Pressable>
                    <Image
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 25
                        }}
                        source={{ uri: user?.profileImage }}
                    />
                </Pressable>
                <Pressable
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 7,
                        gap: 10,
                        backgroundColor: '#fff',
                        borderRadius: 3,
                        height: 30,
                        flex: 1
                    }}
                >
                    <AntDesign style={{ marginLeft: 10 }} name="search1" size={22} color="black" />
                    <TextInput placeholder='Search' />
                </Pressable>

                <Ionicons name="chatbox-ellipses-outline" size={22} color="black" />
            </View>
            <View>
                {
                    posts.length > 0 && posts.map((post, index) => {
                        if (post) {
                            return (
                                <View
                                    key={index}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 10,
                                            paddingVertical: 8
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 30
                                            }}
                                            source={{ uri: post?.user?.profileImage }}
                                        />
                                        <View>
                                            <Text>{post?.user?.name}</Text>
                                            <Text
                                                style={{
                                                    width: 230,
                                                    fontSize: 15,
                                                    fontWeight: '400',
                                                    color: 'gray'
                                                }}
                                                ellipsizeMode='tail'
                                                numberOfLines={1}
                                            >
                                                Tech Lead | Linked In Certified
                                            </Text>
                                            <Text>
                                                {moment(post?.createdAt).format('MMMM Do YYYY')}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <Entypo name="dots-three-vertical" size={24} color="black" />
                                            <Feather name="x" size={24} color="black" />
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 10, marginHorizontal: 10, marginBottom: 12 }}>
                                        <Text
                                            numberOfLines={showFullText ? undefined : Max_Lines}
                                            style={{
                                                fontSize: 15
                                            }}
                                        >
                                            {post?.description}
                                        </Text>
                                        {
                                            !showFullText && (
                                                <Pressable onPress={toggleShowFullText}>
                                                    <Text>See More...</Text>
                                                </Pressable>
                                            )
                                        }
                                    </View>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 240
                                        }}
                                        source={{ uri: post?.imageUrl }}
                                    />
                                </View>
                            )
                        }
                        return null
                    })
                }
            </View>
        </ScrollView>
    )
}

export default index

const styles = StyleSheet.create({})