import React, {useState, useMemo, useEffect} from 'react';
import { Text, View, Pressable, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import styles from './../../styles/styles.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
import categoryData from './../../data/categories.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from './../../components/toast.js'
import moment from 'moment';
import FutureDateNote from './futureDateNote.js'

function AddTransactionContent ({route, navigation}) {

    const categoryId = route.params.categoryId;
    const category = categoryData.find(obj => {
      return obj.id === categoryId
    });
  
    const [toast, setToast] = useState({ message: "", type: "" });
    const [date, setDate] = useState(new Date());
    const [note, setNote] = useState("");
    const [datePickerIsShown, setDatePickerIsShown] = useState(true);
    const [amount, setAmount] = useState(0);
    const [converted, setConverted] = useState({ amount: 0, rate: 0 })
    const [transactionList, setTransactionList] = useState([])
  
    const handleAmountChange = (amount) => {
        setAmount(amount)
    }
  
    const handleRemoveAmount = () => {
      setAmount(0)
    }
  
    const handleNoteChange = (note) => {
      setNote(note)
    }
  
    const onChangeDatePicker = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setDatePickerIsShown(Platform.OS ==='ios');
      setDate(currentDate);
    };
  
    const getTransactionList = async () => {
      const result = await AsyncStorage.getItem('transactionList')
      if(result !== null) {
        setTransactionList(JSON.parse(result))
      }
    }
  
    const formattedDate = useMemo(() => {
      if(date <= new Date()) {
        return moment(date).format("YYYY-MM-DD");
      } else {
        return null;
      }
    }, [date])
  
    const getConversion = () => {
      fetch(`https://api.exchangerate.host/convert?from=KRW&to=PHP&date=${formattedDate}&amount=${amount}`)
      .then((response) => response.json())
      .then((json) => {
        setConverted({ 
          amount: json.result ? json.result.toFixed(2) : "", 
          rate: json.info.rate ? json.info.rate : ""
        });
      })
      .catch((err) => {
        setToast({message: "An error occurred:" + err, type: "error"})
      });
    }
  
    const handleSubmit = async () => {
  
      if(date == "" || amount == "" || categoryId == ""){
        setToast({message: "Amount, date and category are required.", type: "error"})
        setTimeout(() => {
          setToast({message: "", type: ""});
        }, 3000)
        return;
      }
  
      const body = {
        id: Date.now(),
        date: date.toISOString().split('T')[0],
        amount,
        rate: converted.rate,
        currency: 'KRW',
        localCurrency: 'PHP',
        categoryId,
        type: category.type,
        note,
      }
  
      const updatedList = [...transactionList, body]
  
      setTransactionList(updatedList)
  
      await AsyncStorage.setItem('transactionList', JSON.stringify(updatedList)).then(() => {
        setToast({message: "Transaction has been saved!", type: "success"})
        setTimeout(() => {
          setToast({message: "", type: ""});
          navigation.navigate("TransactionList", {
            refetchKey: Math.random()
          })
        }, 1000)
      }).catch((err) => {
        setToast({message: "An error occurred:" + err, type: "error"})
        setTimeout(() => {
          setToast({message: "", type: ""});
        }, 1000)
      })
    }
  
    
    useEffect(() => {
      getTransactionList();
    }, [])
    
    useEffect(() => {
      getConversion()
    }, [date, amount, getConversion])
  

    return(
      <SafeAreaView>
        <ScrollView style={{height: "100%", marginTop: 20}}>
  
        {toast.message ? 
          <Toast message={toast.message} type={toast.type} /> : null
        }
        <FutureDateNote date={date} />
        <TableView>
        <Section>
          <Cell
            image={
              <View style={{borderWidth: 1, borderColor: "#E3E3E3", borderRadius: 5 }}>
                <Text style={[styles.colorGrey, {fontSize: 10, marginTop: 8, textAlign: "center"}]}>KRW</Text>
              </View>
            }
            cellContentView={
              <>
                  <TextInput
                      value={amount}
                      onChangeText={handleAmountChange}
                      style={{ fontSize: 18, flex: 2}}
                      placeholder="Enter amount"
                      keyboardType='numeric'
                  />
                  {amount != 0 ?
                    <>
                      <Pressable onPress={handleRemoveAmount} style={{ backgroundColor: "#EAEAEA", borderRadius: "100%", padding: 2 }}>
                        <Ionicons name={'close'} size={14} color={'grey'} />
                      </Pressable>
                      <Text style={[styles.colorLightGrey, {marginLeft: 20}]}>≈₱{converted.amount !== null && converted.amount}</Text>
                    </>
                  : null }
              </>
            }
          />
          <Cell
            title={category ? category.name : "Select a category"}
            image={
              <View style={{backgroundColor: '#EAEAEA', borderRadius: '100%', padding: 4}}>
                <Ionicons name={category ? category.icon : null} size={18} color={'#2C45CD'} />
              </View>
            }
            onPress={() => navigation.navigate("CategoryList", {
                sourcePath: "addTransaction"
            })}
            accessory="DisclosureIndicator"
          />
          <Cell
            image={
              <View style={{padding: 4}}>
                <Ionicons name={'document-text'} size={18} color={'grey'} />
              </View>
            }
            cellContentView={
              <>             
                <TextInput
                  value={note}
                  style={{ fontSize: 16, flex: 1 }}
                  placeholder="Add a note"
                  onChangeText={handleNoteChange}
                />
              </>
            }
          />
          <Cell
            image={
              <View style={{padding: 4}}>
                <Ionicons name={'calendar'} size={18} color={'grey'} />
              </View>
            }
            cellContentView={
              <View style={styles.columns}>
                <View style={{marginLeft: -12}}>             
                  {datePickerIsShown && (
                      <DateTimePicker
                          testId='dateTimePicker'
                          value={date}
                          is24Hour={true}
                          display='default'
                          onChange={onChangeDatePicker}
                      />
                  )}
                </View>
                {amount != 0 ?
                  <View>
                    <Text style={styles.colorLightGrey}>1 KRW = {converted.rate !== null && converted.rate} PHP</Text>
                  </View> : 
                  null }
              </View>
            }
          />
  
          <Pressable onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
  
          </Section>
        </TableView>
      </ScrollView>
        
      </SafeAreaView>
    )
  }
  

  export default AddTransactionContent;