export default interface INotificationAttributes {
    notification_id: number;
    notification_type: Enumerator;
    target_audience: string;
    title: string;
    image: string;
    message: string;
    read_by: string;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}