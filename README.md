## Description
A custom React hook for implementing HTML5 form validation using the Constraints API.

## Getting Started

```
npm install react-form-constraints
```

## Dependencies
```
"react": "^16.8.6",
"react-dom": "^16.8.6"
```

## Usage

```javascript
import React from 'react'
import { useFormValidation } from 'react-form-constraints'

const TestForm = () => {
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
                <ValidationMessage>
                  TextAreaVal must be at least 3 chars
                </ValidationMessage>
              )}
            </>
          )}
      </FieldGroup>
      <div>
        <button type="submit">Submit</button>
      </div>
    </Form>
  )
}
```
