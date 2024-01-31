import React, {useState, useContext} from 'react';
import { Text, Button, View, StyleSheet } from 'react-native';
import CrousteamButton from '../common/CrousteamButton.react';
import LogOutButton from '../common/LogoutButton.react';
import AppContext from '../common/appcontext';

import GeneralSettingsView from '../generalSettings/GeneralSettingsView.react';
import ChangePreferencesView from '../changePreferences/changePreferencesView.react';
import BottomBar from '../friender/BottomBar.react';
import Line from '../common/Line.react';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 16,
        justifyContent: "space-between"
    },

    identityContainer: {
        
        justifyContent: 'center',
        alignItems: 'center', // Center the content horizontally
    },
    buttonContainer: {
        // This will also take the necessary space but allow other elements to grow
        // Removed the flex: 2 for the same reason as above
        marginTop: 16, // Add some margin at the top for spacing
        justifyContent:'center',
        alignItems:'center',
    },
    logoutContainer: {
        justifyContent:'center',
        alignItems:'center',
        // This ensures the logout button sticks to the bottom
        // Removed justifyContent: 'center' to align the logout button at the top of its container
    },
    footer: {
        // Ensure the footer is always at the bottom
        // FlexBasis removed to allow the footer to grow with its content up to 8% of the container
        // If the BottomBar component has its own padding, this might not be necessary
        height: '8%', // You can use height instead of flexBasis for a fixed height footer
    },
});


export default function MyProfileView({logoutUser}) {
    const {page, setPage} = useContext(AppContext)
    return (
        <View style={styles.mainContainer}>
            <View style = {styles.identityContainer}>
                <Text> Prout </Text>
            </View>
        <View style={styles.buttonContainer}>
            <CrousteamButton title = "General Settings" onPress= {() => {setPage("generalsettings")}}/>
            <CrousteamButton title = "Change Preferences" onPress = {() => {setPage("changepreferences")}}/>
        </View>
        <View style = {styles.logoutContainer}>
            <LogOutButton title = "Log Out" onPress = {logoutUser}/>
        </View>
        <View style={styles.footer}>
            <BottomBar page={page} setPage={setPage}/>
        </View>
        </View>
    )};