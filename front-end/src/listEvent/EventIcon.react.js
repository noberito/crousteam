import React, { useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from '../common/Colors.react';
import AppContext from '../common/appcontext';

const styles = StyleSheet.create({
    mainContainer:{
        width:'50%',
        height:100,
        backgroundColor: colors.background,
        borderRadius: 10,
        padding: 20,
        justifyContent:'center',
        alignItems:'center',
        margin: 10,
        elevation: 3, // for Android
        shadowColor: colors.secondaryText, 
        shadowOffset: { width: 0, height: 7 }, 
    },
    image:{
        width:'48%',
        height:'48%',
    },
    eventtitle:{
        fontFamily:'Arista-Pro-Alternate-Bold-trial',
        fontSize: 30,
        color:colors.primaryText
    },
    description:{
        fontFamily:'Arista-Pro-Alternate-Bold-trial',
        fontSize:10,
        color:colors.secondaryText
    },
    date:{
        fontSize:'Arista-Pro-Alternate-Bold-trial',
        color:'black'
    }
})

export default function EventIcon({item, log, setLog}){

    const {page, setPage} = useContext(AppContext)

    return(
        <View style={styles.mainContainer}>
        <TouchableOpacity onPress={() => {setLog(item.title); setPage("eventdisplay")}}>
            <Text style={styles.eventtitle}> {item.title} </Text>
        </TouchableOpacity>
        </View>
    )
};