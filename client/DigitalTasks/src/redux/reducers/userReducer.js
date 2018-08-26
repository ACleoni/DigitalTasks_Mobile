import
{
    LOGIN,
    REGISTER
} from '../actions';


const initState = 
{
    currentAccountStatus: [],
    newAccountStatus: []
}


const user = (state = initState, action) =>
{
    switch(action.type)
    {
        case LOGIN:
            return {
                ...state,
                currentAccountStatus: action.payload
            }
        case REGISTER:
            return {
                ...state,
                newAccountStatus: action.payload
            }
        default:
            return state
    }
}

export default user
    