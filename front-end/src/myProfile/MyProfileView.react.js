import React, {useState} from 'react';
import { Text, Button, View, StyleSheet } from 'react-native';
import CrousteamButton from '../common/CrousteamButton.react';
import LogOutButton from '../common/LogoutButton.react';

import GeneralSettingsView from '../generalSettings/GeneralSettingsView.react';
import ChangePreferencesView from '../changePreferences/changePreferencesView.react';
import BottomBar from '../friender/BottomBar.react';
import Line from '../common/Line.react';

const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        padding:16,
        justifyContent:"space-between",
      },

    identityContainer:{
        flex:3,
        justifyContent:'center'
    },
    buttonContainer :{
        flex:2,
    },
    logoutContainer:{
        justifyContent:'center',
    },
    footer: {
        flexBasis:"8%",
      }
});


export default function MyProfileView({username, page, setPage, logoutUser}) {
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