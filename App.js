import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/home.js'
import AddTransactionScreen from './screens/addTransaction.js'
import TransactionsScreen from  './screens/transactions.js'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function App() {

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home" component={HomeScreen}
          screenOptions={({route}) => ({
            tabBarIcon: ({color, size }) => {
                let iconName;
                let rn = route.name;
                if (rn === "Home") {
                  iconName = 'home';
                  size = 24;
                }
                else if (rn === "AddTransactionScreen") {
                  iconName = 'add-circle';
                  size = 34;
                  color = '#2C45CD'
                }
                else {
                  iconName = 'list';
                  size = 24;
                }

                return <Ionicons name={iconName} size={size} color={color} />
            },
          })}
          tabBarOptions={{
            activeTintColor: '#000000',
            inactiveTintColor: '#B4B4B4',
            labelStyle: { paddingBottom: 10, fontSize: 10 },
            style: {padding: 10, height: 70},
            showLabel: false,
          }}
          >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen 
          name="AddTransactionScreen" 
          component={AddTransactionScreen} 
          options={{unmountOnBlur: true, title: 'Add Transaction'}}
        />
        <Tab.Screen name="Transactions" component={TransactionsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
