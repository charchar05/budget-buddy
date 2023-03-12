
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddTransactionContent from './../components/addTransaction/addTransactionContent.js'
import CategoryList from '../components/categoryList.js';

function AddTransactionScreen({route, navigation}) {

  const Stack = createNativeStackNavigator();
  
  return (
    <Stack.Navigator initialRoutName="AddTransactionContent">
      <Stack.Screen 
        name="AddTransactionContent" 
        component={AddTransactionContent} 
        initialParams={{route: route}} 
        options={{ headerShown:false }} />
      <Stack.Screen 
        name="CategoryList" 
        component={CategoryList}
        options={{ title: "Select Category" }} />
    </Stack.Navigator>
  )
}

export default AddTransactionScreen;