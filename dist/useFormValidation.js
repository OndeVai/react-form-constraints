import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import { useState, useEffect, useCallback } from 'react';

var queryDomRoot = function queryDomRoot(domRoot, selector) {
  var all = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var domResults = domRoot[!all ? 'querySelector' : 'querySelectorAll'](selector);
  return !all ? domResults : Array.from(domResults);
};

var getValidityForInput = function getValidityForInput(input, customValidations, fieldVals) {
  var inputValidity = input.validity;
  var html5Results = {
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
  };
  var customErrors = customValidations.reduce(function (prev, curr) {
    var customResult = curr(input.value, fieldVals); //todo

    return _objectSpread({}, prev, customResult);
  }, {});

  var results = _objectSpread({}, html5Results, {
    errors: _objectSpread({}, html5Results.errors, customErrors)
  });

  return _objectSpread({}, results, {
    valid: !Object.keys(results.errors).some(function (r) {
      return results.errors[r];
    })
  });
};

var getValidationState = function getValidationState(inputName, validity, validations) {
  var validationExtra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var thisStateInput = validations[inputName] || {};
  return _objectSpread({}, validations, _defineProperty({}, inputName, _objectSpread({}, thisStateInput, validity, validationExtra)));
};

export default (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$customValida = options.customValidations,
      customValidations = _options$customValida === void 0 ? {} : _options$customValida,
      mapProps = options.mapProps;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      hasValidatedAll = _useState2[0],
      origSetHasValidatedAll = _useState2[1];

  var _useState3 = useState({}),
      _useState4 = _slicedToArray(_useState3, 2),
      validations = _useState4[0],
      setValidations = _useState4[1];

  var _useState5 = useState({}),
      _useState6 = _slicedToArray(_useState5, 2),
      fieldVals = _useState6[0],
      setFieldVals = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      shouldFocusFirstInvalid = _useState8[0],
      origSetShouldFocusFirstInvalid = _useState8[1];

  var setShouldFocusFirstInvalid = useCallback(function (val) {
    if (val !== shouldFocusFirstInvalid) {
      origSetShouldFocusFirstInvalid(val);
    }
  }, [shouldFocusFirstInvalid]);
  var setHasValidatedAll = useCallback(function (val) {
    if (val !== hasValidatedAll) {
      origSetHasValidatedAll(val);
    }
  }, [hasValidatedAll]);
  useEffect(function () {
    if (!shouldFocusFirstInvalid) return;
    var firstInvalidName = getFirstInvalid();

    if (firstInvalidName) {
      queryDomInput(firstInvalidName).focus();
    }
  });
  var myRootId;

  var domRoot = function domRoot() {
    return document.getElementById(myRootId);
  };

  var queryDom = function queryDom(selector) {
    var all = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return queryDomRoot(domRoot(), selector, all);
  };

  var queryDomInput = function queryDomInput(inputName) {
    return queryDom("[name=\"".concat(inputName, "\"]"));
  };

  var getInputValidity = function getInputValidity(inputName) {
    return getValidityForInput(queryDomInput(inputName), getCustomValidations(inputName), fieldVals);
  };

  var getCustomValidations = function getCustomValidations(inputName) {
    return Object.keys(customValidations).filter(function (key) {
      if (key === inputName) {
        return true;
      } else {
        return queryDom(key, true).some(function (_ref) {
          var attributes = _ref.attributes;
          var name = attributes.name;
          return name && name.value === inputName;
        });
      }
    }).map(function (key) {
      return customValidations[key];
    });
  };

  var setValidationStateForInput = function setValidationStateForInput(inputName) {
    var validationExtra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    setValidations(getValidationStateForInput(inputName, validationExtra));
  };

  var getValidationStateForInput = function getValidationStateForInput(inputName) {
    var validationExtra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return getValidationState(inputName, getInputValidity(inputName), validations, validationExtra);
  };

  var setValidationStateForInputTouched = function setValidationStateForInputTouched(inputName) {
    setValidations(getValidationStateForInputTouched(inputName));
  };

  var getValidationStateForInputTouched = function getValidationStateForInputTouched(inputName) {
    return getValidationStateForInput(inputName, {
      touched: true
    });
  };

  var validatePropOnChange = function validatePropOnChange(e) {
    var _e$target = e.target,
        name = _e$target.name,
        value = _e$target.value;
    setShouldFocusFirstInvalid(false);
    setFieldVals(function (prevFieldVals) {
      return _objectSpread({}, prevFieldVals, _defineProperty({}, name, value));
    });
    setValidationStateForInput(name, {
      dirty: true
    });
  };

  var handleBlur = function handleBlur(e) {
    var name = e.target.name;
    setValidationStateForInputTouched(name);
  };

  var validatePropOnBlur = function validatePropOnBlur(e) {
    e.persist();
    setShouldFocusFirstInvalid(false);
    setTimeout(function () {
      if (domRoot()) {
        handleBlur(e);
      }
    }, 100);
  };

  var getFirstInvalid = function getFirstInvalid() {
    var currValidations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : validations;
    return Object.keys(currValidations).find(function (key) {
      return !currValidations[key].valid;
    });
  };

  var validateAll = function validateAll() {
    var validationsUpd = queryDom('input,select,textarea', true).filter(function (_ref2) {
      var attributes = _ref2.attributes;
      return attributes.name && attributes.name.value;
    }).map(function (input) {
      return {
        name: input.attributes.name.value,
        validity: getValidityForInput(input, getCustomValidations(customValidations), fieldVals)
      };
    }).reduce(function (prev, _ref3) {
      var name = _ref3.name,
          validity = _ref3.validity;
      prev[name] = _objectSpread({}, validity, {
        touched: true,
        dirty: (validations[name] || {}).dirty || false
      });
      return prev;
    }, {});
    setHasValidatedAll(true);
    setValidations(validationsUpd);
    setShouldFocusFirstInvalid(true);
    return !getFirstInvalid(validationsUpd);
  };

  var propsUpdated = mapProps ? _objectSpread({}, mapProps(), fieldVals) : _objectSpread({}, fieldVals);
  return _objectSpread({
    hasValidatedAll: hasValidatedAll,
    validations: _objectSpread({}, validations),
    getFieldProps: function getFieldProps(_ref4) {
      var name = _ref4.name,
          _ref4$onBlur = _ref4.onBlur,
          _onBlur = _ref4$onBlur === void 0 ? function () {} : _ref4$onBlur,
          _ref4$onChange = _ref4.onChange,
          _onChange = _ref4$onChange === void 0 ? function () {} : _ref4$onChange,
          props = _objectWithoutProperties(_ref4, ["name", "onBlur", "onChange"]);

      if (!name) throw new Error('you must supply a name to getFieldProps'); //todo make optional - persist guid

      return _objectSpread({
        name: name,
        onBlur: function onBlur(e) {
          validatePropOnBlur(e);

          _onBlur(e);
        },
        onChange: function onChange(e) {
          validatePropOnChange(e);

          _onChange(e);
        }
      }, props);
    },
    getFormProps: function getFormProps(_ref5) {
      var id = _ref5.id,
          _ref5$onSubmit = _ref5.onSubmit,
          _onSubmit = _ref5$onSubmit === void 0 ? function () {} : _ref5$onSubmit,
          props = _objectWithoutProperties(_ref5, ["id", "onSubmit"]);

      if (!id) throw new Error('you must supply an id to getFormProps'); //todo make optional - persist guid

      myRootId = id;
      return _objectSpread({
        id: id,
        noValidate: true,
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          var isValid = validateAll();
          if (!isValid) return;

          _onSubmit();
        }
      }, props);
    }
  }, propsUpdated);
});