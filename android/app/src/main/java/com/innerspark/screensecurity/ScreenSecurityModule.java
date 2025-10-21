package com.innerspark.screensecurity;

import android.app.Activity;
import android.view.WindowManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;

import androidx.annotation.NonNull;

public class ScreenSecurityModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "ScreenSecurityModule";

    public ScreenSecurityModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void enableSecureScreen(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            try {
                Activity activity = getCurrentActivity();
                if (activity != null) {
                    activity.getWindow().setFlags(
                        WindowManager.LayoutParams.FLAG_SECURE,
                        WindowManager.LayoutParams.FLAG_SECURE
                    );
                    promise.resolve("Screen security enabled");
                } else {
                    promise.reject("NO_ACTIVITY", "Activity not available");
                }
            } catch (Exception e) {
                promise.reject("ERROR", "Failed to enable screen security: " + e.getMessage());
            }
        });
    }

    @ReactMethod
    public void disableSecureScreen(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            try {
                Activity activity = getCurrentActivity();
                if (activity != null) {
                    activity.getWindow().clearFlags(
                        WindowManager.LayoutParams.FLAG_SECURE
                    );
                    promise.resolve("Screen security disabled");
                } else {
                    promise.reject("NO_ACTIVITY", "Activity not available");
                }
            } catch (Exception e) {
                promise.reject("ERROR", "Failed to disable screen security: " + e.getMessage());
            }
        });
    }
}
