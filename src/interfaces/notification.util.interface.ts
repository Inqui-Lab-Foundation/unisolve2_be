
export default interface INotificationUtil {
    notification_type: string;
    target_audience: string;
    title: string;
    image: string;
    message: string;
    status: string;
    created_by: string|number;
}
