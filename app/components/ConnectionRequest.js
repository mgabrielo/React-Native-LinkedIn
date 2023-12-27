import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import axios from 'axios';

const ConnectionRequest = ({ item, connectionRequests, setConnectionRequest, userId }) => {
    const acceptConnection = async (requestId) => {
        try {
            const data = {
                senderId: requestId,
                recepientId: userId
            }
            await axios.post(`https://00ea-217-43-47-167.ngrok-free.app/connection-request/accept`, data).then((res) => {
                console.log(res.status)
                if (res.status === 200) {
                    setConnectionRequest(connectionRequests.filter((req) => req.id !== requestId))
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View style={{ marginHorizontal: 15, marginVertical: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25
                    }}
                    source={{ uri: item?.image }}
                />
                <Text style={{ width: 200 }}>{item?.name} is inviting you to connect</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                    <View
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: '#E0E0E0',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Feather name="x" size={22} color="black" />
                    </View>
                    <Pressable
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: '#E0E0E0',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={(() => acceptConnection(item?._id))}
                    >
                        <Ionicons name="ios-checkmark-outline" size={22} color="#0072B1" />
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default ConnectionRequest

const styles = StyleSheet.create({})