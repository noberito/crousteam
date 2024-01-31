import React, { useContext, useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import KivTextInput from '../common/CrouisteamTextInput.react';
import KivCard from '../common/CrousteamCard.react';
import axios from 'axios';
import { baseUrl } from '../common/const';
import AppContext from '../common/appcontext';

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

    const { lastUid, setLastUid, username, setUsername } = useContext(AppContext);

    const [pseudo, setPseudo] = useState('');
    const [firstName, setFirstName] = useState('');
    const [naissance, setNaissance] = useState('');
    const [photopath, setPhotopath] = useState('');
    const [lastName, setLastName] = useState('');
    const [biography, setBiography] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [hasFailure, setHasFailure] = useState(false);

    const sendUserCreationRequest = () => {
        setIsLoading(true);
        axios({
            baseURL: baseUrl,
            url: `/profile/${username}`,
            method: 'POST',
            data: { lid: lastUid, firstName: firstName, lastName: lastName, naissance: naissance, photoPath: photopath, bio: biography } // TODO   
        }).then(response => {
            setIsLoading(false)
            if (response.status >= 200 && response.status < 300) {
                setHasFailure(false)
                setLastUid()
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
            <KivTextInput label="First Name" value={firstName} onChangeText={value => setFirstName(value)} />
            <KivTextInput label="Last Name" value={lastName} onChangeText={value => setLastName(value)} />
            <KivTextInput label="Birth date" value={naissance} onChangeText={value => setNaissance(value)} />
            <KivTextInput label="Photo" value={photopath} onChangeText={value => setPhotopath(value)} />
            <KivTextInput label="Biography" value={biography} onChangeText={value => setBiography(value)} />


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