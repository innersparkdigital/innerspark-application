/**
 * LHPhoneInput
 * This is a reusable phone input component -- with country picker 
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image,
    TextInput,
    Pressable,

} from 'react-native';
import { appColors, parameters } from '../../global/Styles';
import { Button, Icon } from '@rneui/base'
import { useToast } from 'native-base';
import { appImages } from '../../global/Data';
import CountryPicker from 'react-native-country-picker-modal';


export default LHPhoneInput = ({ 
    placeholder="078xxxxxxx",
    inputValue="",
    inputValueSetter,
    countrySupportSetter,
    formattedValueSetter,
    onPickerPress,
    hasContactPicker=false,
    isInputEditable=true,
    autoFocus=false,
 }) =>{

    const dispatch = useDispatch(); // dispatch actions
    const toast = useToast();

    // Toast Notifications
    const notifyWithToast = (description) => { toast.show({ description: description, duration: 1000, }) }

    // const [isLoading, setIsLoading] = useState(false);
    // const [phone, setPhone] = useState("");

    // Country Picker related contants
    // const [isCountrySupported, setIsCountrySupported] = useState(true);
    const countryCodes = { 'ug' : '+256', 'rw' : '+250' };
    const [countryCode, setCountryCode] = useState('UG'); // default country code
    const [callingCode, setCallingCode] = useState('256'); // This depends on the default country code
    const [country, setCountry] = useState(null)
    const [withCountryNameButton, setWithCountryNameButton] = useState(false)
    const [withFlag, setWithFlag] = useState(true)
    const [withFlagButton, setWithFlagButton] = useState(true);
    const [withEmoji, setWithEmoji] = useState(false)
    const [withFilter, setWithFilter] = useState(true)
    const [withAlphaFilter, setWithAlphaFilter] = useState(false)
    const [withCallingCode, setWithCallingCode] = useState(true)
    const [withCallingCodeButton, setWithCallingCodeButton] = useState(false)
    const [visible, setVisible] = useState(false);

    // set supported countries
    const supportedCountries = ['UG', 'RW'];


    const onCountrySelect = (country) => {
        setCountryCode(country.cca2)
        setCountry(country)
        setCallingCode(country.callingCode[0])
        // console.log(country.callingCode[0])
        // console.log(country.callingCode);

        // check if country is supported 
        if (!supportedCountries.includes(country.cca2)) {
            notifyWithToast("Country Not Supported Yet"); // Enable later
            // setIsCountrySupported(false);
            countrySupportSetter(false);

        } else {
            // setIsCountrySupported(true);
            countrySupportSetter(true);
        }

    }

    /* Get country code */
    const getCallingCode = () => {
        let realCallingCode = '';
        if(country) {
            realCallingCode = "+" + country.callingCode[0];
        } else {
            realCallingCode = countryCodes.ug; // the default calling code
        }
        //console.log("The code: " + realCallingCode );
        return realCallingCode;
    }

    let slicedPhone = ''; // This is used to format the phone number

    /* Calling Code */
    const onChangeCallingCodeHandler = (code) => {
        setCallingCode(code);
        if (country) {
            // console.log("Use this: " + country.callingCode[0]);
        }
    }


    /* Phone Handler */
    const onChangePhoneHandler = (phone) => { 
        inputValueSetter(phone); // update phone value
        if (formattedValueSetter) {
            // format phone number
            if ( phone[0] == "0" ) {
                slicedPhone = phone.slice(1, phone.length);
                let formattedPhone = getCallingCode() + slicedPhone;
                formattedValueSetter(formattedPhone);  // update formatted Phone
            } else {
                slicedPhone = phone;
                let formattedPhone = getCallingCode() + slicedPhone;
                formattedValueSetter(formattedPhone); // update formatted phone
            }

        }
    }



    return(
        <View style={ styles.inputContainerRow }>
            <CountryPicker
                {...{
                    countryCode,
                    withFilter,
                    withFlag,
                    withCountryNameButton,
                    withAlphaFilter,
                    withCallingCode,
                    withCallingCodeButton,
                    withEmoji,
                    onSelect:onCountrySelect,
                    //onChange:onCountrySelect,
                    // limit the country picker to only Uganda and Rwanda, and Kenya, and Tanzan
                    countryCodes: ['UG', 'RW', 'KE', 'TZ'],

                }}
                visible={visible}
                containerButtonStyle={{ width:30, }}
            />

            <Icon 
                type="material-icons"
                name="arrow-drop-down"
                color={appColors.AppBlue}
                size={25} 
                style={{ marginLeft:-5, padding:0 }}
            />

            { 
                (inputValue.trim()) && 
                    <TextInput 
                        style={{ fontSize:16, fontWeight:'700', color:appColors.AppBlue, paddingVertical:0  }}
                        keyboardType='phone-pad'
                        maxLength={18}
                        editable={false}
                        onChangeText={onChangeCallingCodeHandler}
                        value={ getCallingCode() } 
                    /> || null
            }

            <TextInput 
                placeholderTextColor={ appColors.grey4 } 
                style={{ flex:3, fontSize:16, color:appColors.AppBlue, paddingVertical:0 }}
                keyboardType='phone-pad'
                maxLength={14}
                placeholder={placeholder}
                editable={isInputEditable}
                onChangeText={onChangePhoneHandler}
                value={inputValue}
                autoFocus={autoFocus}
            />

            { hasContactPicker &&
            <Pressable style={{ justifyContent:"center", alignItems:"center", }} onPress={onPickerPress}>
                <Icon type="material-icons" name="contacts" color={appColors.AppBlue} size={25} />
            </Pressable>
 } 
        </View>
    )
}


// LHPhoneInput Local Styles
const styles = StyleSheet.create({

    inputContainerRow : {
        flexDirection:'row', 
        alignItems:'center', 
        paddingHorizontal:12, 
        paddingVertical:8, 
        borderWidth:1,
        borderColor: appColors.grey4,
        borderRadius:25, 
        marginVertical:8

    },

    inputContainerRowCard : {
        flexDirection:'row', 
        alignItems:'center', 
        paddingHorizontal:15, 
        paddingVertical:15, 
        borderRadius:10, 
        marginVertical:8,
        backgroundColor:appColors.CardBackground,
    
        // adding some box shadow effect to home features icon containers
        shadowColor: 'black',
        shadowOpacity: 0.16,
        shadowOffset: { width: 0, height: 3},
        shadowRadius: 10,
        elevation: 3,
    },


})