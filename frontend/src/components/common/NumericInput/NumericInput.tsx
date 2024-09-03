import React from "react"
import { Input } from "antd"

const NumericInput = (props) => {
  const onChange = (e) => {
    const { value } = e.target
    const reg = /^-?\d*(\.\d*)?$/

    if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
      props.onChange(value)
    }
  }

  return (
    <Input
      {...props}
      onChange={onChange}
      onPressEnter={(e) => e.preventDefault()}
    />
  )
}

export default NumericInput
