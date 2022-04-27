import { useEffect, useRef, useState } from 'react';

import Modal from '../../components/Modal/Modal';
import SelectField from '../../components/SelectField/SelectField';
import Table from '../../components/Tables';
import TextField from '../../components/TextField';
import { getCollection } from '../../functions/auth';
import { CREATE_NEW_ADMIN, SEARCH_ADMINS } from '../../graphql/mutation';
import { useModal } from '../../hooks/useModal';

import { useLazyQuery, useMutation } from '@apollo/client';
import { Form, Formik } from 'formik';

const AdminPage = () => {
  const modal = useModal();
  const [role, setRole] = useState({
    id: 1,
    value: '2',
    label: 'Co-Super Admin',
  });
  const [openModal, setOpenModal] = useState(false);
  const textareaRef = useRef();
  const [
    searchAdmin,
    { data, refetch: onSearchRefetch, loading: isLoading, called },
  ] = useLazyQuery(SEARCH_ADMINS, { notifyOnNetworkStatusChange: true });
  const [createNewAdmin] = useMutation(CREATE_NEW_ADMIN, {
    onCompleted: (datas) => {
      modal.actions.onSetSnackbar(datas?.registerAdmin);
      setOpenModal(false);
    },
    onError: (err) => {
      // alert(err?.exception?.stacktrace[0]);
      console.log(err?.exception?.stacktrace[0]);
    },
    update: () => {
      onSearchRefetch();
    },
  });

  useEffect(() => {
    if (called) {
      onSearchRefetch();
      return;
    }
    searchAdmin({ page: 0, perPage: 10 });
  }, [called, onSearchRefetch, searchAdmin]);

  return (
    <div>
      <Table
        addNewFunc={() => setOpenModal(true)}
        data={data?.getAdmin?.hits}
        isLoading={isLoading}
        noExport
        noFilter
        noSearch
        noSort
        onRefetch={onSearchRefetch}
        pages={data?.getAdmin?.nbPages - 1}
        type='Admin'
      />
      <Modal
        initialFocus={textareaRef}
        isModalOpen={openModal}
        modalTitle='New Admin'
        setModalOpen={setOpenModal}
      >
        <Formik
          initialValues={{
            name: '',
            email: '',
            role: '',
            code: '',
          }}
          onSubmit={async (docs, { setSubmitting, setErrors }) => {
            setSubmitting(true);

            const accessCodeSnapshot = await getCollection(
              'adminAccessCode',
              'code',
              docs.code
            );

            if (accessCodeSnapshot.empty) {
              setErrors({ code: 'Invalid Access Code' });
              setSubmitting(false);
            } else {
              createNewAdmin({
                variables: {
                  name: docs.name,
                  email: docs.email,
                  level: Number(role?.value),
                  accessCode: docs.code,
                },
              });
              setSubmitting(false);
            }
          }}
          validate={async (values) => {
            const errors = {};

            if (!role) errors.role = 'Required';

            if (!values.code) {
              errors.code = 'Required';
            }

            if (!values.email) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            }

            return errors;
          }}
        >
          {({ handleSubmit }) => (
            <Form className='text-center' onSubmit={handleSubmit}>
              <TextField label='Name' name='name' type='text' />
              <TextField label='Email' name='email' type='email' />
              <SelectField
                callback={setRole}
                callbackValue={role}
                label='Role'
                name='role'
              />
              <TextField label='Acces Code' name='code' type='text' />

              <div className='grid grid-cols-4 gap-4 p-2 border-t border-dark-50'>
                <div className='col-span-2' />
                <button
                  className='p-1 px-4  0 w-full rounded-md font-medium text-gray-100'
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
                <button
                  className='p-1 px-4 bg-primary-100 w-full rounded-md font-medium text-gray-100'
                  type='submit'
                >
                  Post
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default AdminPage;
