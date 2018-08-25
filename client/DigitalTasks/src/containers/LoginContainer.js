import
{
    connect
} from 'react-redux';

import

    Login
from '../screens/Login';

import
{
    loginAction
} from '../redux/actions';

const mapStateToProps = (state) =>
{
    return {
        user: state.user
    }
};

const mapDispatchToProps = (dispatch) => 
{
    return {
        loginAction: (user) =>
        {
            dispatch(loginAction(user))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)