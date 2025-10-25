import LocalNotification from './LocalNotification';

// Very simple in-memory poller registry keyed by paymentRef
// Replace with a robust background task (Headless JS, Notifee foreground service, etc.) later
class PaymentStatusPoller {
  private timers: Map<string, ReturnType<typeof setInterval>> = new Map();

  start(paymentRef: string, onSuccess?: () => void | boolean | Promise<void | boolean>) {
    if (this.timers.has(paymentRef)) return;

    let elapsed = 0;
    const timer = setInterval(async () => {
      elapsed += 1000;
      // TODO: Replace with real API call: await getPaymentStatus(paymentRef)
      // Mock: succeed at ~6 seconds
      if (elapsed >= 6000) {
        this.stop(paymentRef);
        const result = onSuccess ? await onSuccess() : undefined;
        if (result !== true) {
          LocalNotification.notify({
            title: 'Payment Successful',
            message: 'Your event registration has been completed.',
          });
        }
      }
    }, 1000);

    this.timers.set(paymentRef, timer);
  }

  stop(paymentRef: string) {
    const t = this.timers.get(paymentRef);
    if (t) {
      clearInterval(t);
      this.timers.delete(paymentRef);
    }
  }
}

export default new PaymentStatusPoller();
