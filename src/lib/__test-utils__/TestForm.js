import React from 'react'
import { useFormValidation } from '../index'

export default ({ onSubmit = () => {}, ...props }) => {
  const {
    getFormProps,
    getFieldProps,
    validations,
    hasValidatedAll,
    inputVal,
    selectVal
  } = useFormValidation()

  return (
    <form
      {...getFormProps({
        id: 'test-form',
        'data-test-id': 'some-id',
        onSubmit,
        ...props
      })}
    >
      <div>
        {hasValidatedAll && <span id="hasValidatedAll">All validated</span>}
        <label htmlFor="inputVal">InputVal</label>
        <input
          required
          type="email"
          value={inputVal || ''}
          {...getFieldProps({ name: 'inputVal', id: 'input-val' })}
        />
        {hasValidatedAll &&
          validations.inputVal &&
          !validations.inputVal.valid && (
            <>
              {validations.inputVal.errors.valueMissing && (
                <span id="requiredInput">InputVal is required</span>
              )}
              {validations.inputVal.errors.typeMismatch && (
                <span id="validEmail">InputVal must be a valid email</span>
              )}
            </>
          )}
      </div>
      <div>
        <label htmlFor="selectVal">selectVal</label>
        <input
          required
          value={selectVal || ''}
          {...getFieldProps({ name: 'selectVal' })}
        />
        {hasValidatedAll &&
          validations.selectVal &&
          !validations.selectVal.valid && (
            <>
              {validations.selectVal.errors.valueMissing && (
                <span id="requiredSelect">selectVal is required</span>
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
