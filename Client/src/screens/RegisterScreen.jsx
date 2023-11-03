import { Colors } from '../contants';
import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({ fullname: '', email: '', password: '' });


  const handleButtonPress = () => {
    navigation.navigate('LoginScreen');
  };

  const handleChange = (name, value) => {
    setInputs((values) => ({ ...values, [name]: value }));

    if ((name === 'firstName' || name === 'lastName') && inputs.firstName && inputs.lastName) {
      setInputs((values) => ({ ...values, fullname: `${values.firstName} ${values.lastName}` }));
    }
  };

  const validator = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!emailRegex.test(inputs.email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email format',
      });
      return false;
    }
    if (!passwordRegex.test(inputs.password)) {
      Toast.show({
        type: 'error',
        text1: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, and be at least 8 characters long.',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validator()) {
      try {
        const { data } = await axios.post('http://192.168.1.104:3000/api/customers/', inputs);
        console.log('User added successfully', data);
        Toast.show({
          type: 'success',
          text1: 'Successfully Signed Up',
        });
        navigation.navigate('LoginScreen');
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.error === 'Email already exists') {
          Toast.show({
            type: 'error',
            text1: 'Email already exists. Please use a different email address.',
          });
        } else {
          console.log(error);
        }
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.DEFAULT_BLACK }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Sign up for <Text style={{ color: Colors.DEFAULT_RED }}>MyApp</Text>
          </Text>
          <Text style={styles.subtitle}>
            Create a new account to access your portfolio and more
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameInputs}>
            <View s style={[styles.input, styles.largeInput]}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                autoCapitalize="words"
                placeholder="John"
                onChangeText={(text) => handleChange('firstName', text)}
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
              />
            </View>

            <View s style={[styles.input, styles.largeInput]}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                autoCapitalize="words"
                placeholder="Doe"
                onChangeText={(text) => handleChange('lastName', text)}
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
              />
            </View>
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => handleChange('email', text)}
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              autoCorrect={false}
              placeholder="********"
              onChangeText={(text) => handleChange('password', text)}
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSubmit}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign up</Text>
              </View>

            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ marginTop: 'auto' }} onPress={handleButtonPress}>
            <Text style={styles.formFooter}>
              Already have an account?{' '}
              <Text style={{ textDecorationLine: 'underline', color: Colors.DEFAULT_RED }}>
                Sign in
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  nameInputs: {
    flexDirection: 'row', // Place first name and last name inputs side by side
    justifyContent: 'space-between', // Add some space between the inputs
  },
  largeInput: {
    width: 150, // Adjust the height as needed
  },
  header: {
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: Colors.DEFAULT_WHITE,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  form: {
    marginBottom: 130,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.DEFAULT_WHITE,
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.DEFAULT_WHITE,
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: Colors.DEFAULT_BLACK,
    borderColor: Colors.DEFAULT_RED,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.DEFAULT_WHITE,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: Colors.DEFAULT_RED,
    borderColor: Colors.DEFAULT_RED,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});
export default RegisterScreen;
