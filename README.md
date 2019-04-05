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
import ReactDOM from 'react-dom'
import { useFormValidation } from './lib'

const TestForm = () => {
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
    <form
      {...getFormProps({
        id: 'test-form',
        onSubmit: () => alert(`${inputVal} ${selectVal} ${textAreaVal}`)
      })}
    >
      <div>
        <label htmlFor="inputVal">InputVal</label>
        <input
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
                <span>InputVal is required</span>
              )}
              {validations.inputVal.errors.typeMismatch && (
                <span>InputVal must be a valid email</span>
              )}
            </>
          )}
      </div>
      <div>
        <label htmlFor="selectVal">SelectVal</label>
        <select
          required
          value={selectVal || ''}
          {...getFieldProps({ name: 'selectVal' })}
        >
          <option value="">Choose</option>
          <option value="option1">Option1</option>
          <option value="option2">Option2</option>
        </select>
        {hasValidatedAll &&
          validations.selectVal &&
          !validations.selectVal.valid && (
            <>
              {validations.selectVal.errors.valueMissing && (
                <span>SelectVal is required</span>
              )}
            </>
          )}
      </div>
      <div>
        <label htmlFor="textAreaVal">TextAreaVal</label>
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
                <span>TextAreaVal is required</span>
              )}
              {validations.textAreaVal.errors.tooShort && (
                <span>TextAreaVal must be at least 3 chars</span>
              )}
            </>
          )}
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}
```
