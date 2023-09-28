const roadMapMasterObject: any = {
    // 'studentName': {
    //     type: 'text',
    //     name: 'studentName',
    //     required: true,
    //     selected: true,
    //     value: 'name'
    // },
    // 'email': {
    //     type: 'text',
    //     name: 'email',
    //     required: true,
    //     selected: true,
    //     value: 'name'
    // },
    // 'phNumber': {
    //     type: 'number',
    //     name: 'phNumber',
    //     required: false,
    //     selected: true,
    //     value: 'number'
    // },
    "teacher": {
        registration: {
            start_date: "10-10-2022",
            end_date: "13-10-2022"
        },
        pre_survey: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        },
        dashboard: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        },
        course: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        },
        teams: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        },
        post_survey: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        },
        certificate: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        }
    },
    "student": {
        registration: {
            start_date: "10-10-2022",
            end_date: "13-10-2022"
        },
        pre_survey: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        },
        dashboard: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        },
        course: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        },
        teams: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        },
        post_survey: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        },
        certificate: {
            start_date: "13-10-2022",
            end_date: "15-10-2022"
        }
    },
    getFormObject: (fieldset: any) => {
        const formObject: any = {};
        for (const key in fieldset) {
            if (fieldset[key]) {
                formObject[key] = roadMapMasterObject[key];
            }
        }
        return formObject;
    }
};



export default roadMapMasterObject;