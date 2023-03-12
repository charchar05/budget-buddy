import { Text, Pressable, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './../../styles/styles.js'

const DeleteData = () => {

    const deleteAlert = () => {
        Alert.alert("Are you sure?", "All transaction logs will be deleted!", 
        [
            {
                text: "Delete",
                onPress: handleDelete
            },
            {
                text: "Cancel",
                onPress: () => console.log("Cancel")
            }
        ], {
            cancelable: true
        })
    }

    const handleDelete = async () => {
        try {
          await AsyncStorage.removeItem("transactionList");
        } catch (e) {
          console.error(e.message);
        }
    };

    return (
        <Pressable onPress={deleteAlert}>
            <Text style={[styles.colorLightGrey, {marginLeft: 14, marginTop: 40, textAlign: "center"}]}>Delete All Data</Text>
        </Pressable>
    )
}

export default DeleteData;


                