import 
{
    REGISTER,
    LOGIN
} from './index';

const loginAction = (user) => dispatch =>
{
    dispatch(
        {
            type: LOGIN,
            payload: 'Logging In'
        }
    )
}

export
{
    loginAction
}

export default
{
    loginAction
}

