import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

import type { FormFieldProps } from './common';
import { withError } from './utils';

export interface FormInputProps extends FormFieldProps {
  label: string;
  type?: React.InputHTMLAttributes<unknown>['type'];
  inputMode?: React.InputHTMLAttributes<unknown>['inputMode'];
  step?: any;
  min?: number;
  max?: number;
  required?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  readOnly?: boolean;
  autoComplete?: React.InputHTMLAttributes<unknown>['autoComplete'];
}

const FormInput: React.FC<FormInputProps> = ({
  prefix,
  suffix,
  name,
  label,
  min,
  max,
  step,
  autoComplete = 'on',
  type = 'text',
  inputMode = 'none',
  required = false,
  fullWidth = true,
  multiline = false,
  rows,
  defaultValue = null,
  readOnly = false,
  rules,
  disabled,
  onChange
}) => {
  const { register, errors } = useFormContext();

  return (
    <TextField
      defaultValue={defaultValue}
      name={name}
      inputRef={register(rules)}
      type={type}
      label={label}
      disabled={disabled}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      autoComplete={autoComplete}
      InputLabelProps={{ required }}
      InputProps={{
        readOnly: readOnly,
        startAdornment: prefix,
        endAdornment: suffix,
        inputProps: {
          min,
          max,
          step,
          inputMode
        }
      }}
      onChange={onChange}
      {...withError(name, errors)}
    />
  );
};

interface FormInputNumericProps
  extends Omit<FormInputProps, 'type' | 'inputMode' | 'rules'> {
  rules: Omit<RegisterOptions, 'valueAsDate' | 'valueAsNumber' | 'setValueAs'>;
}

export const FormInputNumber: React.FC<FormInputNumericProps> = ({
  rules,
  ...other
}) => {
  return (
    <FormInput
      type='number'
      inputMode='numeric'
      rules={{
        valueAsNumber: true,
        ...rules
      }}
      {...other}
    />
  );
};

interface FormInputNumProps extends Omit<FormInputNumericProps, 'step'> {}

export const FormInputInt: React.FC<FormInputNumProps> = (props) => {
  return <FormInputNumber step='1' {...props} />;
};

export const FormInputDouble: React.FC<FormInputNumProps> = (props) => {
  return <FormInputNumber step='any' {...props} />;
};

export default FormInput;
