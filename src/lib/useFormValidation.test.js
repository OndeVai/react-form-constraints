import React from 'react'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import {
  runMountedTest,
  runSubmit,
  assertValidSubmit,
  runShallowTest
} from './__test-utils__'
//import TestForm from './__test-utils__/TestForm'

configure({ adapter: new Adapter() })

describe('<TestForm/>', () => {
  it('renders without crashing', () => {
    runMountedTest()
  })

  it('matches snapshot', () => {
    runShallowTest(wrapper => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

  describe('getFormProps()', () => {
    it('prevents consumer submit if invalid input', () => {
      runMountedTest(wrapper => {
        assertValidSubmit(wrapper, false)()
      })
    })

    it('calls consumer submit if valid input', () => {
      runMountedTest(wrapper => {
        wrapper.find('[name="inputVal"]').simulate('change', {
          target: { value: 'ttt@email.com', name: 'inputVal' }
        })
        wrapper.find('[name="selectVal"]').simulate('change', {
          target: { value: 'xxxx', name: 'selectVal' }
        })
        assertValidSubmit(wrapper, true)()
      })
    })

    it('calls e.preventDefault() on submit', () => {
      runMountedTest(wrapper => {
        const e = {
          preventDefault: jest.fn()
        }
        runSubmit(wrapper, e)()
        expect(e.preventDefault).toHaveBeenCalled()
      })
    })

    it('returns valid on submit', () => {
      runMountedTest(wrapper => {
        const e = {
          preventDefault: jest.fn()
        }
        runSubmit(wrapper, e)()
        expect(e.preventDefault).toHaveBeenCalled()
      })
    })


    //returns valid validation state based on form state

    //
  })

  describe('getFieldProps()', () => {
    it('adds the name prop that is passed in', () => {
      runShallowTest(wrapper => {
        const name = wrapper.find('[name="inputVal"]').props().name
        expect(name).toBe('inputVal')
      })
    })
  })
})
