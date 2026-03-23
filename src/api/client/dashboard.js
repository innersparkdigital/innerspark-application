/**
 * Client Dashboard API Functions
 */
import { APIInstance } from '../LHAPI';
import {
    updateUserNotifications,
    updateUserDetails,
    updateUserNotificationCount,
} from '../../features/user/userDataSlice';
import { storeItemLS } from '../../global/StorageActions';


/**
 * Get App Home Data (Legacy endpoint)
 * @param {Object} params - { dispatch, userID, loadingSetter }
 * @returns {Promise} User data
 */
export const getAppHomeData = async ({ dispatch, userID, loadingSetter = null }) => {
    try {
        loadingSetter?.(true);
        console.log("Loading App home data started...");

        const response = await APIInstance.post('/app-home', { user: userID });

        if (response.status === 200 && response.data.status === "success") {
            // Dispatching to Redux Store
            const userNotificationCount = response.data.notifications_count;
            const userDetailsData = {
                userId: response.data.user.userid,
                name: response.data.user.name,
                email: response.data.user.email,
                phone: response.data.user.phone,
                image: response.data.user.image,
                pin: response.data.user.pin,
                email_verified: response.data.user.email_verified,
                phone_verified: response.data.user.phone_verified,
                active: response.data.user.active,
            };

            dispatch(updateUserNotificationCount(userNotificationCount));
            dispatch(updateUserDetails(userDetailsData));

            storeItemLS("userDetailsLS", userDetailsData);
            storeItemLS("userNotificationCountLS", userNotificationCount);

            console.log("Loading App home data complete.");
            return response.data;
        } else {
            console.log("App home data fetch failed:", response.data);
            throw new Error("User not found or request failed");
        }
    } catch (error) {
        console.error("Loading App home data failed:", error.message);
        throw error;
    } finally {
        loadingSetter?.(false);
    }
}

/**
 * Get dashboard data for home screen
 * @param {string} userId - User ID
 * @returns {Promise} Dashboard data
 */
export const getDashboardData = async (userId) => {
    const response = await APIInstance.get('/client/dashboard', {
        params: { user_id: userId }
    });
    return response.data;
}

/**
 * Get dynamic banners for home screen
 * @returns {Promise} Banners data array
 */
export const getBanners = async () => {
    try {
        const response = await APIInstance.get('/client/dashboard/banners');
        return response.data;
    } catch (error) {
        // Temporary mock data for testing UI when endpoint fails/missing
        return [
            { id: '1', image: 'https://cdn.pixabay.com/photo/2016/08/06/18/51/softball-1574962_1280.jpg' },
            { id: '2', image: 'https://cdn.pixabay.com/photo/2016/01/07/16/47/ipad-1126136_1280.jpg' },
            { id: '3', image: 'https://cdn.pixabay.com/photo/2013/04/02/19/53/students-99506_1280.jpg' },
            { id: '4', image: 'https://cdn.pixabay.com/photo/2013/04/10/18/07/child-102577_1280.jpg' },
            { id: '5', image: 'https://cdn.pixabay.com/photo/2023/06/28/18/00/children-8094952_1280.jpg' }
        ];
    }
}
