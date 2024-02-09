import React, { useState, useContext, useEffect } from 'react';

import { Text, Button, View, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

import AppContext from '../common/appcontext';

import CrousteamButton from '../common/CrousteamButton.react';

import colors from '../common/Colors.react';
import axios from 'axios';

import { baseUrl } from '../common/const';
import CrousteamCard from '../common/CrousteamCard.react';
import ReturnButton from '../common/ReturnButton.react';



export default function GeneralSettingsView() {



    const [preferences, setPreferences] = useState([]);

    const [selectedPreferences, setSelectedPreferences] = useState('');

    const [userPref, setUserPref] = useState([]);

    const [preferencesList, setPreferencesList] = useState([]);

    const { username, setUsername, setPage, authToken } = useContext(AppContext);

    const [test, setTest] = useState([]);



    const getPreferences = () => {

        setIsLoading(true);

        axios({

            baseURL: baseUrl,

            url: '/all-possible-preferences/',

            method: 'GET',

        }).then(response => {

            setIsLoading(false)

            if (response.status >= 200 && response.status < 300) {

                setHasFailure(false)

                setPreferences(response.data)

                console.log(response.data)

            } else {

                setHasFailure(true)

            }

        }).catch(err => {

            console.error(`something went wrong ${err.message}`)

            setIsLoading(false)

            setHasFailure(true)

        })

    }



    const getUserPreferences = () => {

        setIsLoading(true);

        axios({

            baseURL: baseUrl,

            url: `/preferences-for-given-user/${username}`,

            method: 'GET',

        }).then(response => {

            setIsLoading(false)

            if (response.status >= 200 && response.status < 300) {

                setHasFailure(false)

                setSelectedPreferences(response.data.join(','))

                console.log(`les préférences sélectionnées sont ${response.data}`)

            } else {

                setHasFailure(true)

            }

        }).catch(err => {

            console.error(`something went wrong ${err.message}`)

            setIsLoading(false)

            setHasFailure(true)

        })

    }



    const SendPreferences = () => {

        setIsLoading(true);

        axios({
            baseURL: baseUrl,
            url: `/preferences`,
            method: 'PATCH',
            headers: { Authorization: 'Bearer ' + authToken },
            data: {

                list_pftype: selectedPreferences.split(',')

            }

        }).then(response => {

            setIsLoading(false)

            if (response.status >= 200 && response.status < 300) {


                setHasFailure(false)

            } else {

                setHasFailure(true)

            }

        }).catch(err => {

            console.error(`something went wrong ${err.message}`)

            setIsLoading(false)

            setHasFailure(true)

        })

    }



    useEffect(() => {

        getPreferences()

        getUserPreferences()

    }, []);



    const renderPreferenceItem = ({ item }) => (

        <TouchableOpacity
            style={[styles.preferenceItem, { backgroundColor: selectedPreferences.includes(item) ? colors.primaryText : colors.background }]}
            onPress={() => handlePreferenceClick(item)}
        >
            <Text style={[styles.preferenceText, { color: selectedPreferences.includes(item) ? colors.background : colors.primaryText }]}>{item}</Text>
        </TouchableOpacity>

    );



    const renderRow = ({ item }) => (

        <FlatList

            data={item}

            keyExtractor={(subItem, index) => index.toString()}

            renderItem={renderPreferenceItem}

            horizontal

        />

    );



    const handlePreferenceClick = (clickedPreference) => {

        setSelectedPreferences((prevSelected) => {

            const preferencesArray = prevSelected.split(',').filter(item => item.trim() !== '');



            console.log('Avant :', preferencesArray);

            console.log('clickedPreference :', clickedPreference);



            // Si clickedPreference est un tableau, utilisons le premier élément

            const cleanPreference = Array.isArray(clickedPreference) ? clickedPreference[0] : clickedPreference;



            const index = preferencesArray.indexOf(cleanPreference.trim());



            if (index !== -1) {

                // L'item est déjà sélectionné, donc retirons-le

                preferencesArray.splice(index, 1);

            } else {

                // L'item n'est pas encore sélectionné, ajoutons-le

                preferencesArray.push(cleanPreference);

            }



            console.log('Après :', preferencesArray);



            // Retournons la chaîne résultante

            return preferencesArray.join(',').trim();

        });

    };



    const chunkArray = (array, size) => {

        const chunkedArray = [];

        for (let i = 0; i < array.length; i += size) {

            chunkedArray.push(array.slice(i, i + size));

        }

        return chunkedArray;

    };



    const preferencesRows = chunkArray(preferences, 3);



    const [isLoading, setIsLoading] = useState(false);

    const [hasFailure, setHasFailure] = useState(false);



    const styles = StyleSheet.create({

        titleContainer: {

            paddingBottom: 16,

            alignItems: 'center',

            width: '100%'

        },

        title: {

            fontSize: 40,
            fontFamily: 'Arista-Pro-Alternate-Bold-trial',
            color: colors.secondaryText,
            marginBottom: 10

        },

        incorrectWarning: {

            backgroundColor: '#FF8A80',

            padding: 4,

            borderRadius: 4,

            marginBottom: 4,

        },

        buttonRow: {
            flexDirection: 'row'
        },
        button: {
            flexGrow: 1,
            padding: 2,
            alignItems: 'center'
        },
        itemContainer: {
            flex: 1 / 2, // Trois éléments par ligne
            margin: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        selectedItem: {

            // Couleur de la bordure lorsqu'il est sélectionné
            borderWidth: 2, // Largeur de la bordure lorsqu'il est sélectionné
            color: colors.secondaryText, // Couleur du texte lorsqu'il est sélectionné
        },

        preferenceItem: {
            flex: 1,
            margin: 8,
            borderRadius: 8,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 3, // for Android
            shadowColor: colors.primaryText,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            height: 'auto',

        },
        preferenceText: {
            padding: 20,
            fontSize: 16,
            fontFamily: 'Arista-Pro-Alternate-Bold-trial',
            textAlign: 'center',
        },
        imageContainer: {
            alignItems: 'center',
            marginBottom: 20
        },
        Text: {
            fontFamily: 'Arista-Pro-Alternate-Bold-trial',
            fontSize: 24,
        }

    });



    return (

        <View>
            <ReturnButton onPress={() => { setPage("myprofile") }} title="Retour"></ReturnButton>
            <View style={styles.imageContainer}>
                <Image source={require('../loggedOut/ic_launcher_round.png')} />
            </View>
            <CrousteamCard>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}> YOUR PREFERENCES </Text>
                </View>
                {hasFailure && <View style={styles.incorrectWarning}>
                    <Text style={styles.inputLabel}>Something went wrong while creating the user</Text>
                </View>}
                <FlatList
                    data={preferences}
                    keyExtractor={(index) => index.toString()}
                    renderItem={renderRow}
                    numColumns={3}
                />
                <View style={styles.buttonRow}>
                    <View style={styles.button}>
                        <CrousteamButton title="CHANGE PREFERENCES" disabled={isLoading} styleText={styles.Text} onPress={() => { SendPreferences(); }} />
                    </View>
                </View>
            </CrousteamCard>
        </View>

    );



}