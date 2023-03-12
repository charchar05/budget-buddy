import React, {useState, useEffect} from 'react';
import {Text, View, ScrollView} from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import styles from './../../styles/styles.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import categories from './../../data/categories.json'

function TransactionList ({route, navigation}) {

    const [sortedTransactions, setSortedTransactions] = useState({})
  
    const getTransactions = async () => {
      const result = await AsyncStorage.getItem("transactionList");
      if(result !== null) {
  
        const groupTransactions = {};
        JSON.parse(result).forEach(result => {
          if (groupTransactions[result.date] === undefined) {
            groupTransactions[result.date] = [];
          }
          groupTransactions[result.date].push(result);
        });
  
        const sorted = Object.fromEntries(Object.entries(groupTransactions).sort().reverse());
        setSortedTransactions(sorted);
      }
    }
  
    useEffect(() => {
      getTransactions()
    }, [route.params.refetchKey])

  
    const getCategoryName = (categoryId) => {
      return categories.find(obj => obj.id === categoryId).name
    }
  
    const getCategoryIcon = (categoryId) => {
      return categories.find(obj => obj.id === categoryId).icon
    }
  
    const getConvertedAmount = (transaction) => {
      const totalExpense = transaction.filter(f => f.type.includes("Expense")).reduce(
        (total, currentValue) => Number(total) + Number(currentValue.amount),
            0
        )
      const totalIncome = transaction.filter(f => f.type.includes("Income")).reduce(
          (total, currentValue) => Number(total) + Number(currentValue.amount),
          0
      )

      const total = totalIncome - totalExpense;
      const converted = (total * transaction[0].rate).toFixed(2)
      return converted;
    }


  
    const getDisplayDate = (date) => {
      const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const months = ["JAN","FEB","MAR","APR","MAY","JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  
      var convertedDate = new Date(date);
      
      var day = convertedDate.getDate();
      var year = convertedDate.getFullYear();
      var month = months[convertedDate.getMonth()];
      var weekday = weekdays[convertedDate.getDay()];
  
      return (
        <View style={{flexDirection: 'row', alignItems: "center"}}>
          <Text style={[styles.textLg, {textAlign: "left", width: 44}]}>
            {day.toString().length == 1 ? "0" + day : day}
          </Text>
          <Text style={[styles.colorGrey, {borderWidth: 1, borderColor: "#E3E3E3", padding: 4, borderRadius: 5, marginRight: 10}]}>
            {year + " " + month}
          </Text>
          <Text style={styles.colorGrey}>{weekday}</Text>
        </View>
      )
    }
  
    return(
      <ScrollView style={{height: "100%"}}>
        <TableView>
      
            {Object.values(sortedTransactions).map((transaction, i) => (
              <Section hideSeparator key={i}>
                <Cell
                  cellContentView={
                    <View style={[styles.columns, {paddingTop: 10}]}>
                        <Text style={[styles.textLg]}>
                              {getDisplayDate(transaction[0].date)}
                        </Text>
                        <Text style={styles.fontBold}>
                          ≈₱{getConvertedAmount(transaction)}
                          
                        </Text>
                    </View>
                  }
                />
  
                {transaction.map((detail) => (
                  <Cell
                    key={detail.id}
                    cellStyle="RightDetail"
                    title={
                      getCategoryName(detail.categoryId)
                    }
                    detail={'₩' + detail.amount}
                    rightDetailColor={detail.type === 'Expense' ? '#CF0E0E' : '#008625'}
                    image={
                        <View style={{backgroundColor: '#EAEAEA', borderRadius: '100%', flexDirection:"row", alignItems: "center", paddingLeft: 6}}>
                          <Ionicons name={getCategoryIcon(detail.categoryId)} size={18} color={'#2C45CD'} />
                        </View>
                    }   
                    onPress={() => navigation.navigate("TransactionDetail", {
                      transactionId: detail.id
                    })}
                    accessory="DisclosureIndicator"
                  />
                ))}
            </Section>
            ))}
        </TableView>
      </ScrollView>
    );
  }

export default TransactionList;