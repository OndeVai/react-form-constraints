import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { mount, shallow } from 'enzyme'
import TestForm from './TestForm'

export const runMountedTest = (testCallback = () => {}) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const wrapper = mount(<TestForm />, { attachTo: container })
  testCallback(wrapper)
  wrapper.unmount()
  unmountComponentAtNode(container)
}

export const runShallowTest = testCallback => {
  const wrapper = shallow(<TestForm />)
  testCallback(wrapper)
}

export const runSubmit = (wrapper, e = { preventDefault: () => {} }) => () => {
  const form = wrapper.find('form')
  form.simulate('submit', e)
}

export const assertValidSubmit = (wrapper, expectedIsValidSubmit) => () => {
  const onSubmit = jest.fn()
  wrapper.setProps({ onSubmit })
  runSubmit(wrapper)()
  expect(onSubmit).toHaveBeenCalledTimes(expectedIsValidSubmit ? 1 : 0)
}

export const setFormVals = wrapper => (inputVal, selectVal = '') => {
  wrapper.find('[name="inputVal"]').simulate('change', {
    target: { value: inputVal, name: 'inputVal' }
  })
  wrapper.find('[name="selectVal"]').simulate('change', {
    target: { value: selectVal, name: 'selectVal' }
  })
}

const getField = (wrapper, name) => wrapper.find(`[name="${name}"]`)

export const getInputValField = wrapper => () => getField(wrapper, 'inputVal')
export const getSelectValField = wrapper => () => getField(wrapper, 'selectVal')
