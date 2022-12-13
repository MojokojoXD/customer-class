type F_name =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'state'
  | 'zipcode'
  | 'phoneNumber';

type CustomerFields =
  | 'f_name'
  | 'l_name'
  | 'email'
  | 'address_1'
  | 'address_2'
  | 'city'
  | 'state'
  | 'phone'
  | 'zipcode';

class Field {
  private _field: { name: F_name; value: string };
  private _error: { message: string };

  constructor(f_name: F_name) {
    this._field = {
      name: f_name,
      value: '',
    };
    this._error = {
      message: '',
    };
  }

  get field(): typeof this._field {
    return this._field;
  }

  set field(val: any) {
    this._field.value = val;
  }

  verify() {
    //addressLine2 does not need validation for now
    if (this._field.name === 'addressLine2') {
      this._error = {
        message: '',
      };

      return;
    }

    //valiation conditions for empty fields
    if (!this._field.value) {
      this._error = {
        message: 'required',
      };
      return;
    }

    //validation checks for first and last name fields
    if (this._field.name === 'firstName' || this._field.name === 'lastName') {
      const name =
        this._field.name === 'firstName' ? 'first name' : 'last name';

      if (/([\d])/g.test(this._field.value)) {
        this._error = {
          message: `${name} is not valid`,
        };
      }
      return;
    }

    //validation checks for email fields
    if (this._field.name === 'email') {
      if (!this._field.value.includes('@')) {
        this._error = {
          message: 'invalid email',
        };
      }

      return;
    }

    //validation checks for zipcode field
    if (this._field.name === 'zipcode') {
      if (!/^[0-9]{5}(?:-[0-9]{4})?$/g.test(this._field.value)) {
        this._error = {
          message: 'zipcode is invalid',
        };
      }

      return;
    }

    //validation checks for phone number field
    if (this._field.name === 'phoneNumber') {
      if (
        !/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/g.test(
          this._field.value
        )
      ) {
        this._error = {
          message: 'incorrect phone number format',
        };
      }

      return;
    }

    this._error = {
      message: '',
    };

    return true;
  }

  get error(): typeof this._error {
    return this._error;
  }
}

export class Customer {
  //indexing class properties and method so as to use this operator
  [s:string] : Field | any
  private f_name = new Field('firstName');
  private l_name = new Field('lastName');
  private email = new Field('email');
  private address_1 = new Field('addressLine1');
  private address_2 = new Field('addressLine2');
  private city = new Field('city');
  private state = new Field('state');
  private phone = new Field('phoneNumber');
  private zipcode = new Field('zipcode');

  get field_summary() {
    const summary = new Object();

    Object.keys(this).forEach((p) => {
      const val = (<Field>this[p]).field.value;
      Object.defineProperty(summary, p, {
        value: val,
        writable: false,
        enumerable: true,
      });
    });

    return summary
  }

  setField(field: CustomerFields, newValue: string) {
    this[field].field = newValue;
  }

  isValid() {
    const errors = Object.keys(this).filter((f) => {
      this[f].verify();
      return this[f].error.message !== '';
    });
    return errors.length === 0;
  }

  get errors() {
    const errors_obj = new Object();

    Object.keys(this).forEach(p => {
        this[p].verify();
        Object.defineProperty(errors_obj, p ,{
            value: this[p].error.message,
            enumerable: true
        })
    })

    return errors_obj;
    }
}


