import { View, Text, StyleSheet, ScrollView, Modal, TextInput, TouchableOpacity } from "react-native";
import { useEffect, useState, useRef } from 'react';
import { Colors } from "../contants";
import ConversationList from './ConversationList.jsx'
import axios from '../../services/axiosInterceptor.jsx';
import { useIsFocused } from '@react-navigation/native';
import { Display } from "../utils";
import { setReviewNotificationBadge } from "../../src/features/notificationSlice";
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { io } from "socket.io-client";




export default function Conversations({ navigation }) {

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    const isFocused = useIsFocused();
    const dispatch = useDispatch()

    const [conversations, setConversations] = useState([])
    const [restaurants, setRestaurants] = useState([])





    const getConvos = async () => {
        try {
            const { data } = await axios.get(`http://${apiUrl}:3000/api/messages/customer/conversations`)
            const uniqueConversationsMap = {};
            for (const conversation of data) {
                const { customerId, createdAt } = conversation;
                if (!uniqueConversationsMap[customerId] || new Date(createdAt) > new Date(uniqueConversationsMap[customerId].createdAt)) {
                    uniqueConversationsMap[customerId] = conversation;
                }
            }
            const uniqueConvos = Object.values(uniqueConversationsMap);
            const sortedConvos = uniqueConvos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            setConversations(sortedConvos)
        } catch (error) {
            console.log(error)
            if (error.response.status === 403 || error.response.status === 401) {
                localStorage.clear()
                navigate('/')
            }
        }
    }

    const findRestaurantName = async () => {
        try {

            const { data } = await axios.get(`http://${apiUrl}:3000/api/restaurants`)
            setRestaurants(data)

        } catch (error) {
            console.log(error)
        }
    }


    const handleButtonPress = (conversation, restaurants) => {
        navigation.navigate("Messages", { conversation, restaurants });

    };


    useEffect(() => {
        if (isFocused) {
            getConvos()
            findRestaurantName()
        }



    }, [isFocused])



    return (

        <View style={styles.container}>
            <ScrollView
                style={styles.constainer2}
                contentContainerStyle={styles.scrollViewContent}

            >
                {conversations.map((conversation) => (
                    <View key={conversation} style={styles.card}
                    >

                        <ConversationList conversation={conversation} restaurants={restaurants}
                            onPress={(conversation) => handleButtonPress(conversation, restaurants)} ></ConversationList>
                    </View>
                ))}


            </ScrollView>
            <View style={styles.topedite}></View>

        </View>
    )


}


const styles = StyleSheet.create({


    container: {
        flex: 1,
        backgroundColor: Colors.primaryBlackHex,


    },
    constainer2: {
        flex: 1,
        backgroundColor: Colors.DARK_ONE,
        marginTop: -150,

    },
    topedite: {
        marginTop: 100,

    },
    scrollViewContent: {
        paddingVertical: 100,
    },
    card: {
        borderRadius: 10,
        margin: 5,
        padding: 2,
        width: Display.setWidth(90),
        marginBottom: 100,

    },

})