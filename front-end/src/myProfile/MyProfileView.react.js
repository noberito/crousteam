import React, {useState} from 'react';
import { Text, Button, View, StyleSheet } from 'react-native';

import GeneralSettingsView from './GeneralSettingsView.react';
import ChangePreferencesView from './changePreferencesView.react';
import BottomBar from '../friender/BottomBar.react';

const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        padding:16,
        justifyContent:"space-between"
      },
    footer: {
        flexBasis:100,
      }
});


export default function MyProfileView({username, page, setPage}) {
    const [choosePageProfile, setChoosePageProfile] = useState("myprofile");
        if (choosePageProfile== "myprofile"){
            return (
                 <View style={styles.mainContainer}>
                    <Button title = "General Settings" onPress= {() => {setChoosePageProfile("generalsettings")}}></Button>
                    <Button title = "Change Preferences" onPress = {() => {setChoosePageProfile("changepreferences")}}></Button>
                    <View style={styles.footer}>
                        <BottomBar page={page} setPage={setPage}/>
                    </View>
                </View>
                    )}
        if (choosePageProfile == "generalsettings"){
            return(
                <View>
                    <GeneralSettingsView></GeneralSettingsView>
                    <Button title = "Retour" onPress= {() => {setChoosePageProfile("myprofile")}}></Button>
                </View>
                )
            }
        if (choosePageProfile == "changepreferences"){
            return(
                <View>
                    <ChangePreferencesView></ChangePreferencesView>
                    <Button title = "Retour" onPress= {() => {setChoosePageProfile("myprofile")}}></Button>
                </View>
                )
            }
        
    
}