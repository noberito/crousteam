import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Text, Button, View, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../common/const';
import CrousteamButton from '../common/CrousteamButton.react';
import LogOutButton from '../common/LogoutButton.react';
import AppContext from '../common/appcontext';
import colors from '../common/Colors.react';

import GeneralSettingsView from '../changePreferences/ChangePreferencesView.react';
import ChangePreferencesView from '../generalSettings/GeneralSettings.react';
import BottomBar from '../friender/BottomBar.react';
import Line from '../common/Line.react';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 16,
        justifyContent: "space-between"
    },

    identityContainer: {
        flexDirection: 'row',
        flexGrow: 0.4,
        justifyContent: 'space-between',
        alignItems: 'center', // Center the content horizontally
    },
    buttonContainer: {
        // This will also take the necessary space but allow other elements to grow
        // Removed the flex: 2 for the same reason as above
        marginTop: 16, // Add some margin at the top for spacing
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // This ensures the logout button sticks to the bottom
        // Removed justifyContent: 'center' to align the logout button at the top of its container
    },
    footer: {
        // Ensure the footer is always at the bottom
        // FlexBasis removed to allow the footer to grow with its content up to 8% of the container
        // If the BottomBar component has its own padding, this might not be necessary
        height: '8%', // You can use height instead of flexBasis for a fixed height footer
    },
    image: {
        width: '30%',
        height: '70%',
        marginLeft: '10%'
    },
    nameContainer: {
        marginRight: '10%'
    },
    name: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial',
        fontSize: 40,
        color: colors.primaryText

    },
    pseudo: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial',
        fontSize: 20,
        color: colors.secondaryText
    },
    Text: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial',
        fontSize: 24,
    }
});


export default function MyProfileView({ logoutUser }) {
    const { page, setPage, username, authToken } = useContext(AppContext)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [photoPath, setPhotoPath] = useState("src/images/myprofile.png")
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasPermissionError, setPermissionError] = useState(false);

    const getInfo = useCallback(() => {
        setIsLoading(true);
        // Set refreshing to true when we are loading data on pull to refresh
        setRefreshing(true);
        axios.get('/first-last-name-photo', {
            headers: { Authorization: 'Bearer ' + authToken },
        }).then(response => {
            console.log('AAA>', JSON.stringify(response.data));
            setIsLoading(false);
            setRefreshing(false); // Set refreshing to false when data is loaded
            if (response.status == 200) {
                setFirstname(response.data[0]);
                setLastname(response.data[1]);
                setPhotoPath(response.data[2]);
            }
            else if (response.status == 403) {
                setPermissionError(true);
            };
        }).catch(err => {
            console.error(`Something went wrong ${err.message}`);
            setIsLoading(false);
            setRefreshing(false);
        });
    }, [authToken]);

    useEffect(() => {
        getInfo();
    }, [authToken]);
    console.log(photoPath);
    return (
        <View style={styles.mainContainer}>
            <View style={styles.identityContainer}>
                <Image style={styles.image} source={{uri:photoPath}}></Image>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{firstname} {lastname} </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: colors.secondaryText, fontWeight: 'bold' }} >@</Text>
                        <Text style={styles.pseudo}>{username}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <CrousteamButton title="General Settings" styleText={styles.Text} onPress={() => { setPage("generalsettings") }} />
                <CrousteamButton title="Change Preferences" styleText={styles.Text} onPress={() => { setPage("changepreferences") }} />
            </View>
            <View style={styles.logoutContainer}>
                <LogOutButton title="Log Out" onPress={logoutUser} />
            </View>
            <View style={styles.footer}>
                <BottomBar page={page} setPage={setPage} />
            </View>
        </View>
    )
};