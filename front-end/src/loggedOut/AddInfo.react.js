import React, { useState } from 'react';

import { Button, View, Text, StyleSheet } from 'react-native';

import KivTextInput from '../common/KivTextInput.react';

import KivCard from '../common/KivCard.react';



import axios from 'axios';

import { baseUrl } from '../common/const';



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

});



export default function CreateAccount({ onSuccess, onCancel }) {

    const [username, setUsername] = useState('newUser');

    const [password, setPassword] = useState('bien');

    const [gender, setGender] = useState('metro')

    const [isLoading, setIsLoading] = useState(false);

    const [hasFailure, setHasFailure] = useState(false);



    const sendUserCreationRequest = () => {

        setIsLoading(true);

        axios({

            baseURL: baseUrl,

            url: '/profile',

            method: 'POST',

            data: { lid: 'integer', pseudo: 'varchar', naissance: 'date TS', photopath: 'varchar' } // TODO   

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



    return (

        <KivCard>

            <View

                style={styles.titleContainer}>

                <Text

                    style={styles.title}>

                    Add Information

                </Text>

            </View>

            {hasFailure && <View style={styles.incorrectWarning}>

                <Text

                    style={styles.inputLabel}>

                    Something went wrong while creating the user

                </Text>

            </View>}

            <KivTextInput label="INFO 1" value={username} onChangeText={value => setUsername(value)} />

            <KivTextInput label="INFO 2" value={password} onChangeText={value => setPassword(value)} />

            <KivTextInput label="INFO 3" value={gender} onChangeText={value => setGender(value)} />

            <View style={styles.buttonRow}>

                <View style={styles.button}>

                    <Button title="< Login" disabled={isLoading} onPress={() => { onCancel(); }} />

                </View>

                <View style={styles.button}>

                    <Button title="Create Account" disabled={isLoading} onPress={() => { sendUserCreationRequest(); }} />

                </View>

            </View>

        </KivCard>

    );

}