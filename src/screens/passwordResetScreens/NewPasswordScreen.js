/**
 * New Password Screen Component
 * Handles password reset functionality
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    ActivityIndicator,
    ImageBackground,
    Pressable,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon, BottomSheet } from '@rneui/base';
import { useToast } from 'native-base';
import { appColors, parameters } from '../../global/Styles';
import { scale, verticalScale, moderateScale } from '../../global/Scaling';
import { appImages } from '../../global/Data';
import LHGenericHeader from '../../components/LHGenericHeader';
import { setNewPassword } from '../../api/shared/auth';


export default function NewPasswordScreen({ navigation, route }) {

    const toast = useToast();
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordResetModalVisible, setIsPasswordResetModalVisible] = useState(false);
    const storedSessionUserId = useSelector(state => state.userData.sessionUserId); // just for temporary use
    const { resetToken, email } = route.params || {}; // Get resetToken and email from route params


    // Toast Notifications
    const notifyWithToast = (description) => {
        toast.show({
            description: description,
            duration: 1000,
        })
    }

    // Password Handler
    const onChangePasswordHandler = (password) => {
        setPassword(password);
    }

    // Password1 Handler
    const onChangePassword1Handler = (password) => {
        setPassword1(password);
    }

    /** 
     * Password Change Form Handler 
     */
    const PasswordChangeHandler = async () => {
        // some basic validation --- More validation needed
        if (!password1.trim() || !password.trim()) {
            notifyWithToast("A new password must be provided!"); // Notify with toast
            return;
        }

        if (password1 !== password) {
            notifyWithToast("Passwords don't match!"); // Notify with toast
            return;
        }
        // set loading state
        setIsLoading(true);

        // making a request to the API using auth.js setNewPassword function
        try {
            const response = await setNewPassword(email, resetToken, password.trim());

            // checking the status
            if (response.status === 200) {

                // IF status is successful
                // JSON.stringify(response.data)
                if (response.data.status == "success") {

                    console.log(response.data);
                    notifyWithToast("Password reset successfully!"); // notify with Toast
                    setIsPasswordResetModalVisible(true); // Make the success modal visible
                    setIsLoading(false);
                    setPassword('');
                    setPassword1('');

                } else {
                    console.log(response.data); // what happened ?
                    notifyWithToast("Password reset failed."); // notify with Toast
                    setIsLoading(false);
                    //setPassword('');
                    //setPassword1('');
                }

            } else {

                throw new Error("Oops! Something went wrong!");

            }


        } catch (error) {
            console.log(error.message);
            notifyWithToast("Oops? Something went wrong!");  // Notify with Toasts
            setIsLoading(false);
        }

    }


    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>

                {/* Header Block */}
                <View style={{ paddingVertical: parameters.headerHeightTinier }}>
                    <LHGenericHeader
                        title='Reset Password'
                        showTitle={false}
                        showLeftIcon={true}
                        leftIconPressed={() => { navigation.goBack(); }}
                    />
                </View>

                {/* Main Content Block */}
                <View style={{ flex: 1, paddingHorizontal: scale(15), paddingVertical: verticalScale(20), }}>

                    {/* Logo and Header Text */}
                    <View style={{ paddingVertical: verticalScale(2) }}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Image source={appImages.logoRound} style={{ width: scale(280), height: scale(60), resizeMode: 'contain' }} />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: verticalScale(20), paddingHorizontal: scale(10) }}>
                            <Text style={{ fontSize: moderateScale(26), color: appColors.AppBlue, fontWeight: 'bold', paddingVertical: verticalScale(5) }}>Create New Password</Text>
                            <Text style={{ fontSize: moderateScale(15), color: appColors.AppBlue, fontWeight: '500', paddingVertical: verticalScale(5), textAlign: 'center' }}>
                                Enter your new password to continue
                            </Text>
                        </View>
                    </View>

                    {/* Password Input Block */}
                    <View style={{ padding: moderateScale(15), borderRadius: moderateScale(10), }}>

                        {/* Password Input Block */}
                        <View style={styles.inputBlockRow}>
                            <View style={{ justifyContent: "center", alignItems: "center", paddingRight: scale(10) }}>
                                <Icon type="material-community" name="lock" color={appColors.grey4} size={moderateScale(30)} />
                            </View>
                            <TextInput
                                placeholderTextColor={appColors.grey3}
                                style={{ flex: 3, fontSize: moderateScale(16), fontWeight: 'bold', color: appColors.black, paddingVertical: 0 }}
                                secureTextEntry={true}
                                editable={!isLoading}
                                placeholder='Enter New Password'
                                value={password}
                                onChangeText={onChangePasswordHandler}
                            />
                        </View>

                        {/* Password1 Input Block */}
                        <View style={styles.inputBlockRow}>
                            <View style={{ justifyContent: "center", alignItems: "center", paddingRight: scale(10) }}>
                                <Icon type="material-community" name="lock" color={appColors.grey4} size={moderateScale(30)} />
                            </View>
                            <TextInput
                                placeholderTextColor={appColors.grey3}
                                style={{ flex: 3, fontSize: moderateScale(16), fontWeight: 'bold', color: appColors.black, paddingVertical: 0 }}
                                secureTextEntry={true}
                                editable={!isLoading}
                                placeholder='Verify New Password'
                                value={password1}
                                onChangeText={onChangePassword1Handler}

                            />
                        </View>

                        {isLoading &&
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <ActivityIndicator style={{ marginHorizontal: scale(5) }} />
                                <Text style={{ color: appColors.black, fontSize: moderateScale(14) }}>Resetting Password...</Text>
                            </View>
                        }

                        <View style={{ paddingVertical: verticalScale(15) }}>
                            <Button
                                title="Reset Password"
                                buttonStyle={parameters.appButtonXLBlue}
                                titleStyle={parameters.appButtonXLTitleBlue}
                                onPress={PasswordChangeHandler}
                                disabled={isLoading}
                            />
                        </View>

                    </View>
                </View>

                {/* Feature Discovery Modal */}
                <BottomSheet
                    // containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                    containerStyle={{
                        backgroundColor: appColors.CardBackground,
                        justifyContent: 'center',
                    }}
                    modalProps={{
                        presentationStyle: "overFullScreen",
                        visible: isPasswordResetModalVisible,
                    }}
                >

                    <View style={{ ...parameters.doffeeModalContainer, paddingVertical: verticalScale(120) }}>
                        <View style={{ paddingVertical: verticalScale(15), paddingHorizontal: scale(20) }}>

                            {/* Modal Content */}
                            <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: verticalScale(20) }}>

                                {/* Success Icon with Background Circle */}
                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: appColors.AppBlue + '15',
                                    borderRadius: moderateScale(80),
                                    width: scale(140),
                                    height: scale(140),
                                    marginBottom: verticalScale(20)
                                }}>
                                    <Icon
                                        type="material-community"
                                        name="check-circle"
                                        color={appColors.AppBlue}
                                        size={moderateScale(90)}
                                    />
                                </View>

                                {/* Success Message */}
                                <View style={{ marginVertical: verticalScale(10), paddingHorizontal: scale(15) }}>
                                    <Text style={{
                                        fontSize: moderateScale(24),
                                        textAlign: 'center',
                                        fontWeight: "700",
                                        paddingVertical: verticalScale(5),
                                        color: appColors.black,
                                        letterSpacing: 0.3
                                    }}>
                                        Password Updated!
                                    </Text>
                                    <Text style={{
                                        fontSize: moderateScale(15),
                                        textAlign: 'center',
                                        paddingTop: verticalScale(8),
                                        color: appColors.grey2,
                                        lineHeight: verticalScale(22)
                                    }}>
                                        Your password has been successfully updated. You can now sign in with your new password.
                                    </Text>
                                </View>
                            </View>

                            {/* Action Button */}
                            <View style={{ justifyContent: "center", marginTop: verticalScale(10), marginBottom: verticalScale(5), paddingHorizontal: scale(10) }}>
                                <Button
                                    title="SIGN IN NOW"
                                    buttonStyle={{
                                        ...parameters.appButtonXLBlue,
                                        paddingVertical: verticalScale(16),
                                        borderRadius: moderateScale(12)
                                    }}
                                    titleStyle={{
                                        ...parameters.appButtonXLTitle,
                                        fontSize: moderateScale(16),
                                        fontWeight: '600',
                                        letterSpacing: 0.5
                                    }}
                                    onPress={
                                        () => {
                                            navigation.popToTop();
                                            navigation.navigate('SigninScreen');
                                        }
                                    }
                                />
                            </View>
                        </View>

                    </View>
                </BottomSheet>
                {/* -- Feature Discovery Modal ends */}

            </ImageBackground>
        </SafeAreaView>

    )
}

// local stylesheet for the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.CardBackground,
    },

    genericInput: {
        paddingHorizontal: scale(8),
        borderRadius: moderateScale(10),
        backgroundColor: appColors.grey7,
        marginVertical: verticalScale(8),
        color: appColors.grey1,
    },

    inputBlockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        borderWidth: 1,
        borderColor: appColors.grey4,
        borderRadius: moderateScale(25),
        marginVertical: verticalScale(8)
    },

});