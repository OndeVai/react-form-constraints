import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { useFormValidation } from './lib'
import TestForm from '../src/lib/__test-utils__/TestForm'

const Form = styled.form`
  margin: 0 auto;
  padding: 20px;
  max-width: 600px;
  background-color: whitesmoke;
  border: 1px solid gray;
`

const FieldGroup = styled.div`
  margin-bottom: 20px;
`

const Label = styled.label`
  display: block;
  font-weight: bold;
`

const Input = styled.input`
  display: block;
  margin-top: 4px;
`

const Select = styled.select`
  display: block;
  margin-top: 4px;
`

const ValidationMessage = styled.span`
  color: red;
  display: block;
`

const TestForm1 = () => {
  console.log('render form')
  const {
    getFormProps,
    getFieldProps,
    validations,
    hasValidatedAll,
    inputVal,
    selectVal,
    textAreaVal
  } = useFormValidation()

  return (
    <Form
      {...getFormProps({
        id: 'test-form',
        onSubmit: () => alert(`${inputVal} ${selectVal} ${textAreaVal}`)
      })}
    >
      <FieldGroup>
        <Label htmlFor="inputVal">InputVal</Label>
        <Input
          required
          type="email"
          value={inputVal || ''}
          {...getFieldProps({ name: 'inputVal' })}
        />
        {hasValidatedAll &&
          validations.inputVal &&
          !validations.inputVal.valid && (
            <>
              {validations.inputVal.errors.valueMissing && (
                <ValidationMessage>InputVal is required</ValidationMessage>
              )}
              {validations.inputVal.errors.typeMismatch && (
                <ValidationMessage>
                  InputVal must be a valid email
                </ValidationMessage>
              )}
            </>
          )}
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="selectVal">SelectVal</Label>
        <Select
          required
          value={selectVal || ''}
          {...getFieldProps({ name: 'selectVal' })}
        >
          <option value="">Choose</option>
          <option value="option1">Option1</option>
          <option value="option2">Option2</option>
        </Select>
        {hasValidatedAll &&
          validations.selectVal &&
          !validations.selectVal.valid && (
            <>
              {validations.selectVal.errors.valueMissing && (
                <ValidationMessage>SelectVal is required</ValidationMessage>
              )}
            </>
          )}
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="textAreaVal">TextAreaVal</Label>
        <textarea
          required
          minLength={3}
          value={textAreaVal || ''}
          {...getFieldProps({ name: 'textAreaVal' })}
        />
        {hasValidatedAll &&
          validations.textAreaVal &&
          !validations.textAreaVal.valid && (
            <>
              {validations.textAreaVal.errors.valueMissing && (
                <ValidationMessage>TextAreaVal is required</ValidationMessage>
              )}
              {validations.textAreaVal.errors.tooShort && (
                  <ValidationMessage>TextAreaVal must be at least 3 chars</ValidationMessage>
              )}
            </>
          )}
      </FieldGroup>
      <pre>
        <code>
          Validations:
          <br /> {JSON.stringify(validations, null, 2)}
        </code>
      </pre>
      <div>
        <button type="submit">Submit</button>
      </div>
    </Form>
  )
}

ReactDOM.render(<TestForm />, document.getElementById('root'))
