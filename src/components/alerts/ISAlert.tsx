/**
 * ISAlert — Reusable modern alert/modal component for InnerSpark.
 *
 * Replaces native Alert.alert() with a branded, animated modal that
 * blends seamlessly with the app UI.
 *
 * Usage (imperative hook — no need to manage visible state):
 *
 *   const alert = useISAlert();
 *
 *   // Simple message
 *   alert.show({ type: 'success', title: 'Done!', message: 'Event created.' });
 *
 *   // With confirm action
 *   alert.show({
 *     type: 'destructive',
 *     title: 'Delete Event',
 *     message: 'This cannot be undone.',
 *     confirmText: 'Delete',
 *     onConfirm: () => handleDelete(),
 *   });
 *
 *   // Render once anywhere in the component tree:
 *   <ISAlert ref={alert.ref} />
 */

import React, {
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
    useCallback,
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../global/Styles';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ISAlertType = 'success' | 'error' | 'warning' | 'info' | 'destructive' | 'confirm';

export interface ISAlertAction {
    /** Label for the button */
    text: string;
    /** Action to perform on press */
    onPress?: () => void;
    /** Visual style override */
    style?: 'default' | 'cancel' | 'destructive';
}

export interface ISAlertOptions {
    /** Visual style / icon variant */
    type?: ISAlertType;
    /** Bold heading text */
    title: string;
    /** Body / detail text */
    message: string;
    /** Label for the primary button (default: 'OK') */
    confirmText?: string;
    /** Label for the secondary/dismiss button. If omitted, only one button renders. */
    cancelText?: string;
    /** Called when the primary button is pressed. If omitted, it just dismisses. */
    onConfirm?: () => void;
    /** Called when the secondary button or backdrop is pressed */
    onCancel?: () => void;
    /** List of actions for multi-button alerts. If provided, confirmText/cancelText are ignored. */
    actions?: ISAlertAction[];
    /** Override the auto-selected icon name (material icon) */
    icon?: string;
}

export interface ISAlertHandle {
    show: (options: ISAlertOptions) => void;
    hide: () => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const THEME: Record<
    ISAlertType,
    { icon: string; accentColor: string; confirmBg: string }
> = {
    success: { icon: 'check-circle', accentColor: appColors.AppGreen, confirmBg: appColors.AppGreen },
    error: { icon: 'error', accentColor: '#E53935', confirmBg: '#E53935' },
    warning: { icon: 'warning', accentColor: '#FF9800', confirmBg: '#FF9800' },
    info: { icon: 'info', accentColor: appColors.AppBlue, confirmBg: appColors.AppBlue },
    destructive: { icon: 'delete-forever', accentColor: '#E53935', confirmBg: '#E53935' },
    confirm: { icon: 'help', accentColor: appColors.AppBlue, confirmBg: appColors.AppBlue },
};

// ─── Component ─────────────────────────────────────────────────────────────────

const ISAlert = forwardRef<ISAlertHandle>((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [opts, setOpts] = useState<ISAlertOptions>({ title: '', message: '' });
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const show = useCallback((options: ISAlertOptions) => {
        setOpts(options);
        setVisible(true);
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 200 }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
        ]).start();
    }, [scaleAnim, opacityAnim]);

    const hide = useCallback(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 0.85, duration: 150, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        ]).start(() => setVisible(false));
    }, [scaleAnim, opacityAnim]);

    useImperativeHandle(ref, () => ({ show, hide }));

    const alertType: ISAlertType = opts.type ?? 'info';
    const theme = THEME[alertType];

    const handleAction = (onPress?: () => void) => {
        hide();
        onPress?.();
    };

    const handleCancel = () => {
        hide();
        opts.onCancel?.();
    };

    // Construct actions list based on provided options
    const finalActions: ISAlertAction[] = opts.actions ?? (
        opts.cancelText
            ? [
                { text: opts.cancelText, style: 'cancel', onPress: opts.onCancel },
                { text: opts.confirmText ?? 'OK', style: 'default', onPress: opts.onConfirm }
            ]
            : [{ text: opts.confirmText ?? 'OK', style: 'default', onPress: opts.onConfirm }]
    );

    const isStacked = finalActions.length > 2;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleCancel}
            statusBarTranslucent
        >
            {/* Dimmed backdrop */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={handleCancel}
            >
                {/* Card — animated, stops backdrop press from propagating */}
                <Animated.View
                    style={[
                        styles.card,
                        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                    ]}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.cardInner}>

                        {/* Icon badge */}
                        <View style={[styles.iconBadge, { backgroundColor: theme.accentColor + '18' }]}>
                            <Icon
                                type="material"
                                name={opts.icon ?? theme.icon}
                                size={42}
                                color={theme.accentColor}
                            />
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>{opts.title}</Text>

                        {/* Message */}
                        <Text style={styles.message}>{opts.message}</Text>

                        {/* Buttons — Dynamic layout based on count */}
                        <View style={[
                            styles.buttons,
                            !isStacked && finalActions.length > 1 && styles.buttonsRow,
                            isStacked && styles.buttonsStack
                        ]}>
                            {finalActions.map((action, idx) => {
                                const isDestructive = action.style === 'destructive';
                                const isCancel = action.style === 'cancel' || action.text.toLowerCase() === 'cancel';

                                return (
                                    <TouchableOpacity
                                        key={`${action.text}-${idx}`}
                                        style={[
                                            styles.btn,
                                            isCancel ? styles.cancelBtn : styles.confirmBtn,
                                            isStacked && styles.stackedBtn,
                                            !isStacked && finalActions.length > 1 && styles.btnFlex,
                                            { backgroundColor: isCancel ? (appColors.AppLightGray ?? '#F4F4F4') : (isDestructive ? '#E53935' : theme.confirmBg) }
                                        ]}
                                        onPress={() => handleAction(action.onPress)}
                                        activeOpacity={0.75}
                                    >
                                        <Text style={[
                                            isCancel ? styles.cancelBtnText : styles.confirmBtnText,
                                            isStacked && styles.stackedBtnText
                                        ]}>
                                            {action.text}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
});

ISAlert.displayName = 'ISAlert';
export default ISAlert;

// ─── Imperative hook ──────────────────────────────────────────────────────────

/**
 * useISAlert — returns a ref to attach to <ISAlert /> and a show() helper.
 *
 * @example
 *   const alert = useISAlert();
 *   // In JSX: <ISAlert ref={alert.ref} />
 *   // In handler: alert.show({ type: 'success', title: 'Done', message: '...' });
 */
export const useISAlert = () => {
    const ref = useRef<ISAlertHandle>(null);
    const show = useCallback((options: ISAlertOptions) => {
        ref.current?.show(options);
    }, []);
    const hide = useCallback(() => {
        ref.current?.hide();
    }, []);
    return { ref, show, hide };
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.52)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    card: {
        width: '100%',
        maxWidth: 380,
    },
    cardInner: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingTop: 32,
        paddingBottom: 24,
        paddingHorizontal: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
        elevation: 12,
    },
    iconBadge: {
        width: 84,
        height: 84,
        borderRadius: 42,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        color: appColors.grey2,
        fontFamily: appFonts.bodyTextRegular,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    buttons: {
        width: '100%',
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    btn: {
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnFlex: {
        flex: 1,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: appColors.AppLightGray ?? '#F4F4F4',
        borderWidth: 1,
        borderColor: appColors.grey5,
    },
    confirmBtn: {
        width: '100%',
    },
    cancelBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: appColors.grey2,
        fontFamily: appFonts.bodyTextMedium,
    },
    confirmBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: appFonts.bodyTextMedium,
    },
    buttonsStack: {
        width: '100%',
        gap: 8,
    },
    stackedBtn: {
        width: '100%',
        paddingVertical: 12,
    },
    stackedBtnText: {
        fontSize: 14,
    }
});
