import React, {useState,useEffect,useMemo} from 'react';
import { Text, View, TextInput } from 'react-native';
import styles from './../../styles/styles.js'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';


const CurrencyConverter = () => {
    const [fromCurrency, setFromCurrency] = useState("KRW")
    const [toCurrency, setToCurrency] = useState("PHP")
    const [date, setDate] = useState(new Date())
    const [datePickerIsShown, setDatePickerIsShown] = useState(true)
    const [amount, setAmount] = useState("1")
    const [converted, setConverted] = useState({amount: "", rate: ""})

    const handleFromChange = (fromCurrency) => {
        setFromCurrency(fromCurrency)
    }

    const handleToChange = (toCurrency) => {
        setToCurrency(toCurrency)
    }

    const handleAmountChange = (amount) => {
        setAmount(amount)
    }

    const onChangeDatePicker = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDatePickerIsShown(Platform.OS ==='ios');
        setDate(currentDate);
    };

    const formattedDate = useMemo(() => {
        if(date <= new Date()) {
            return moment(date).format("YYYY-MM-DD");
        } else {
            return null;
        }
    }, [date])
      
    const getConversion = () => {
        fetch(`https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&date=${formattedDate}&amount=${amount}`)
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
    }, [date, formattedDate, amount, fromCurrency, toCurrency, converted])
    
    
    return(
        <View style={styles.sectionMargin}>
            <Text style={[styles.colorDarkGrey, {marginLeft: 20, marginBottom: 10}]}>Currency Converter</Text>
            <View style={[styles.sectionRounded]}>
                <View style={styles.columns}>
                    <View style={{flexBasis: 100, flexShrink: 1, flexGrow: 1}}>
                        <Text style={styles.textLabel}>From</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="FROM"
                            value={fromCurrency}
                            onChangeText={handleFromChange}
                        />
                    </View>
                    <View style={{flexBasis: 'auto', flexShrink: 0, flexGrow: 0}}>
                        <Text style={{paddingTop: 25, paddingLeft: 10, paddingRight: 10}}>=</Text>
                    </View>
                    <View style={{flexBasis: 100, flexShrink: 1, flexGrow: 1}}>
                        <Text style={styles.textLabel}>To</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="TO"
                            value={toCurrency}
                            onChangeText={handleToChange}
                        />
                    </View>
                </View>

                <View style={styles.rows}>
                    <Text style={styles.textLabel}>Conversion Rate</Text>
                    <Text style={[styles.textBase, styles.colorDarkGrey, styles.fontBold, {marginTop: 2}]}>
                        1 {fromCurrency} = {converted.rate} {toCurrency}
                    </Text>
                </View>

                <View style={styles.columns}>
                    <View style={{flexBasis: 100, flexShrink: 1, flexGrow: 1}}>
                        <Text style={styles.textLabel}>Amount</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount"
                            value={amount}
                            onChangeText={handleAmountChange}
                        />
                    </View>
                    <View style={{flexBasis: 'auto', flexShrink: 0, flexGrow: 0}}>
                        <Text style={{paddingTop: 25, paddingLeft: 10, paddingRight: 10}}>=</Text>
                    </View>
                    <View style={{flexBasis: 100, flexShrink: 1, flexGrow: 1}}>
                        <Text style={styles.textLabel}>Conversion Rate</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Converted amout"
                            value={converted.amount}
                            disabled
                        />
                    </View>
                </View>

                <View style={{flexDirection: 'column', alignItems: "left", marginTop: 20, marginBottom: 10}}>
                    <Text style={styles.textLabel}>Date</Text>
                    <View style={{marginLeft: -14}}>             
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
            </View>
            </View>
        </View>
    )
 }

 export default CurrencyConverter;