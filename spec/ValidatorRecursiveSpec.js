'use strict';
describe("Validator recursive", function () {

  let validator = require('../treeValidator');
  beforeAll(() => {
    validator.setRules({
      a: {
        type: 'string',
        format: '0:5'
      },
      b: {
        type: 'number',
        required: true
      },
      c: {
        x: {
          type: 'date',
          format: 'dd-MM-yy'
        },
        y: {
          type: 'email'
        },
        f: {
          g: {
            type: 'date',
            format: 'dd-MM-yyyy'
          }
        }
      },
      d: {
        type: 'number',
        format: '2:2'
      }
    });
  })

  it('Should be able to check recursively', function () {
    let errors;
    expect(validator.isValid({
      a: "test",
      b: 7,
      c: {
        x: "12-12-16",
        y: 'test@ex.com',
        f: {
          g: "01-01-2010"
        }
      },
      d: "02,02"
    })).toBeTruthy();

    expect(validator.isValid({
      a: "test",
      b: 7,
      c: {
        x: "12-12-2016",
        y: 'test',
        f: {
          g: "1-1-10"
        }
      },
      d: "02,02"
    })).toBeFalsy();
    errors = validator.getErrors();
    expect(errors['c.x']).toEqual('Value: 12-12-2016 does not match format dd-MM-yy');
    expect(errors['c.y']).toEqual('Value: test does not match format email');
    expect(errors['c.f.g']).toEqual('Value: 1-1-10 does not match format dd-MM-yyyy');
  });

  it('should check recursively without errors if some data has no rules', function () {
    let errors;
    expect(validator.isValid({b: "3530"})).toBeTruthy();
    expect(validator.isValid({
      b: "3530",
      c: {
        f: {
          g: "122"
        }
      }
    })).toBeFalsy();
    errors = validator.getErrors();
    expect(errors['c.f.g']).toEqual('Value: 122 does not match format dd-MM-yyyy');
  })
});
