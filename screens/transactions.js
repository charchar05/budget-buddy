import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import AddTransactionContent from './addTransaction.js'
import TransactionList from './../components/transactions/transactionList.js'
import TransactionDetail from './../components/transactions/transactionDetail.js'
import CategoryList from '../components/categoryList.js';


function TransactionsScreen({navigation, route}) {

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRoutName="TransactionList">
       <Stack.Screen 
        name="TransactionList" 
        component={TransactionList} 
        initialParams={{route: route }}
        options={{headerShown:false}} />
      <Stack.Screen name="TransactionDetail" 
        component={TransactionDetail}
        options={{ title: "View / Edit" }} />
      {/* <Stack.Screen name="AddTransactionContent" 
        component={AddTransactionContent} /> */}
      <Stack.Screen 
        name="CategoryList" 
        component={CategoryList}
        options={{ title: "Select Category" }} />
    </Stack.Navigator>
  )
}








export default TransactionsScreen;