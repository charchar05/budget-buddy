import { StyleSheet, Text, View, Button, Image, SafeAreaView, ScrollView } from 'react-native';

const Toast = (props) => (
    <>
        {props.type === "error" ?
            <>
                <View style={{ backgroundColor: "#C13434", padding: 10 }}>
                    <Text style={{ color: "white", textAlign: "center" }}>{props.message}</Text>
                </View>
            </>
                :
            <>
                <View style={{ backgroundColor: "#07922E", padding: 10 }}>
                    <Text style={{ color: "white", textAlign: "center" }}>{props.message}</Text>
                </View>
            </>
        }
    </>
)

export default Toast;