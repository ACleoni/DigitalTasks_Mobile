import 
{
    REGISTER,
    LOGIN
} from './index';

const login = (user) => dispatch =>
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
    login
}

export default
{
    login
}

