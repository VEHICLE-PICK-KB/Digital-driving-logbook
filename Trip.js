import React from 'react';
import {useState, useEffect} from 'react'
import { StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('Apkdb.db');
export default function Trip() {
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [list, setList] = useState([]);
  const [vehicleOdo, setVehicleOdo] = useState('');
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');

  useEffect(() => {
  db.transaction(tx => {
  tx.executeSql('create table if not exists routesProd (id integer primary key not null, startPoint text, destination text, vehicleOdo text, date text, distance text);');
  }, null, updateList); 
  }, []);
  
  const saveItem = () => {
  db.transaction(tx => {
  tx.executeSql('insert into routesProd (startPoint, destination, vehicleOdo, date, distance) values (?, ?, ?, ?, ?);', [startPoint, destination, vehicleOdo, date, distance]);    
  }, null, updateList
  )
   
  }
  const updateList = () => {
  db.transaction(tx => {
  tx.executeSql('select * from routesProd;', [], (_, { rows }) =>
  setList(rows._array)
  ); 
  }, null, null);
  }
  const deleteItem = (id) => {
  db.transaction(
  tx => {
  tx.executeSql(`delete from routesProd where id = ?;`, [id]);
  }, null, updateList
  )    
  }
  const listSeparator = () => {
  return (
  <View
  style={{
  height: 5,
  width: "80%",
  backgroundColor: "gray",
  marginLeft: "10%"
  }}
  />
  );
  };

  return (
    <View style={styles.container}>
    <TextInput placeholder=' Starting point' placeholderTextColor="gray" style={{ color: "white", marginTop: 30, fontSize: 16, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={text => setStartPoint(text)}
        value={startPoint}/>  
    <TextInput placeholder=' Destination' placeholderTextColor="gray" style={{ color: "white", marginTop: 5, marginBottom: 5,  fontSize:16, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={text => setDestination(text)}
        value={destination}/>
    <TextInput placeholder=' Vehicle odometer (Arrival)' placeholderTextColor="gray" style={{ color: "white", marginTop: 5, marginBottom: 5,  fontSize:16, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={text => setVehicleOdo(text)}
        value={vehicleOdo}/>
    <TextInput placeholder=' Date' placeholderTextColor="gray" style={{ color: "white", marginTop: 5, marginBottom: 5,  fontSize:16, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={text => setDate(text)}
        value={date}/>
        <TextInput placeholder=' Distance' placeholderTextColor="gray" style={{ color: "white", marginTop: 5, marginBottom: 5,  fontSize:16, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={text => setDistance(text)}
        value={distance}/>      
      <Button onPress={saveItem}  mode="contained" style={{ backgroundColor: 'red' }}>Save</Button>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18, color: "white"}}>{item.startPoint} - {item.destination}</Text>
        <Text style={{fontSize: 18, color: 'red'}} onPress={() => deleteItem(item.id)}> Delete</Text></View>} 
        data={list} 
        ItemSeparatorComponent={listSeparator} 
      />
      <Text style={{marginTop: 30, fontSize: 20, color: "white"}}></Text>      
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
     backgroundColor: "#07051a",
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
    },
    listcontainer: {
     flexDirection: 'row',
     alignItems: 'center'
    },
   });