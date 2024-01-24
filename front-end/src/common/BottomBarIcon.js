import React from 'react'
import { Button, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const iconStyles = StyleSheet.create({
    iconContainer:{
        
    },
    image:{
        height:90,
        width:90
    }
});

const BottomBarIcon = ({imagePath, title, onPress}) => {
    return(
        <View>
            <TouchableOpacity onPress={onPress}>
                <Image style = {iconStyles.image}source={imagePath}></Image>
            </TouchableOpacity>
        </View>
    )
};

export default BottomBarIcon;