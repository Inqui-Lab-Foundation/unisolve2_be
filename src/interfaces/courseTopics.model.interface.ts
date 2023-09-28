export default interface courseTopicsAttribute {
    course_topic_id: number;
    course_module_id: number;
    topic_type_id: number;
    topic_type: Enumerator;
    title: string;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}