class Field {
    constructor(f_name) {
        this._field = {
            name: f_name,
            value: '',
        };
        this._error = {
            message: '',
        };
    }
    get field() {
        return this._field;
    }
    set field(val) {
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
            const name = this._field.name === 'firstName' ? 'first name' : 'last name';
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
            if (!/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/g.test(this._field.value)) {
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
    get error() {
        return this._error;
    }
}
export class Customer {
    constructor() {
        this.f_name = new Field('firstName');
        this.l_name = new Field('lastName');
        this.email = new Field('email');
        this.address_1 = new Field('addressLine1');
        this.address_2 = new Field('addressLine2');
        this.city = new Field('city');
        this.state = new Field('state');
        this.phone = new Field('phoneNumber');
        this.zipcode = new Field('zipcode');
    }
    get field_summary() {
        const summary = new Object();
        Object.keys(this).forEach((p) => {
            const val = this[p].field.value;
            Object.defineProperty(summary, p, {
                value: val,
                writable: false,
                enumerable: true,
            });
        });
        return summary;
    }
    setField(field, newValue) {
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
            Object.defineProperty(errors_obj, p, {
                value: this[p].error.message,
                enumerable: true
            });
        });
        return errors_obj;
    }
}
