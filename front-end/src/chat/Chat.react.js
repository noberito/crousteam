import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';

const Chat = () => {
    const [messages1, setMessages1] = useState(['salut', 'oui et toi']);
    const [messages2, setMessages] = useState(['ca va ?']);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim() !== '') {
            setMessages([...messages, inputText]);
            setInputText('');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={messages1}
                renderItem={({ item }) => <Text>{item}</Text>}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    style={{ flex: 1, height: 40, borderWidth: 1, marginRight: 10 }}
                    value={inputText}
                    onChangeText={setInputText}
                />
                <Button title="Send" onPress={handleSend} />
            </View>
        </View>
    );
};

export default Chat;
