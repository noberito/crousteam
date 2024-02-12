import React, { useEffect, useState, useContext, useCallback, useSyncExternalStore } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { baseUrl } from '../common/const';
import axios from 'axios';
import CrousteamButton from '../common/CrousteamButton.react';
import AppContext from '../common/appcontext';
import ReturnButton from '../common/ReturnButton.react';
import CrousteamCard from '../common/CrousteamCard.react';
import colors from '../common/Colors.react';
import CrousteamTextInput from '../common/CrousteamTextInput.react';

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: "",
        flex: 1
    },
    title: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial',
        fontSize: 40,
        marginBottom: 20,
        color: colors.secondaryText
    },
    titleContainer: {
        alignItems: 'center'
    },
    buttonContainer: {
        alignItems: "center"
    },
    preferenceContainer: {
        backgroundColor: colors.background,
        height: 'auto',
        width: 'auto',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        elevation: 3, // for Android
        shadowColor: colors.secondaryText,
        shadowOffset: { width: 0, height: 7 },
    },
    preference: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial'
    }
}
)



export default function AddEventView({ }) {

    const { setPage, authToken, username } = useContext(AppContext)
    const [selectedPreferences, setSelectedPreferences] = useState({})
    const [name, setName] = useState("")
    const [location, setLocation] = useState("")
    const [date, setDate] = useState(new Date())
    const [duration, setDuration] = useState("")
    const [preferences, setPreferences] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasFailure, setHasFailure] = useState(false);
    const [isPosting, setIsPosting] = useState(false)
    const [postError, setPostError] = useState(false);

    const postEvent = () => {
        setIsPosting(true)
        console.log(username, name, location, date, duration)
        axios({
            baseURL: baseUrl,
            url: '/event',
            method: 'POST',
            headers: { Authorization: 'Bearer ' + authToken },
            data: {
                login: username,
                ename: name,
                eloc: location,
                edate: date,
                etime: duration,
                eduree: duration, // Ajustez le nom de cette propriété selon votre API
            }
        }).then(response => {
            setIsPosting(false);
            if (response.status === 200 || response.status === 201) {
                // Message posté avec succès
                console.log('Event posted successfully');
                // Vous pouvez ici actualiser la liste des messages ou gérer la réponse comme souhaité
            } else {
                // Gérer d'autres codes de statut selon votre API
                setPostError(true);
            }
        }).catch(err => {
            console.error(`Something went wrong while posting the event: ${err.message}`);
            setIsPosting(false);
            setPostError(true);
        });
    }; // Ajoutez d'autres dépendances si nécessaire

    const getPreferences = () => {
        setIsLoading(true);
        axios({
            baseURL: baseUrl,
            url: '/all-possible-preferences-with-id',
            method: 'GET',
        }).then(response => {
            setIsLoading(false)
            if (response.status >= 200 && response.status < 300) {
                const parsedData = response.data.map(preferences => ({
                    id: preferences[0], name: preferences[1]
                }));
                setHasFailure(false)
                setPreferences(parsedData)

            } else {
                setHasFailure(true)
            }
        }).catch(err => {
            console.error(`something went wrong ${err.message}`)
            setIsLoading(false)
            setHasFailure(true)
        })
    };

    useEffect(() => {
        getPreferences();
    }, [authToken]);

    const toggleItemSelection = (id) => {
        setSelectedPreferences((prevSelectedItems) => ({
            ...prevSelectedItems,
            [id]: !prevSelectedItems[id], // Basculer la sélection
        }));
    };

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={[styles.preferenceContainer, { backgroundColor: (selectedPreferences[item.id]) ? colors.primaryText : colors.background }]}
                onPress={() => { toggleItemSelection(item.id) }}>
                <Text style={styles.preference}> {item.name} </Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <ReturnButton onPress={() => { setPage('listevent') }} />
            <CrousteamCard>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}> NEW EVENT </Text>
                </View>
                <CrousteamTextInput onChangeText={(text) => { setName(text) }} label="Name" placeholder="Enter a name" />
                <CrousteamTextInput onChangeText={(text) => { setLocation(text) }} label="Location" placeholder="Enter a Location" />
                <CrousteamTextInput onChangeText={(text) => { setDuration(text) }} label="Duration" placeholder="Enter a duration" />
                <View>
                    <FlatList
                        data={preferences}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        numColumns={3} />
                </View>
                <View style={styles.buttonContainer}>
                    <CrousteamButton title="ADD EVENT" onPress={() => { postEvent(), setPage("listevent") }} />
                </View>
            </CrousteamCard>

        </View>
    );
}