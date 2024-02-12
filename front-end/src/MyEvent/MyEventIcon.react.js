import React, { useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from '../common/Colors.react';
import AppContext from '../common/appcontext';

const styles = StyleSheet.create({
    mainContainer: {
        width: '50%',
        height: 'auto',
        backgroundColor: colors.background,
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        elevation: 3, // for Android
        shadowColor: colors.secondaryText,
        shadowOffset: { width: 0, height: 7 },
    },
    image: {
        width: '48%',
        height: '48%',
    },
    eventtitle: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial',
        fontSize: 30,
        color: colors.primaryText
    },
    description: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial',
        fontSize: 20,
        color: colors.secondaryText
    },
    loc: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial',
        color: 'black'
    }
})

export default function EventIcon({ item, setGid }) {

    const { page, setPage } = useContext(AppContext)

    return (
        <TouchableOpacity style={styles.mainContainer} onPress={() => { setGid(item.gid); setPage("myeventdisplay") }}>
            <Image source={require('../loggedOut/ic_launcher_round.png')}></Image>
            <Text style={styles.eventtitle}> {item.title} </Text>
            <Text style={styles.description}> {item.description} </Text>
            <Text style={styles.loc}> {item.loc} </Text>
            <Text> {item.date} {item.duration} </Text>
        </TouchableOpacity>
    )
};