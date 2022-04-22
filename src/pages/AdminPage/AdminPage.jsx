import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { getCollection } from "functions/auth";

import Table from "components/Tables";
import { CREATE_NEW_ADMIN, SEARCH_ADMINS } from "graphql/mutation";
import Modal from "components/Modal/Modal";
import { Form, Formik } from "formik";
import TextField from "components/TextField";
import SelectField from "components/SelectField/SelectField";
import { useModal } from "hooks/useModal";

const AdminPage = () => {
  const modal = useModal()
  const [role, setRole] = useState({ id: 1, value: '2', label: "Co-Super Admin" })
  const [openModal, setOpenModal] = useState(false)
  const textareaRef = useRef()
  const [
    searchAdmin,
    { data, refetch: onSearchRefetch, loading: isLoading, called }
  ] = useLazyQuery(SEARCH_ADMINS, { notifyOnNetworkStatusChange: true })
  const [createNewAdmin] = useMutation(CREATE_NEW_ADMIN, {
    onCompleted: (data) => {
      modal.actions.onSetSnackbar(data?.registerAdmin)
      setOpenModal(false)
    },
    onError: (err) => {
      alert(err?.exception?.stacktrace[0])
    },
    update: (cache, { data }) => {
      onSearchRefetch()
    }
  })

  useEffect(() => {
    if (called) {
      onSearchRefetch()
      return;
    }
    searchAdmin({ page: 0, perPage: 10 });
  }, [])

  return (
    <div>
      <Table
        type="Admin"
        onRefetch={onSearchRefetch}
        data={data?.getAdmin?.hits}
        isLoading={isLoading}
        pages={data?.getAdmin?.nbPages - 1}
        noSort
        noSearch
        noFilter
        noExport
        addNewFunc={() => setOpenModal(true)}
      />
      <Modal isModalOpen={openModal} setModalOpen={setOpenModal} modalTitle="New Admin" initialFocus={textareaRef}>

        <Formik
          initialValues={{
            name: "",
            email: "",
            role: "",
            code: "",
          }}
          validate={async values => {
            const errors = {};

            if (!role) errors.role = 'Required'

            if (!values.code) { errors.code = 'Required' }

            if (!values.email) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            }

            return errors
          }}
          onSubmit={async (data, { setSubmitting, setErrors }) => {
            setSubmitting(true);

            const accessCodeSnapshot = await getCollection(
              "adminAccessCode",
              "code",
              data.code
            );

            if (accessCodeSnapshot.empty) {
              setErrors({ code: 'Invalid Access Code' })
              setSubmitting(false);
            } else {
              createNewAdmin({ variables: { name: data.name, email: data.email, level: Number(role?.value), accessCode: data.code } })
              setSubmitting(false);
            }
          }}
        >
          {({ handleSubmit }) => (
            <Form className="text-center" onSubmit={handleSubmit}>
              <TextField label="Name" name="name" type="text" />
              <TextField label="Email" name="email" type="email" />
              <SelectField label="Role" name="role" callback={setRole} callbackValue={role} />
              <TextField label="Acces Code" name="code" type="text" />

              <div className="grid grid-cols-4 gap-4 p-2 border-t border-dark-50">
                <div className="col-span-2" />
                <button
                  className="p-1 px-4  0 w-full rounded-md font-medium text-gray-100"
                  onClick={() => setOpenModal(false)}>Cancel</button>
                <button
                  type="submit"
                  className="p-1 px-4 bg-primary-100 w-full rounded-md font-medium text-gray-100"
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
}

export default AdminPage;