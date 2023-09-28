
export default interface ILogAttributes {
    log_id: number;
    log_type: Enumerator;
    date: Date;
    message: string;
    ip: string;
    method:Enumerator;
    route: string;
    status_code: Enumerator;
    token: string;
    headers: string;
    req_body: string;
    res_body: string;
    user_details: string;
    logged_at: Date;
}
