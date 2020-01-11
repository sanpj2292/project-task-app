import React from "react";
import { Input, Tooltip } from 'antd';

function formatNumber(value) {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

class NumericInput extends React.Component {
  onChange = (e, propsOnChange) => {
    const { value } = e.target;
    const reg = /^[0-9^\-.]*$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      propsOnChange(e);
    }
  };


  render() {
    const { value } = this.props;
    const title = value ? (
      <span className="numeric-input-title">{value !== '-' ? formatNumber(value) : '-'}</span>
    ) : (
      'Input a number'
    );
    const {onChange, addonBefore} = this.props;
    return (
      <Input.Group>
        {addonBefore ? addonBefore:null}
        <Tooltip
        trigger={['focus']}
        title={title}
        placement="topLeft"
        overlayClassName="numeric-input"
      >
        <Input
          onChange={(e) => this.onChange(e, onChange)}
          style={this.props.style}
          disabled={this.props.disabled}
          placeholder="Input a number"
          value={this.props.dataVal ? this.props.dataVal:value}
          maxLength={25}
        />
      </Tooltip>
      </Input.Group>
    );
  }
}


export default NumericInput;