import 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import Map from './Map';
import Data from './Data';
import Trip from './Trip';

export default function App() {
  const Drawer = createDrawerNavigator();

  return (
      <NavigationContainer theme={DarkTheme}>
        <Drawer.Navigator initialRouteName="Home"
        screenOptions={({ route  }) => ({
          drawerIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Route') {
              iconName = focused ? 'car' : 'car-outline';
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Saved logs') {
              iconName = focused ? 'list' : 'list-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
          <Drawer.Screen name="Home" component={Home} options={{ drawerLabel: 'Home', headerTintColor: "white" }} />
          <Drawer.Screen name="Map" component={Map} options={{ drawerLabel: 'Map', headerTintColor: "white" }} />
          <Drawer.Screen name="Route" component={Trip} options={{ drawerLabel: 'Add Log', headerTintColor: "white" }} />
          <Drawer.Screen name="Saved logs" component={Data} options={{ drawerLabel: 'Saved logs', headerTintColor: "white" }} />
        </Drawer.Navigator>
      </NavigationContainer>
  );
}