
const updateState = (state, key, action) => {
    const error = action.payload === '' || !action.payload;

    return {
        ...state,
        [key]: {
            error: error,
            value: action.payload
        }
    }
}

const postReducer = (state, action) => {

    switch (action.type) {
        case 'update-title':
            return updateState(state, 'title', action);

        case 'update-endAt':
            return updateState(state, 'endAt', action);

        case 'update-salary':
            return updateState(state, 'salary', action);

        case 'update-quantity':
            return updateState(state, 'quantity', action);

        case 'update-gender':
            return updateState(state, 'gender', action);

        case 'update-specializationId':
            return updateState(state, 'specializationId', action);

        case 'update-workingTimeId':
            return updateState(state, 'workingTimeId', action);

        case 'update-levelId':
            return updateState(state, 'levelId', action);

        case 'update-experiencePostId':
            return updateState(state, 'experiencePostId', action);

        case 'update-description':
            return updateState(state, 'description', action);

        case 'update-requirments':
            return updateState(state, 'requirments', action);

        case 'update-benefits':
            return updateState(state, 'benefits', action);

        default:
            return state
    }

}

export default postReducer;