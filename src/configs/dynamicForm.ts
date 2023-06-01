const dynamicSignupFormMasterObject: any = {
    'studentName': {
        type: 'text',
        name: 'studentName',
        required: true,
        selected: true,
        value: 'name'
    },
    'email': {
        type: 'text',
        name: 'email',
        required: true,
        selected: true,
        value: 'name'
    },
    'phNumber': {
        type: 'number',
        name: 'phNumber',
        required: false,
        selected: true,
        value: 'number'
    },
    getFormObject: (fieldset: any) => {
        const formObject: any = {};
        for (const key in fieldset) {
            if (fieldset[key]) {
                formObject[key] = dynamicSignupFormMasterObject[key];
            }
        }
        return formObject;
    }
};



export default dynamicSignupFormMasterObject;