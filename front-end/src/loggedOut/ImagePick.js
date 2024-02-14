import {

    SafeAreaView,
  
    StyleSheet,
  
    Text,
  
    View,
  
    TouchableOpacity,
  
    Image,
  
  } from 'react-native';
  
  import {launchImageLibrary} from 'react-native-image-picker';
  
  import {font_semibold, primary_blue, quaternary_blue} from '../styles';
  
  import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
  
  import {faTrash} from '@fortawesome/free-solid-svg-icons';
  
   
  
  const KivImagePicker = ({filePaths, setFilePaths}) => {
  
    const chooseFile = type => {
  
      let options = {
  
        mediaType: type,
  
       maxWidth: 300,
  
        maxHeight: 550,
  
        quality: 1,
  
      };
  
      launchImageLibrary(options, response => {
  
        console.log('Response = ', response);
  
   
  
        if (response.didCancel) {
  
          alert('User cancelled camera picker');
  
          return;
  
        } else if (response.errorCode == 'camera_unavailable') {
  
          alert('Camera not available on device');
  
          return;
  
        } else if (response.errorCode == 'permission') {
  
          alert('Permission not satisfied');
  
          return;
  
        } else if (response.errorCode == 'others') {
  
          alert(response.errorMessage);
  
          return;
  
        }
  
   
  
        const newFilePaths = [...filePaths, response.assets[0]];
  
        setFilePaths(newFilePaths);
  
      });
  
    };
  
   
  
    const removeImage = indexToRemove => {
  
      const newFilePaths = filePaths.filter(
  
        (_, index) => index !== indexToRemove,
  
      );
  
      setFilePaths(newFilePaths);
  
    };
  
   
  
    return (
  
      <SafeAreaView style={{flex: 1}}>
  
        <View style={styles.container}>
  
          <TouchableOpacity
  
            activeOpacity={0.5}
  
            style={styles.buttonStyle}
  
            onPress={() => chooseFile('photo')}>
  
            <FontAwesomeIcon
  
              icon="fa-solid fa-camera"
  
              color={primary_blue}
  
              size={30}
  
            />
  
            <Text style={styles.textStyle}>Sélectionner vos photos</Text>
  
          </TouchableOpacity>
  
          {filePaths.map((file, index) => (
  
            <View key={index} style={styles.imageContainer}>
  
              <Image source={{uri: file.uri}} style={styles.imageStyle} />
  
              <TouchableOpacity
  
                style={styles.removeIcon}
  
                onPress={() => removeImage(index)}>
  
                <FontAwesomeIcon icon={faTrash} color={primary_blue} size={20} />
  
              </TouchableOpacity>
  
            </View>
  
          ))}
  
        </View>
  
      </SafeAreaView>
  
    );
  
  };
  
   
  
  export default KivImagePicker;
  
   
  
  const styles = StyleSheet.create({
  
    container: {
  
      padding: 10,
  
      alignItems: 'center',
  
      display: 'flex',
  
      alignItems: 'center',
  
      gap: 30,
  
    },
  
    textStyle: {
  
      padding: 10,
  
      fontSize: 20,
  
      fontFamily: font_semibold,
  
      color: primary_blue,
  
      textAlign: 'center',
  
    },
  
    buttonStyle: {
  
      display: 'flex',
  
      flexDirection: 'row',
  
      alignItems: 'center',
  
      borderWidth: 1,
  
      borderColor: quaternary_blue,
  
      borderRadius: 10,
  
      paddingHorizontal: 20,
  
      paddingVertical: 15,
  
    },
  
    imageStyle: {
  
      width: 200,
  
      height: 200,
  
    },
  
    imageContainer: {
  
      display: 'flex',
  
      flexDirection: 'row',
  
      gap: 20,
  
      alignItems: 'center',
  
    },
  
  });