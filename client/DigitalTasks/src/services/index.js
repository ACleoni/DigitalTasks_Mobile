class Utils
{
    inheritPropStyles(propStyleKeys = [], props = {})
    {
        let style = {}
        propStyleKeys.map(() => 
            {
                const propStyleValue = props[propStyleKey];
                if (propStyleValue !== undefined && propStyleValue !== null && propStyleValue !== false ) 
                {
                    style = {
                        ...style,
                        [propStyleKey]: propStyleValue
                    }
                }
                return propStyleKey
            }
        );

        if (props.style)
        {
            return style = {
                ...style,
                ...props.style
            }
        }
        return style
    }
}