import React, { useContext, useState, useEffect } from 'react';

import { Button, View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

import KivTextInput from '../common/CrousteamTextInput.react';

import KivCard from '../common/CrousteamCard.react';

import axios from 'axios';

import { baseUrl } from '../common/const';

import AppContext from '../common/appcontext';

import CrousteamButton from '../common/CrousteamButton.react';

 

export default function AddPreferences({ onSuccess, onCancel }) {

 

    const [preferences, setPreferences] = useState([]);

    const [selectedPreferences, setSelectedPreferences] = useState([]);




    const renderPreferenceItem = ({ item }) => (

        <TouchableOpacity

            style={[styles.preferenceItem, { backgroundColor: selectedPreferences.includes(item) ? '#4CAF50' : '#e0e0e0' }]}

            onPress={() => handlePreferenceClick(item)}

        >

            <Text style={styles.preferenceText}>{item}</Text>

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

 

    const handlePreferenceClick = (preference) => {

        // Si la préférence cliquée est déjà dans la liste des préférences sélectionnées, retire-la

        // Sinon, ajoute-la à la liste

 

        setSelectedPreferences((prevSelected) => {

            if (prevSelected.includes(preference)) {

                console.log(`La préférence "${preference}" a été retirée.`);

                return prevSelected.filter((item) => item !== preference);

            } else {

                console.log(`La préférence "${preference}" a été sélectionnée.`);

                return [...prevSelected, preference];

            }

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

 

    const { lastUid, setLastUid, username, password } = useContext(AppContext);

 

    const [isLoading, setIsLoading] = useState(false);

    const [hasFailure, setHasFailure] = useState(false);





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

 

    const SendPreferences = (list_preference) => {

        setIsLoading(true);

        axios({

            baseURL: baseUrl,

            url: `preferences/${username}`,

            method: 'POST',

            data: {

                list_pftype:

                    list_preference

            }

        }).then(response => {

            setIsLoading(false)

            if (response.status >= 200 && response.status < 300) {

                setHasFailure(false)

                onSuccess()

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

    }, []);

 

    const finalSend = () => {

        console.log(username);

        const M = [];

        for (let i = 0; i < selectedPreferences.length; i++) {

            M.push(selectedPreferences[i][0]);

        }

        SendPreferences(M);

    }





    const styles = StyleSheet.create({

        titleContainer: {

            paddingBottom: 16,

            alignItems: 'center',

            width: '100%'

        },

        title: {

            fontSize: 24,

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

            padding: 2

        },

        itemContainer: {

            flex: 1 / 2, // Trois éléments par ligne

            margin: 4,

            justifyContent: 'center',

            alignItems: 'center',

        },

        selectedItem: {

            borderColor: 'green', // Couleur de la bordure lorsqu'il est sélectionné

            borderWidth: 2, // Largeur de la bordure lorsqu'il est sélectionné

            color: 'green', // Couleur du texte lorsqu'il est sélectionné

        },

        itemImage: {

            width: '100%',

            height: 150,

            borderRadius: 8,

            marginBottom: 8,

        },

        itemTitle: {

            fontSize: 16,

            fontWeight: 'bold',

            textAlign: 'center',

        },

        preferenceItem: {

            flex: 1,

            margin: 8,

            borderRadius: 8,

            overflow: 'hidden',

            alignItems: 'center',

            justifyContent: 'center',

            height: 80,

        },

        preferenceText: {

            fontSize: 16,

            fontWeight: 'bold',

            textAlign: 'center',

        },

    });

 

    return (

        <View>

 

            <KivCard>

                <View style={styles.titleContainer}>

                    <Text style={styles.title}>Add Information</Text>

                    <Text> {username}</Text>

                </View>

                {

                    hasFailure && <View style={styles.incorrectWarning}>

                        <Text style={styles.inputLabel}>Something went wrong while creating the user</Text>

                    </View>

                }

 

                <FlatList

                    data={preferencesRows}

                    keyExtractor={(row, index) => index.toString()}

                    renderItem={renderRow}

                />

 

                <View style={styles.buttonRow}>

                    <View style={styles.button}>

                        <Button title="< Login" disabled={isLoading} onPress={() => { onCancel(); }} />

                    </View>

                    <View style={styles.button}>

                        <Button title="Continue" disabled={isLoading} onPress={() => { finalSend(); }} />

                    </View>

                </View>

            </KivCard >

        </View >

    );

 

}
