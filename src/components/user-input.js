import React from 'react';
import {AutoComplete} from "antd";

class UserInput extends React.Component{

    render() {
        return  (
            <AutoComplete
                {...this.props}
              style={{ width: 200 }}
              placeholder="Select a User by searching for one"
              filterOption={(inputValue, option) =>
                  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            />
        )
    }
}
export default UserInput;