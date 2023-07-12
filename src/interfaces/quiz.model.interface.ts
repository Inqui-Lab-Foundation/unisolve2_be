export default interface quizAttribute {
    quiz_id: number;
    quiz_name: string;
    category: string;
    no_of_question: number;
    cut_off: number;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}