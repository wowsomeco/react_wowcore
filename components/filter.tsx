import { IconButton } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Tooltip from '@material-ui/core/Tooltip';
import * as React from 'react';
import {
  FormProvider,
  useForm,
  useFormContext,
  UseFormMethods
} from 'react-hook-form';
import { FiFilter, FiX } from 'react-icons/fi';

import { Btn } from '~w-common/components/btn';
import { removeEmpty } from '~w-common/scripts';

export type FilterField = (methods: UseFormMethods) => React.ReactNode;

export type FilterSubmit = (
  filterQuery: string,
  onClose: () => void
) => Promise<void>;

interface FilterProps {
  className?: string;
  onSubmit: FilterSubmit;
  fields: FilterField[];
}

const FilterDrawer = ({ onSubmit, onClose, fields }) => {
  const methods = useFormContext();
  const { reset, handleSubmit, getValues } = methods;

  React.useEffect(() => {
    // drawer cause unmount and value loss, so need to reset every mount
    reset(getValues());
  }, []);

  return (
    <div style={{ width: 320 }}>
      <div className='flex justify-end p-2'>
        <IconButton color='primary' onClick={onClose}>
          <FiX size='24' />
        </IconButton>
      </div>

      <form
        onSubmit={handleSubmit((formVal) => {
          const cleanValue = removeEmpty(formVal, [(v) => !v]);
          const filterQuery = Object.keys(cleanValue)
            .map((queryName) => `${queryName}=${formVal[queryName]}`)
            .join('&');

          onSubmit(filterQuery, onClose);
        })}
        className='p-8 pt-3 h-screen overflow-auto'
      >
        <p className='font-bold text-lg uppercase mb-2'>Filter</p>
        {fields.map((field, i) => {
          // Note: don't use uuid for key, it will trigger rerender
          // & erase form data on submit & on close drawer
          return (
            <React.Fragment key={`filter-field-${i}`}>
              {field(methods)}
              <div className='mb-2 w-full'></div>
            </React.Fragment>
          );
        })}
        <div className='flex justify-end sticky bottom-0 right-0 py-5'>
          <Btn type='submit' variant='contained' color='primary'>
            Submit
          </Btn>
        </div>
      </form>
    </div>
  );
};

const Filter: React.FC<FilterProps> = ({ className, onSubmit, fields }) => {
  const [open, setOpen] = React.useState(false);

  const methods = useForm({
    shouldUnregister: false
  });

  const onClose = () => setOpen(false);

  return (
    <FormProvider {...methods}>
      <Tooltip title='Filter' arrow>
        <IconButton
          color='primary'
          className={className}
          onClick={() => setOpen(true)}
        >
          <FiFilter size='24' color='inherit' />
        </IconButton>
      </Tooltip>

      <Drawer anchor='right' open={open} onClose={onClose}>
        <FilterDrawer onSubmit={onSubmit} fields={fields} onClose={onClose} />
      </Drawer>
    </FormProvider>
  );
};

export default Filter;
