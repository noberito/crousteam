import React, { useContext, useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import KivTextInput from '../common/CrousteamTextInput.react';
import KivCard from '../common/CrousteamCard.react';
import axios from 'axios';
import { baseUrl } from '../common/const';
import AppContext from '../common/appcontext';


export default function AddPreferences({ onSuccess, onCancel }) {


    const data = [
        { id: '1', title: 'Sport', image: require('../images/sport.png') },
        { id: '2', title: 'History', image: require('../images/history.png') },
        { id: '3', title: 'Politics', image: require('../images/elections.jpg') },
        // Ajoute d'autres éléments selon tes besoins
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleEventPress(item.id)}>
            <View style={[styles.itemContainer, selectedImage === item.id && styles.selectedItem]}>
                <Image source={item.image} style={styles.itemImage} />
                <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    const { lastUid, setLastUid, username, password } = useContext(AppContext);

    const [info, setInfo] = useState();
    const [firstName, setFirstName] = useState('');
    const [naissance, setNaissance] = useState('');
    const [photopath, setPhotopath] = useState('');
    const [lastName, setLastName] = useState('');
    const [biography, setBiography] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [hasFailure, setHasFailure] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);

    const handleEventPress = (imageId) => {
        setSelectedImage(imageId);
        // Tu peux faire d'autres actions en fonction de l'image cliquée
    };

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
                setInfo(response.data)
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

    useEffect(() => {
        getPreferences()
    }, []);




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
    });

    return (
        <View>
            <Text> {info}</Text>
            <KivCard>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Add Information</Text>
                </View>
                {hasFailure && <View style={styles.incorrectWarning}>
                    <Text style={styles.inputLabel}>Something went wrong while creating the user</Text>
                </View>}

                <FlatList
                    data={data}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />

                <View style={styles.buttonRow}>
                    <View style={styles.button}>
                        <Button title="< Login" disabled={isLoading} onPress={() => { onCancel(); }} />
                    </View>
                    <View style={styles.button}>
                        <Button title="Continue" disabled={isLoading} onPress={() => { sendUserCreationRequest(); }} />
                    </View>
                </View>
            </KivCard>
        </View>
    );

}
