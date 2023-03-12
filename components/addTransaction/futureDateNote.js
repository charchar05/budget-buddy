import React from 'react';
import {Text, View} from 'react-native';


const FutureDateNote = (date) => {
    if(date > new Date()) {
      return (
        <View style={{ backgroundColor: "#F8EAC8", padding: 10 }}>
          <Text style={{ color: "#9C7000", textAlign: "center" }}>
            Date is set to future. Conversion rate used is for today.
          </Text>
        </View>
      )
    }
  }

export default FutureDateNote;