import React, {useMemo} from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import styles from './../styles/styles.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
import categories from './../data/categories.json'

function CategoryList({ navigation, route }) {

    const expenseCategories = categories.filter(x => x.type == "Expense");
    const incomeCategories = categories.filter(x => x.type == "Income");

    const returnPath = useMemo(() => {
        if(route.params.sourcePath == "addTransaction") {
            return "AddTransactionContent"
        } else {
            return "TransactionDetail"
        }
    }, [route.params.sourcePath])

    return(
      <ScrollView style={{height: "100%"}}>
        <TableView>
            <Section>
                <Cell
                    cellContentView={
                        <View style={styles.columns}>
                            <View style={{flex:2, flexDirection: 'row', alignItems: 'center', gap: 15}}>
                                <Text style={[styles.textBase]}>
                                    Expense Categories
                                </Text>
                            </View>
                        </View>
                    }
                />
                {expenseCategories.map((category) => (
                    <Cell
                        key={category.id}
                        cellStyle="RightDetail"
                        title={category.name}
                        image={
                            <View style={{backgroundColor: '#EAEAEA', borderRadius: '100%', padding: 4}}>
                                <Ionicons name={category.icon} size={18} color={'#2C45CD'} />
                            </View>
                        }   
                        onPress={() => navigation.navigate(returnPath, {
                            categoryId: category.id
                        })}
                        accessory="DisclosureIndicator"
                    />
                ))}
            </Section>

            <Section>
                <Cell
                    cellContentView={
                        <View style={styles.columns}>
                            <View style={{flex:2, flexDirection: 'row', alignItems: 'center', gap: 15}}>
                                <Text style={[styles.textBase]}>
                                    Income Categories
                                </Text>
                            </View>
                        </View>
                    }
                />
        
            {incomeCategories.map((category) => (
                <Cell
                    key={category.id}
                    cellStyle="RightDetail"
                    title={category.name}
                    image={
                        <View style={{backgroundColor: '#EAEAEA', borderRadius: '100%', padding: 4}}>
                            <Ionicons name={category.icon} size={18} color={'#2C45CD'} />
                        </View>
                    }   
                    onPress={() => navigation.navigate("AddTransactionContent", {
                        categoryId: category.id
                    })}
                    accessory="DisclosureIndicator"
                />
            ))}
            </Section>
          
        </TableView>
      </ScrollView>
    );
  }

  export default CategoryList;