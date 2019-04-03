import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import { runMountedTest } from './__test-utils__'
import TestForm from './__test-utils__/TestForm'

configure({ adapter: new Adapter() })

const assertValidSubmit = (wrapper, expectedIsValidSubmit) => () => {
  const form = wrapper.find('form')
  form.simulate('submit', { preventDefault: () => {} })
  const isValidSubmit = wrapper.find('.valid-submit').exists()
  expect(isValidSubmit).toBe(expectedIsValidSubmit)
}

//todo jest e.preventDefault() onSubmit called (need spy)

describe('<TestForm/>', () => {
  it('renders without crashing', () => {
    runMountedTest()
  })

  it('matches snapshot', () => {
    const wrapper = shallow(<TestForm />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('prevents consumer submit if invalid input', () => {
    runMountedTest(wrapper => {
      assertValidSubmit(wrapper, false)()
    })
  })

  it('calls consumer submit if valid input', () => {
    runMountedTest(wrapper => {
      wrapper
        .find('[name="inputVal"]')
        .simulate('change', { target: { value: 'ttt@email.com', name: 'inputVal' } })
      assertValidSubmit(wrapper, true)()
    })
  })

  describe('getFieldProps()', () => {
    it('adds the name prop that is passed in', () => {
      const wrapper = shallow(<TestForm />)
      const name = wrapper.find('[name="inputVal"]').props().name
      expect(name).toBe('inputVal')
    })
  })
})
