
export interface courseModuleAttributes {
    course_module_id: number;
    course_id: string;
    title: string;
    description: string;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}

export interface teamAttributes {
    team_id: number;
    team_name: string;
    mentor_id: string;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}
