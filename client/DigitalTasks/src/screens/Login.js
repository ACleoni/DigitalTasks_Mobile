import React,
{
    Component
} from 'react';

import
{
    View,
    Text,
    Stylesheet
} from 'react-native';

class Login extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            email: ''
        }
    }

    render()
    {
        return (
            <View>
                <Text>
                    Hello World
                </Text>      
            </View>
        )
    }
}

export default Login