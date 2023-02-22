const setFieldState = (state, key, payload) => ({
    ...state,
    [key]: payload
})

const updateField = (state, key, field, payload) => ({
    ...state,
    [key]: [...state[key].map(education => education.id === payload.id ? {
        ...education,
        [field]: payload.value
    } : education)]
})

const reducer = (state, action) => {

    switch (action.type) {
        case 'set_state':
            return {
                ...state,
                ...action.payload
            }
        case 'set_name':
            return setFieldState(state, 'name', action.payload)
        case 'set_email':
            return setFieldState(state, 'email', action.payload)
        case 'set_gender':
            return setFieldState(state, 'gender', action.payload)
        case 'set_phone':
            return setFieldState(state, 'phone', action.payload)
        case 'set_dob':
            return setFieldState(state, 'dob', action.payload)
        case 'set_address':
            return setFieldState(state, 'address', action.payload)
        case 'set_fullName':
            return setFieldState(state, 'fullName', action.payload)
        case 'set_position':
            return setFieldState(state, 'position', action.payload)
        case 'set_overView':
            return setFieldState(state, 'overView', action.payload)
        case 'create_education':
            return {
                ...state,
                Education: [
                    ...state.Education,
                    {
                        id: new Date().valueOf() + '',
                        name: '',
                        description: '',
                        startAt: '',
                        endAt: ''
                    }
                ]
            }
        case 'delete_education':
            return {
                ...state,
                Education: [...state.Education.filter(education => education.id !== action.payload)]
            }
        case 'create_experience':
            return {
                ...state,
                Experiences: [
                    ...state.Experiences,
                    {
                        id: new Date().valueOf() + '',
                        name: '',
                        description: '',
                        startAt: '',
                        endAt: ''
                    }
                ]
            }
        case 'delete_experience':
            return {
                ...state,
                Experiences: [...state.Experiences.filter(experience => experience.id !== action.payload)]
            }
        case 'create_certification':
            return {
                ...state,
                Certifications: [
                    ...state.Certifications,
                    {
                        id: new Date().valueOf() + '',
                        name: '',
                        description: '',
                        startAt: '',
                        endAt: ''
                    }
                ]
            }
        case 'delete_certification':
            return {
                ...state,
                Certifications: [...state.Certifications.filter(certification => certification.id !== action.payload)]
            }
        case 'create_skill':
            return {
                ...state,
                Skills: [
                    ...state.Skills,
                    {
                        id: new Date().valueOf() + '',
                        name: '',
                    }
                ]
            }
        case 'delete_skill':
            return {
                ...state,
                Skills: [...state.Skills.filter(skill => skill.id !== action.payload)]
            }
        case 'update_education_startAt':
            return updateField(state, 'Education', 'startAt', action.payload);
        case 'update_education_endAt':
            return updateField(state, 'Education', 'endAt', action.payload);
        case 'update_education_name':
            return updateField(state, 'Education', 'name', action.payload);
        case 'update_education_description':
            return updateField(state, 'Education', 'description', action.payload);

        case 'update_experience_startAt':
            return updateField(state, 'Experiences', 'startAt', action.payload);
        case 'update_experience_endAt':
            return updateField(state, 'Experiences', 'endAt', action.payload);
        case 'update_experience_name':
            return updateField(state, 'Experiences', 'name', action.payload);
        case 'update_experience_description':
            return updateField(state, 'Experiences', 'description', action.payload);

        case 'update_certification_startAt':
            return updateField(state, 'Certifications', 'startAt', action.payload);
        case 'update_certification_endAt':
            return updateField(state, 'Certifications', 'endAt', action.payload);
        case 'update_certification_name':
            return updateField(state, 'Certifications', 'name', action.payload);
        case 'update_certification_description':
            return updateField(state, 'Certifications', 'description', action.payload);

        case 'update_skill_name':
            return updateField(state, 'Skills', 'name', action.payload);
        case 'set_image':
            return setFieldState(state, 'pictureChange', action.payload);
        case 'set_null':
            return null;
        default:
            return state;
    }
}

export default reducer;