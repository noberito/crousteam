import React, { useContext, useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import CrousteamTextInput from '../common/CrousteamTextInput.react';
import CrousteamCard from '../common/CrousteamCard.react';
import axios from 'axios';
import { baseUrl } from '../common/const';
import AppContext from '../common/appcontext';
import colors from '../common/Colors.react';
import CrousteamButton from '../common/CrousteamButton.react';

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
        padding: 2
    },
    Text: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial',
        fontSize: 20,
    }

});

export default function CreateAccount({ onSuccess, onCancel }) {

    const { lastUid, setLastUid, username, password } = useContext(AppContext);

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
            url: '/register',
            method: 'POST',
            data: { login: username, password: password, firstName: firstName, lastName: lastName, naissance: naissance, photoPath: photopath, bio: biography } // TODO   
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
        <CrousteamCard>
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
            <CrousteamTextInput label="First Name" value={firstName} onChangeText={value => setFirstName(value)} />
            <CrousteamTextInput label="Last Name" value={lastName} onChangeText={value => setLastName(value)} />
            <CrousteamTextInput style={{ fontFamily: 'sans-serif' }} label="Birth date" value={naissance} onChangeText={value => setNaissance(value)} />
            <CrousteamTextInput label="Photo" value={photopath} onChangeText={value => setPhotopath(value)} />
            <CrousteamTextInput label="Biography" value={biography} onChangeText={value => setBiography(value)} />


            <View style={styles.buttonRow}>
                <View style={styles.button}>
                    <CrousteamButton title="< Login" disabled={isLoading} styleText={styles.Text} onPress={() => { onCancel(); }} />
                </View>
                <View style={styles.button}>
                    <CrousteamButton title="Create Account" disabled={isLoading} styleText={styles.Text} onPress={() => { sendUserCreationRequest(); }} />
                </View>
            </View>
        </CrousteamCard>
    );
}