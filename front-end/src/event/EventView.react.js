import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import BottomBar from '../friender/BottomBar.react';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    eventItem: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2, // Pour l'ombre sur Android
    },
    eventImage: {
        width: 100,
        height: 100,
    },
    eventInfo: {
        flex: 1,
        padding: 12,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    eventDescription: {
        color: '#555555',
    },
    mainContainer: {
        flex: 1,
        padding: 16,
        justifyContent: "space-between"
    },
    footer: {
        flexBasis: '8%',
    }
});

const EventList = [
    { id: '1', title: 'Implant capilaire', description: 'Cette technique marche !'},
    { id: '2', title: 'Fabien Coehlo', description: 'Tu connais PSQL ?'},
    // ... Autres événements
];

export default function EventView({ navigation, page, setPage }) {
    const handleEventPress = (eventId) => {
        // Navigation vers la page détaillée de l'événement avec l'ID de l'événement
        navigation.navigate('EventDetails', { eventId });
    };

    const renderEventItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleEventPress(item.id)}>
            <View style={styles.eventItem}>
                <Image source={item.image} style={styles.eventImage} />
                <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventDescription}>{item.description}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={EventList}
                keyExtractor={(item) => item.id}
                renderItem={renderEventItem}
            />
            <View style={styles.footer}>
                <BottomBar page={page} setPage={setPage} />
            </View>
        </View>
    );
};