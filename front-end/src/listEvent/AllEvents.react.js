import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import EventIcon from './EventIcon.react';

const styles = StyleSheet.create({
    
});



export default function AllEvents({}){

    const EventList = [
        { id: '1', title: 'Implant capilaire', description: 'Cette technique marche !'},
        { id: '2', title: 'Fabien Coehlo', description: 'Tu connais PSQL ?'}]
    
    const renderEventItem = ({item}) => {return(<EventIcon item={item}></EventIcon>)}

    return(
            <FlatList
                data={EventList}
                keyExtractor={(item) => item.id}
                renderItem={renderEventItem}
                numColumns={2}
            />
)};