"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/objectWithoutProperties"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/defineProperty"));

var _objectSpread4 = _interopRequireDefault(require("@babel/runtime/helpers/esm/objectSpread"));

var _react = require("react");

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

    return (0, _objectSpread4.default)({}, prev, customResult);
  }, {});
  var results = (0, _objectSpread4.default)({}, html5Results, {
    errors: (0, _objectSpread4.default)({}, html5Results.errors, customErrors)
  });
  return (0, _objectSpread4.default)({}, results, {
    valid: !Object.keys(results.errors).some(function (r) {
      return results.errors[r];
    })
  });
};

var getValidationState = function getValidationState(inputName, validity, validations) {
  var validationExtra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var thisStateInput = validations[inputName] || {};
  return (0, _objectSpread4.default)({}, validations, (0, _defineProperty2.default)({}, inputName, (0, _objectSpread4.default)({}, thisStateInput, validity, validationExtra)));
};

var _default = function _default() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$customValida = options.customValidations,
      customValidations = _options$customValida === void 0 ? {} : _options$customValida,
      mapProps = options.mapProps;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      hasValidatedAll = _useState2[0],
      setHasValidatedAll = _useState2[1];

  var _useState3 = (0, _react.useState)({}),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      validations = _useState4[0],
      setValidations = _useState4[1];

  var _useState5 = (0, _react.useState)({}),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      fieldVals = _useState6[0],
      setFieldVals = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
      shouldFocusFirstInvalid = _useState8[0],
      setShouldFocusFirstInvalid = _useState8[1];

  (0, _react.useEffect)(function () {
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
    setFieldVals(function (prevFieldVals) {
      return (0, _objectSpread4.default)({}, prevFieldVals, (0, _defineProperty2.default)({}, name, value));
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
    setTimeout(function () {
      if (domRoot()) {
        setShouldFocusFirstInvalid(false);
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
      prev[name] = (0, _objectSpread4.default)({}, validity, {
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

  var propsUpdated = mapProps ? (0, _objectSpread4.default)({}, mapProps(), fieldVals) : (0, _objectSpread4.default)({}, fieldVals);
  return (0, _objectSpread4.default)({
    hasValidatedAll: hasValidatedAll,
    validations: (0, _objectSpread4.default)({}, validations),
    getFieldProps: function getFieldProps(_ref4) {
      var name = _ref4.name,
          _ref4$onBlur = _ref4.onBlur,
          _onBlur = _ref4$onBlur === void 0 ? function () {} : _ref4$onBlur,
          _ref4$onChange = _ref4.onChange,
          _onChange = _ref4$onChange === void 0 ? function () {} : _ref4$onChange,
          props = (0, _objectWithoutProperties2.default)(_ref4, ["name", "onBlur", "onChange"]);

      if (!name) throw new Error('you must supply a name to getFieldProps'); //todo make optional - persist guid

      return (0, _objectSpread4.default)({
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
          props = (0, _objectWithoutProperties2.default)(_ref5, ["id", "onSubmit"]);

      if (!id) throw new Error('you must supply an id to getFormProps'); //todo make optional - persist guid

      myRootId = id;
      return (0, _objectSpread4.default)({
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
};

exports.default = _default;