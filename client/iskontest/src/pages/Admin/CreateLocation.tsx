/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { countryconst } from "../../utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsAPI } from "../../services/api";

// Validation schema matching server requirements
const locationValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .trim()
    .max(100, "Name must be 100 characters or less"),
  address: Yup.string().required("Address is required").trim(),
  city: Yup.string()
    .required("City is required")
    .trim()
    .max(50, "City must be 50 characters or less"),
  state: Yup.string()
    .required("State is required")
    .trim()
    .max(50, "State must be 50 characters or less"),
  country: Yup.string()
    .required("Country is required")
    .trim()
    .max(50, "Country must be 50 characters or less"),
});
const CreateLocation = ({ onCancel }: { onCancel: () => void }) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: eventsAPI.createLocations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      onCancel();
    },
    onError: (error: any) => {
      console.error("Error updating event:", error);
      alert(`Error updating event: ${error.message}`);
    },
  });
  const initialValues = {
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
  };
  const handleFormSubmit = (values: any, { setSubmitting, resetForm }: any) => {
    console.log("Form values:", values);
    setSubmitting(false);
    mutate(values);
    resetForm();
  };

  const handleCancelForm = () => {
    // Handle cancel logic here
    console.log("Form cancelled");
    onCancel();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <Formik
        initialValues={initialValues}
        validationSchema={locationValidationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Field
                  type="text"
                  name="name"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name && touched.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <Field
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.city && touched.city
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="city"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <Field
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.state && touched.state
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="state"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <Field
                  as="select"
                  name="country"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.country && touched.country
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Country</option>
                  {countryconst.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="country"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <Field
                  as="textarea"
                  name="address"
                  rows={3}
                  placeholder="Enter full address"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address && touched.address
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="address"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium flex items-center"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                Create Location
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                disabled={isSubmitting}
                className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateLocation;
