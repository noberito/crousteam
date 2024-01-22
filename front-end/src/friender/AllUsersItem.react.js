import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


import DefaultProfilePicture from './DefaultProfilePicture.react';

const styles = StyleSheet.create({
    profilePicture: {
        width: 24,
        height: 24,
    },
    userRow: {
        flexDirection: 'row',
    }
});

/**
 * @typedef {{name:string, isAdmin:boolean}} User
 * @param {User} item
 */
export default function AllUsersItem({item}) {
    return (
        <View style={styles.userRow}>
            {item.picture != null
                // We do not store the user's picture yet on the DB
                ? <Image
                    style={styles.profilePicture}
                    source={{ uri: item.picture }}
                />
                : <DefaultProfilePicture style={styles.profilePicture} />
            }
            <Text>{item.name}</Text>
            <Text>{item.isAdmin ? ' - Admin' : null}</Text>
        </View>);
}
