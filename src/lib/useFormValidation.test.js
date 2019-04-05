import React from 'react'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import {
  runMountedTest,
  runSubmit,
  assertValidSubmit,
  runShallowTest,
  setFormVals,
  getInputValField
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
        setFormVals(wrapper)('ttt@email.com', '1')
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

    it.each([
      ['', '', true, false, true],
      ['xxx', '', false, true, true],
      ['xxx', '1', false, true, false],
      ['', '1', true, false, false],
      ['xxx@email.com', '1', false, false, false]
    ])(
      'returns correct validation state based on form state {inputVal: %s, selectVal: %s}',
      (
        inputVal,
        selectVal,
        requiredInputValErrorExists,
        validEmailErrorExists,
        requiredSelectValErrorExists
      ) => {
        runMountedTest(wrapper => {
          const setFormValsForWrapper = setFormVals(wrapper)
          const runSubmitForWrapper = runSubmit(wrapper)

          //no values for both
          setFormValsForWrapper(inputVal, selectVal)
          runSubmitForWrapper()
          expect(wrapper.find('#requiredInput').exists()).toBe(
            requiredInputValErrorExists
          )
          expect(wrapper.find('#validEmail').exists()).toBe(
            validEmailErrorExists
          )
          expect(wrapper.find('#requiredSelect').exists()).toBe(
            requiredSelectValErrorExists
          )
        })
      }
    )

    it('returns correct value for hasValidatedAll after submit', () => {
      runMountedTest(wrapper => {
        expect(wrapper.find('#hasValidatedAll').exists()).toBe(false)
        runSubmit(wrapper)()
        expect(wrapper.find('#hasValidatedAll').exists()).toBe(true)
      })
    })

    it('adds the props that are passed in', () => {
      runShallowTest(wrapper => {
        const { ['data-test-id']: testId, id } = wrapper.find('form').props()
        expect(testId).toBe('some-id')
        expect(id).toBe('test-form')
      })
    })
  })

  describe('getFieldProps()', () => {
    it('adds the props that are passed in', () => {
      runShallowTest(wrapper => {
        const { name, id } = getInputValField(wrapper)().props()
        expect(name).toBe('inputVal')
        expect(id).toBe('input-val')
      })
    })

    //jsdom doesn't seem to work properly for this one
    xit('triggers validation when field values change', () => {
      runMountedTest(wrapper => {
        const setFormValsForWrapper = setFormVals(wrapper)
        setFormValsForWrapper('valid@email.com', '1')
        runSubmit(wrapper)()
        expect(wrapper.find('#requiredInput').exists()).toBe(false)
        setFormValsForWrapper('xxx', '1')
        //expect(wrapper.find('#hasValidatedAll').exists()).toBe(true)
        expect(wrapper.find('#validEmail').exists()).toBe(true)
      })
    })
  })
})
