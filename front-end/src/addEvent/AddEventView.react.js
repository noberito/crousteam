import React, { useEffect, useState, useContext, useCallback, useSyncExternalStore } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { baseUrl } from '../common/const';
import axios from 'axios';
import CrousteamButton from '../common/CrousteamButton.react';
import AppContext from '../common/appcontext';
import ReturnButton from '../common/ReturnButton.react';
import CrousteamCard from '../common/CrousteamCard.react';
import colors from '../common/Colors.react';
import CrousteamTextInput from '../common/CrousteamTextInput.react';

const styles = StyleSheet.create({
    mainContainer :{
        justifyContent:"",
        flex:1
    },
    title:{
        fontFamily:'Arista-Pro-Alternate-Bold-trial',
        fontSize:40,
        marginBottom:20,
        color:colors.secondaryText
    },
    titleContainer:{
        alignItems:'center'
    },
    buttonContainer:{
        alignItems:"center"
    },
    preferenceContainer:{
        backgroundColor:colors.background,
        height:'auto',
        width:'auto',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        elevation: 3, // for Android
        shadowColor: colors.secondaryText,
        shadowOffset: { width: 0, height: 7 },
    }
}
)



export default function AddEventView({}){

    const {setPage, authToken} = useContext(AppContext)
    const [name, setName] = useState("")
    const [location, setLocation] = useState("")
    const [day, setDay] = useState("")
    const [time, setTime] = useState("")
    const [preferences, setPreferences] = useState([]);
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
                const parsedData = response.data.map(preferences => ({
                    name:preferences[0], selected:0
                }));
                setHasFailure(false)
                setPreferences(parsedData)
                
            } else {
                setHasFailure(true)
            }
        }).catch(err => {
            console.error(`something went wrong ${err.message}`)
            setIsLoading(false)
            setHasFailure(true)
        })
    };

    useEffect(() => {
        getPreferences();
    }, [authToken]);

    const renderItem = ({item}) => {
        console.log(item.selected)
        return(
        <TouchableOpacity style={[styles.preferenceContainer, {backgroundColor: (item.selected === 1) ? colors.primaryText : colors.background }]} onPress ={() => {item.selected = 1 - item.selected} }>
            <Text style={[styles.preference, ]}> {item.name} </Text>
        </TouchableOpacity>
    )}

    return(
        <View style={styles.mainContainer}>
            <ReturnButton onPress = {() => {setPage('listevent')}}/>
            <CrousteamCard>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}> NEW EVENT </Text>
                </View>
                <CrousteamTextInput onChangeText={(text)=> {setName(text)}}label = "Name" placeholder ="Enter a name"/>
                <CrousteamTextInput onChangeText={(text)=> {setLocation(text)}} label = "Location" placeholder ="Enter a Location"/>
                <CrousteamTextInput onChangeText={(text)=> {setDay(text)}} label = "Day" placeholder ="Enter a day"/>
                <CrousteamTextInput onChangeText={(text)=> {setTime(text)}} label = "Time" placeholder ="Enter a time"/>
                <View>
                <FlatList
                    data={preferences}
                    keyExtractor={(index) => {index.name}}
                    renderItem={renderItem}
                    numColumns={3}/>
                </View>
                <View style={styles.buttonContainer}>
                    <CrousteamButton title="ADD EVENT"/>
                </View>
            </CrousteamCard>
            
        </View>
    );
}