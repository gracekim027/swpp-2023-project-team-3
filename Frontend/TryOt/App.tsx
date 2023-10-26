import * as React from 'react';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  NavigationProp,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from './src/pages/LoginScreen';
import SignUpScreen from './src/pages/SignUpScreen';
import Home from './src/pages/Home';
import SearchHistory from './src/pages/SearchHistory';
import MyTab from './src/pages/MyTab';
import Toast from 'react-native-toast-message';
import {Provider, useSelector} from 'react-redux';
import store, {useAppDispatch} from './src/store';
import {RootState} from './src/store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice from './src/slices/user';
import {Alert} from 'react-native';
import tryAxios from './src/util/tryAxios';

export type LoggedInParamList = {
  MyTab: undefined;
  Home: undefined;
  SearchHistory: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type RootStackNavigation = NavigationProp<RootStackParamList>;

export const Tab = createBottomTabNavigator();
export const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.username);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('accessToken');
        if (!token) {
          return;
        }
        //TODO - token parameter
        const response = await tryAxios('get', 'user/token-check/', {token});
        dispatch(userSlice.actions.setUser(response));
        await EncryptedStorage.setItem('accessToken', response.token);
      } catch (error) {
        Alert.alert('notification', 'please try login again.');
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName: string;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'SearchHistory') {
                iconName = focused ? 'podium' : 'podium-outline';
              } else if (route.name === 'MyTab') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return (
                <Icon
                  //@ts-ignore
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            },
          })}>
          <Tab.Screen
            name={'SearchHistory'}
            component={SearchHistory}
            options={{
              headerShown: false,
              title: 'query history',
            }}
          />
          <Tab.Screen
            name="Home"
            component={Home}
            options={({route}) => ({
              headerShown: false,
              title: 'Home',
              tabBarStyle: (route => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? 'null';
                if (routeName === 'ItemDetail') {
                  return {display: 'none'};
                }
                return;
              })(route),
            })}
          />
          <Tab.Screen
            name="MyTab"
            component={MyTab}
            options={{title: 'my tab'}}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            options={{headerShown: false, title: '로그인'}}
            component={LoginScreen}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              title: '',
              headerTransparent: true,
              headerTintColor: 'black',
            }}
          />
        </Stack.Navigator>
      )}
      <Toast />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}