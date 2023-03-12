import React from 'react';
import { View, SafeAreaView, ScrollView} from 'react-native';
import HomeHeader from './../components/home/HomeHeader.js'
import CurrencyConverter from './../components/home/CurrencyConverter.js'
import DeleteData from './../components/home/deleteData.js'

function HomeScreen({navigation}) {

    return(
      <SafeAreaView>
        <ScrollView style={{height: "100%", backgroundColor: '#F5F5F5'}}>
            <View>
                <HomeHeader />
                <CurrencyConverter />
                <DeleteData />
            </View>
        </ScrollView>
      </SafeAreaView>
    );
}

export default HomeScreen;