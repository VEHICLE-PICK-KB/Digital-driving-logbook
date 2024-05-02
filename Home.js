import { useState, useEffect } from 'react';
import React from 'react';
import { View, Image } from 'react-native';
import { Card, Title, Paragraph, Text, Button } from 'react-native-paper';
import * as Location from 'expo-location';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=cb114749cda9a9b9b9337eea15ada5a9`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <View>
      <Card style={{ backgroundColor: '#07051a', borderRadius:0 }}>
        <Card.Cover
          source={{ uri: 'https://www.montway.com/app/uploads/Blog_2023/Dashboard-Warning-Lights_1087_final.jpg' }}
          style={{ borderRadius: 0 }}
        />
        <Card.Content>
          <Title style={{ color: "white", textAlign: "center" }}>Welcome to the Digital Driving Logbook{'\n'}{'\n'}</Title>
          <Paragraph style={{ color: "white", textAlign: "center" }}>Add Log:  Save logbook entries{'\n'}{'\n'}Map:  Display live route and distance{'\n'}{'\n'}Saved logs:  View logbook entries</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" style={{ backgroundColor: "red", marginRight: "30%" }} onPress={() => fetchWeather(location?.coords.latitude, location?.coords.longitude)}>Fetch Weather</Button>
        </Card.Actions>
      </Card>
      {weatherData && (
        <Card style={{ backgroundColor: "#07051a", borderRadius: 0 }}>
          <Card.Content>
            <Title style={{color:"white"}}>Weather Data</Title>
            <Image source={{ uri: `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png` }} style={{ width: 50, height: 50 }} />
            <Text style={{color:"white"}}>Weather: { weatherData?.weather[0]?.description}</Text>
            <Text style={{color:"white"}} >Temperature: {(weatherData?.main?.temp - 273.15).toFixed(0)} °C</Text>
            <Text style={{color:"white"}}>Humidity: {weatherData.main.humidity} %</Text>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};