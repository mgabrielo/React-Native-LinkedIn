import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios'

const UserProfile = ({ item, userId }) => {
    const [connectionSent, setConnectionSent] = useState(false)
    const sendConnectionRequest = async (currentUserId, selectedUserId) => {
        try {
            const data = {
                currentUserId,
                selectedUserId
            }
            await axios.post('https://00ea-217-43-47-167.ngrok-free.app/connection-request', data).then((res) => {
                if (res.status === 200) {
                    setConnectionSent(true)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View
            style={{
                flex: 1,
                borderRadius: 9,
                marginHorizontal: 16,
                borderColor: '#E0E0E0',
                borderWidth: 1,
                marginVertical: 10,
                justifyContent: 'center',
                height: Dimensions.get('window').height / 3,
                width: (Dimensions.get('window').width - 80) / 2
            }}
        >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    style={{
                        width: 90,
                        height: 90,
                        borderRadius: 45,
                        resizeMode: 'cover'
                    }}
                    source={{ uri: item?.profileImage }}
                />
            </View>
            <View style={{ marginTop: 5 }}>
                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '500', }}>{item?.name}</Text>
                <Text style={{
                    textAlign: 'center',
                    marginTop: 2,
                    marginLeft: 1
                }}
                >
                    Engineer Graduate | Linked In Member
                </Text>
                <Pressable style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderColor: connectionSent || item?.connectionRequests?.includes(userId) ? 'gray' : '#0072B1',
                    borderWidth: 1,
                    borderRadius: 25,
                    marginTop: 7,
                    paddingHorizontal: 15,
                    paddingVertical: 4
                }}
                    onPress={() => sendConnectionRequest(userId, item._id)}
                >
                    <Text style={{
                        fontWeight: '600',
                        color: connectionSent || item?.connectionRequests?.includes(userId) ? 'gray' : '#0072B1'
                    }}
                    >
                        {connectionSent || item?.connectionRequests?.includes(userId) ? 'Pending' : 'Connect'}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

export default UserProfile

const styles = StyleSheet.create({})