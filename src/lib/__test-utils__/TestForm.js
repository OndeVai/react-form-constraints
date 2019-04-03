import React, { useState } from 'react'
import { useFormValidation } from '../index'

export default () => {
  const {
    getFormProps,
    getFieldProps,
    validations,
    hasValidatedAll,
    inputVal
  } = useFormValidation()

  const [submitted, setSubmitted] = useState(false)
  return (
    <form
      {...getFormProps({
        id: 'test-form',
        onSubmit: () => setSubmitted(true)
      })}
    >
      <div>
        {submitted && <div className="valid-submit">I'm valid!</div>}
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
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}
