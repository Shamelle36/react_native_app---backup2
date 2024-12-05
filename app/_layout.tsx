import { router, Tabs } from 'expo-router';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CartTab from './cart';
import CartScreen from './cart';



export default function TabLayout() {
  return (
    // Wrap the Tabs component with the OrderProvider
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'home') {
              iconName = 'home';
            } else if (route.name === 'cart') {
              iconName = 'cart';
            } else if (route.name === 'orders') {
              iconName = 'receipt';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#b78876',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#b78876',
          },
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#fff',
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <Image
              source={require('./assets/images/logo_moms_cafe.png')}
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#F4ECD8',
                borderRadius: 100,
                marginLeft: 10,
              }}
            />
          ),
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarStyle: { display: 'none' },
            tabBarButton: () => null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name='second_page'
          options={{
            title: '',
            tabBarStyle: { display: 'none' },
            tabBarButton: () => null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="home"
          options={{ title: 'Home' }}
        />

        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            tabBarStyle: { display: 'none' },
            headerStyle: {
              backgroundColor: '#b78876',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerShown: true,
            headerTitle: () => null,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push('/home')}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                  <Ionicons name='arrow-back' size={15} color={'white'} />
                  <Text style={{ marginLeft: 5, fontWeight: 500, color: 'white' }}>Back</Text>
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen name="orders" options={{ title: 'Orders' }} />
      </Tabs>
  );
}
