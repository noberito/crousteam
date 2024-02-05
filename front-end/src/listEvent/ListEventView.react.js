import React, {useContext, useCallback, useState} from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import BottomBar from '../friender/BottomBar.react';
import AppContext from '../common/appcontext';
import AllEvents from './AllEvents.react';

const styles = StyleSheet.create({
    header:{
        justifyContent:'center',
        alignItems:'center',
        height:'5%'
      },
    footer: {
        flexBasis: '8%',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    mainContainer: {
        flex: 1,
        padding: 16,
        justifyContent: "space-between"
      },
});



export default function ListEventView({ }) {
    const {page, setPage} = useContext(AppContext)

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <Image source={require('../loggedOut/ic_launcher_round.png')}></Image>
            </View>
            <View style={{height:'78%'}}>
                <AllEvents/>
            </View>
            <View style={styles.footer}>
                <BottomBar page={page} setPage={setPage} />
            </View>
        </View>
    );
};