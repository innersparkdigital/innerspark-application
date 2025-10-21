import Foundation
import React
import UIKit

@objc(ScreenSecurityModule)
class ScreenSecurityModule: NSObject {
  private var blurView: UIVisualEffectView?
  private var isSecurityEnabled = false
  
  @objc
  func enableSecureScreen(_ resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.isSecurityEnabled = true
      self.setupScreenshotDetection()
      resolve("Screen security enabled")
    }
  }
  
  @objc
  func disableSecureScreen(_ resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.isSecurityEnabled = false
      self.removeScreenshotDetection()
      resolve("Screen security disabled")
    }
  }
  
  private func setupScreenshotDetection() {
    // Detect when user takes a screenshot
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(screenshotTaken),
      name: UIApplication.userDidTakeScreenshotNotification,
      object: nil
    )
    
    // Detect when screen recording starts
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(screenRecordingChanged),
      name: UIScreen.capturedDidChangeNotification,
      object: nil
    )
    
    // Check if already recording
    if UIScreen.main.isCaptured {
      showBlurOverlay()
    }
  }
  
  private func removeScreenshotDetection() {
    NotificationCenter.default.removeObserver(self)
    hideBlurOverlay()
  }
  
  @objc private func screenshotTaken() {
    guard isSecurityEnabled else { return }
    // Screenshot was taken - you could log this or show a warning
    print("[ScreenSecurity] Screenshot detected")
  }
  
  @objc private func screenRecordingChanged() {
    guard isSecurityEnabled else { return }
    
    if UIScreen.main.isCaptured {
      // Screen recording started
      print("[ScreenSecurity] Screen recording detected")
      showBlurOverlay()
    } else {
      // Screen recording stopped
      print("[ScreenSecurity] Screen recording stopped")
      hideBlurOverlay()
    }
  }
  
  private func showBlurOverlay() {
    DispatchQueue.main.async {
      guard self.blurView == nil else { return }
      
      if let window = UIApplication.shared.windows.first {
        let blurEffect = UIBlurEffect(style: .light)
        let blurView = UIVisualEffectView(effect: blurEffect)
        blurView.frame = window.bounds
        blurView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        
        // Add warning label
        let label = UILabel()
        label.text = "Screen Recording Detected\nContent Hidden for Privacy"
        label.textAlignment = .center
        label.numberOfLines = 0
        label.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        label.textColor = .darkGray
        label.translatesAutoresizingMaskIntoConstraints = false
        
        blurView.contentView.addSubview(label)
        NSLayoutConstraint.activate([
          label.centerXAnchor.constraint(equalTo: blurView.centerXAnchor),
          label.centerYAnchor.constraint(equalTo: blurView.centerYAnchor),
          label.leadingAnchor.constraint(equalTo: blurView.leadingAnchor, constant: 40),
          label.trailingAnchor.constraint(equalTo: blurView.trailingAnchor, constant: -40)
        ])
        
        window.addSubview(blurView)
        self.blurView = blurView
      }
    }
  }
  
  private func hideBlurOverlay() {
    DispatchQueue.main.async {
      self.blurView?.removeFromSuperview()
      self.blurView = nil
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
