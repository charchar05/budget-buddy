import { StyleSheet, Text, View, Button, Image, SafeAreaView, ScrollView } from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLg: {
    fontSize: 24,
  },
  textSm: {
    fontSize: 14,
  },
  textBase: {
    fontSize: 16,
    fontWeight: '500',
  },
  textLabel: {
    fontSize: 14,
    color: '#5C5C5C',
    marginBottom: 5,
  },
  fontBold: {
    fontWeight: 'bold',
  },
  colorDarkGrey: {
    color: '#424242',
  },
  colorLightGrey: {
    color: '#B4B4B4',
  },
  colorGrey: {
    color: 'grey',
  },
  colorRed: {
    color: '#CF0E0E'
  },
  colorGreen: {
    color: '#008625',
  },
  columns: {
    flex:2,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: "center"
  },
  rows: {
    marginTop: 20, 
    marginBottom: 20, 
    flexDirection: 'column',
    
  },
  headerMargin: {
    marginTop: 25,
    marginBottom: 12,
    marginLeft: 20,
    marginRight: 20,
  },
  sectionMargin: {
    marginTop: 12,
    marginBottom: 12,
  },
  sectionRounded: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
  },
  input: {
    borderColor: '#E3E3E3', 
    borderWidth: 1, 
    padding: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    backgroundColor: 'white',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#2C45CD',
  }
});

export default styles;
