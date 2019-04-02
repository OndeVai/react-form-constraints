import { useState, useEffect } from 'react'

const queryDomRoot = (domRoot, selector, all = false) => {
  const domResults = domRoot[!all ? 'querySelector' : 'querySelectorAll'](
    selector
  )
  return !all ? domResults : Array.from(domResults)
}

const getValidityForInput = (input, customValidations, fieldVals) => {
  const inputValidity = input.validity
  const html5Results = {
    valid: inputValidity.valid,
    errors: {
      badInput: inputValidity.badInput,
      customError: inputValidity.customError,
      patternMismatch: inputValidity.patternMismatch,
      rangeOverflow: inputValidity.rangeOverflow,
      rangeUnderflow: inputValidity.rangeUnderflow,
      stepMismatch: inputValidity.stepMismatch,
      tooLong: inputValidity.tooLong,
      tooShort: inputValidity.tooShort,
      typeMismatch: inputValidity.typeMismatch,
      valueMissing: inputValidity.valueMissing
    }
  }

  const customErrors = customValidations.reduce((prev, curr) => {
    const customResult = curr(input.value, fieldVals) //todo
    return { ...prev, ...customResult }
  }, {})

  const results = {
    ...html5Results,
    ...{ errors: { ...html5Results.errors, ...customErrors } }
  }

  return {
    ...results,
    valid: !Object.keys(results.errors).some(r => results.errors[r])
  }
}

const getValidationState = (
  inputName,
  validity,
  validations,
  validationExtra = {}
) => {
  const thisStateInput = validations[inputName] || {}

  return {
    ...validations,
    [inputName]: {
      ...thisStateInput,
      ...validity,
      ...validationExtra
    }
  }
}

export default (options = {}) => {
  const { customValidations = {}, mapProps } = options
  const [hasValidatedAll, setHasValidatedAll] = useState(false)
  const [validations, setValidations] = useState({})
  const [fieldVals, setFieldVals] = useState({})
  const [shouldFocusFirstInvalid, setShouldFocusFirstInvalid] = useState(false)

  useEffect(() => {
    if (!shouldFocusFirstInvalid) return
    const firstInvalidName = getFirstInvalid()
    if (firstInvalidName) {
      queryDomInput(firstInvalidName).focus()
    }
  })

  let myRootId

  const domRoot = () => document.getElementById(myRootId)

  const queryDom = (selector, all = false) =>
    queryDomRoot(domRoot(), selector, all)

  const queryDomInput = inputName => queryDom(`[name="${inputName}"]`)

  const getInputValidity = inputName =>
    getValidityForInput(
      queryDomInput(inputName),
      getCustomValidations(inputName),
      fieldVals
    )

  const getCustomValidations = inputName => {
    return Object.keys(customValidations)
      .filter(key => {
        if (key === inputName) {
          return true
        } else {
          return queryDom(key, true).some(({ attributes }) => {
            const { name } = attributes
            return name && name.value === inputName
          })
        }
      })
      .map(key => customValidations[key])
  }

  const setValidationStateForInput = (inputName, validationExtra = {}) => {
    setValidations(getValidationStateForInput(inputName, validationExtra))
  }

  const getValidationStateForInput = (inputName, validationExtra = {}) =>
    getValidationState(
      inputName,
      getInputValidity(inputName),
      validations,
      validationExtra
    )

  const setValidationStateForInputTouched = inputName => {
    setValidations(getValidationStateForInputTouched(inputName))
  }

  const getValidationStateForInputTouched = inputName =>
    getValidationStateForInput(inputName, { touched: true })

  const validatePropOnChange = e => {
    const { name, value } = e.target
    setFieldVals(prevFieldVals => ({ ...prevFieldVals, [name]: value }))
    setValidationStateForInput(name, { dirty: true })
  }

  const handleBlur = e => {
    const { name } = e.target
    setValidationStateForInputTouched(name)
  }

  const validatePropOnBlur = e => {
    e.persist()
    setTimeout(() => {
      if (domRoot()) {
        setShouldFocusFirstInvalid(false)
        handleBlur(e)
      }
    }, 100)
  }

  const getFirstInvalid = (currValidations = validations) =>
    Object.keys(currValidations).find(key => !currValidations[key].valid)

  const validateAll = () => {
    const validations = queryDom('input,select,textarea', true)
      .filter(({ attributes }) => attributes.name)
      .map(({ attributes }) => attributes.name.value)
      .reduce(
        (prev, inputName) => ({
          ...prev,
          ...getValidationStateForInputTouched(inputName)
        }),
        {}
      )

    //todo fix reduce above instead of needing this mutation
    Object.keys(validations).forEach(key => {
      validations[key].touched = true
    })

    setHasValidatedAll(true)
    setValidations(validations)
    setShouldFocusFirstInvalid(true)

    return !getFirstInvalid(validations)
  }

  const propsUpdated = mapProps
    ? { ...mapProps(), ...fieldVals }
    : { ...fieldVals }

  return {
    hasValidatedAll,
    validations: { ...validations },
    getFieldProps: ({
      name,
      onBlur = () => {},
      onChange = () => {},
      ...props
    }) => {
      if (!name) throw new Error('you must supply a name to getFieldProps') //todo make optional - persist guid
      return {
        name,
        onBlur: e => {
          validatePropOnBlur(e)
          onBlur(e)
        },
        onChange: e => {
          validatePropOnChange(e)
          onChange(e)
        },
        ...props
      }
    },
    getFormProps: ({ id, onSubmit = () => {}, ...props }) => {
      if (!id) throw new Error('you must supply an id to getFormProps') //todo make optional - persist guid
      myRootId = id
      return {
        id,
        noValidate: true,
        onSubmit: e => {
          e.preventDefault()

          const isValid = validateAll()
          if (!isValid) return

          onSubmit()
        },
        ...props
      }
    },
    ...propsUpdated
  }
}
