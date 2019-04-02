import React from 'react'
import ReactDOM from 'react-dom'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { useFormValidation } from './index'

configure({ adapter: new Adapter() })

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
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<TestForm />, div)
  ReactDOM.unmountComponentAtNode(div)
})

it('App loads with initial state of ""', () => {
  const wrapper = shallow(<TestForm />)
  const text = wrapper.find('input').props().value
  expect(text).toEqual('')
})
