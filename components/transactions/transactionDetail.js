import React, {useState, useMemo, useEffect, useCallback} from 'react';
import { Text, View, Pressable, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import styles from './../../styles/styles.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from './../../components/toast.js'
import categoryData from './../../data/categories.json'
import moment from 'moment';


function TransactionDetail ({route, navigation}) {

    const transactionId = useMemo(() => {
      return route.params.transactionId;
    }, [route])
  
  
    const [categoryId, setCategoryId] = useState("")
    const [toast, setToast] = useState({ message: "", type: "" });
    const [date, setDate] = useState(new Date());
    const [note, setNote] = useState("");
    const [datePickerIsShown, setDatePickerIsShown] = useState(true);
    const [amount, setAmount] = useState("");
    const [converted, setConverted] = useState({ amount: 0, rate: 0 })
  
    const [transactions, setTransactions] = useState([])

    const getTransactions = async () => {
    const result = await AsyncStorage.getItem("transactionList");
        if(result !== null) {
            setTransactions(JSON.parse(result));
        }
    }
  
    useEffect(() => {
        getTransactions()
    }, [])
  
    const transaction = transactions && transactions.find(obj => {
        return obj.id === transactionId
    });
  
    useEffect(() => {
        if(transaction){
            setAmount(transaction.amount)
            setNote(transaction.note)
            setDate(new Date(transaction.date))
            setCategoryId(transaction.categoryId)
        }
    }, [transaction])

    useEffect(() => {
        if(route.params.categoryId) {
            setCategoryId(route.params.categoryId)
        }
    }, [route, setCategoryId])
      
    const category = categoryData.find(obj => {
        return obj.id === categoryId
    });

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

    useEffect(() => {
        getConversion()
      }, [date, amount, getConversion])
  
  
    const handleAmountChange = useCallback((amount) => {
        setAmount(amount)
    }, [amount])
  
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
  
    const handleUpdate = useCallback(async () => {
  
      const result = await AsyncStorage.getItem('transactionList')
      let transactions = [];
      if(result != null) {
        transactions = JSON.parse(result);
      }
  
      const newTransactions = transactions.filter(x => {
        if(x.id === transactionId) {
          x.date = moment(date).format("YYYY-MM-DD")
          x.note = note
          x.amount = amount
          x.categoryId = category.id
          x.type = category.type
          x.isUpdated = true  
        }
        return x;
      })

      console.log("date", date)
  
      setTransactions(newTransactions)
  
      await AsyncStorage.setItem('transactionList', JSON.stringify(newTransactions)).then(() => {
        setToast({message: "Successfully updated!", type: "success"})
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
  
      if(date == "" || amount == "" || categoryId == ""){
        setToast({message: "Amount, date and category are required.", type: "error"})
        setTimeout(() => {
          setToast({message: "", type: ""});
        }, 3000)
        return;
      }
  
    }, [date, note, amount, category, transactionId, setTransactions, transactions, categoryId])
  

    const handleDelete = async () => {
      const result = await AsyncStorage.getItem("transactionList");
      let transactions = []
      if(result !== null) {
        transactions = JSON.parse(result)
      }
  
      const newTransactions = transactions.filter(x => x.id !== transactionId)
      await AsyncStorage.setItem("transactionList", JSON.stringify(newTransactions))
      navigation.navigate("TransactionList", {
        refetchKey: Math.random()
      })
    }
  
  const deleteAlert = () => {
      Alert.alert("Are you sure?", "This will be deleted permanently!", 
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
  
    return(
      <SafeAreaView>
        <ScrollView style={{height: "100%"}}>

        {toast.message ? 
          <Toast message={toast.message} type={toast.type} /> : null
        }

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
                sourcePath: "transactionDetail"
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
  
          <Pressable onPress={handleUpdate} style={styles.button}>
            <Text style={styles.buttonText}>Update</Text>
          </Pressable>
  
          <Pressable onPress={deleteAlert} style={[styles.button]}>
            <Text style={[styles.buttonText, styles.colorRed]}>Delete</Text>
          </Pressable>
  
          </Section>
        </TableView>
      </ScrollView>
        
      </SafeAreaView>
    )
}

  export default TransactionDetail;