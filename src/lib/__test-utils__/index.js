import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { mount } from 'enzyme/build'
import TestForm from './TestForm'

export const runMountedTest = (testCallback = () => {}) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const wrapper = mount(<TestForm />, { attachTo: container })
  testCallback(wrapper)
  wrapper.unmount()
  unmountComponentAtNode(container)
}
