import React, {useState,useEffect,useMemo} from 'react';
import { Text, View } from 'react-native';
import styles from './../../styles/styles.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const HomeHeader = () => {
    const [totalAmount, setTotalAmount] = useState("");
    const [convertedAmount, setConvertedAmount] = useState("");
    const formattedDate = useMemo(() => {
        return moment(new Date()).format("YYYY-MM-DD");
    }, [])

    const getTransactions = async () => {
        const result = await AsyncStorage.getItem("transactionList");

        if(result !== null) {
            const totalExpense = JSON.parse(result).filter(f => f.type.includes("Expense")).reduce(
            (total, currentValue) => Number(total) + Number(currentValue.amount),
                0
            )
            const totalIncome = JSON.parse(result).filter(f => f.type.includes("Income")).reduce(
                (total, currentValue) => Number(total) + Number(currentValue.amount),
                0
            )
            setTotalAmount(totalIncome - totalExpense)
        }
    }

    const getConversion = () => {

        fetch(`https://api.exchangerate.host/convert?from=KRW&to=PHP&date=${formattedDate}&amount=${Math.abs(totalAmount)}`)
        .then((response) => response.json())
        .then((json) => {
            setConvertedAmount(json.result ? json.result.toFixed(2) : "");
        })
        .catch((err) => {
            setToast({message: "An error occurred:" + err, type: "error"})
        });
    }

    useEffect(() => {
        getTransactions()
        getConversion(totalAmount)
    }, [totalAmount])
    
    return (
        <View style={[styles.columns, styles.headerMargin]}>
            <View>
                <Text style={[styles.textLg, styles.fontBold]}>
                    ₩{totalAmount}
                </Text>
                <Text style={[styles.textSm, styles.colorLightGrey]}>
                    Total Balance 
                </Text>
            </View>
            <View>
                <Text style={[styles.textBase]}>
                    ≈₱-{convertedAmount}
                </Text>
                <Text style={[styles.textSm, styles.colorLightGrey]}>
                    {formattedDate}
                </Text>
            </View>
        </View>
    )
}

export default HomeHeader;