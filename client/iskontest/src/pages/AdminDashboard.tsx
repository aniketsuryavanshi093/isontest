/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { Event, Registrations } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  eventsAPI,
  type CreateEventData,
  type EventFilters,
} from "../services/api";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import EventsList from "./Admin/EventsList";
import RegistrationList from "./Admin/RegistrationList";
import { categoryconst } from "../utils/constants";
import CreateLocation from "./Admin/CreateLocation";
const eventValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  date: Yup.date()
    .required("Date is required")
    .min(new Date(), "Date must be in the future"),
  location: Yup.string().required("Location is required"),
  category: Yup.string().required("Category is required"),
  capacity: Yup.number()
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1")
    .integer("Capacity must be a whole number"),
});

const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateLocation, setShowCreateLocation] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<"events" | "registrations">(
    "events"
  );
  const [currentEventPage, setCurrentEventPage] = useState(1);
  const pageSize = 5;
  const EventapiFilters: EventFilters = {};
  EventapiFilters.page = currentEventPage;
  EventapiFilters.limit = pageSize;
  const handleEventPageChange = (selectedItem: { selected: number }) => {
    setCurrentEventPage(selectedItem.selected + 1);
  };
  const {
    data: eventsResponse,
    isLoading: eventsLoading,
    error: eventsError,
  } = useQuery({
    queryKey: ["events", currentEventPage],
    enabled: activeTab === "events",
    queryFn: () => eventsAPI.getEvents(EventapiFilters),
  });

  const events = eventsResponse?.events || [];
  const eventpagination = eventsResponse?.pagination;
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    enabled: !!showCreateForm,
    queryFn: eventsAPI.getLocations,
    staleTime: 5 * 60 * 1000,
  });
  const { data: registrations = [] as Registrations[] } = useQuery({
    enabled: activeTab === "registrations",
    queryKey: ["registerations"],
    queryFn: eventsAPI.getAllRegisterations,
  });
  // Initial form values
  const initialFormValues = {
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    capacity: "",
  };

  const createEventMutation = useMutation({
    mutationFn: eventsAPI.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowCreateForm(false);
      setEditingEvent(null);
    },
    onError: (error: any) => {
      console.error("Error creating event:", error);
      alert(`Error creating event: ${error.message}`);
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: eventsAPI.updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowCreateForm(false);
      setEditingEvent(null);
    },
    onError: (error: any) => {
      console.error("Error updating event:", error);
      alert(`Error updating event: ${error.message}`);
    },
  });

  const handleFormSubmit = (values: any, { setSubmitting, resetForm }: any) => {
    const eventData: CreateEventData = {
      title: values.title,
      description: values.description,
      date: values.date,
      category: values.category,
      capacity: parseInt(values.capacity),
      locationId: values.location,
      createdBy: user?._id,
    };

    if (editingEvent) {
      updateEventMutation.mutate(
        { eventId: editingEvent._id, eventData },
        {
          onSettled: () => {
            setSubmitting(false);
            resetForm();
          },
        }
      );
    } else {
      // Create new event
      createEventMutation.mutate(eventData, {
        onSettled: () => {
          setSubmitting(false);
          resetForm();
        },
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowCreateForm(true);
  };

  const handleCancelForm = (resetForm: any) => {
    setShowCreateForm(false);
    setEditingEvent(null);
    resetForm();
  };

  if (eventsLoading) {
    return (
      <div className="px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading events: {(eventsError as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage events and view registrations</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("events")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Events ({events?.length!})
            </button>
            <button
              onClick={() => setActiveTab("registrations")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "registrations"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Registrations ({registrations.length})
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "events" && (
        <div>
          {/* Create Event Button */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowCreateForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Create New Event
            </button>
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowCreateLocation(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Create location
            </button>
          </div>
          {showCreateLocation && (
            <CreateLocation onCancel={() => setShowCreateLocation(false)} />
          )}
          {/* Create/Edit Event Form */}
          {showCreateForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>

              <Formik
                initialValues={
                  editingEvent
                    ? {
                        title: editingEvent.title,
                        description: editingEvent.description,
                        date: editingEvent.date,
                        location: editingEvent.location._id,
                        category: editingEvent.category,
                        capacity: editingEvent?.capacity?.toString(),
                      }
                    : initialFormValues
                }
                validationSchema={eventValidationSchema}
                onSubmit={handleFormSubmit}
                enableReinitialize
              >
                {({ isSubmitting, values, errors, touched, resetForm }) => (
                  <Form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <Field
                          type="text"
                          name="title"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.title && touched.title
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="title"
                          component="p"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <Field
                          as="select"
                          name="category"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.category && touched.category
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Category</option>
                          {categoryconst.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="p"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <Field
                          type="date"
                          name="date"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.date && touched.date
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="date"
                          component="p"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <Field
                          as="select"
                          name="location"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.location && touched.location
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select location</option>
                          {locations.map((elem) => (
                            <option key={elem._id} value={elem._id}>
                              {`${elem.name} ${elem.country} ${elem.state} ${elem.city}`}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="location"
                          component="p"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Capacity
                        </label>
                        <Field
                          type="number"
                          name="capacity"
                          min="1"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.capacity && touched.capacity
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="capacity"
                          component="p"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.description && touched.description
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          createEventMutation.isPending ||
                          updateEventMutation.isPending
                        }
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium flex items-center"
                      >
                        {(isSubmitting ||
                          createEventMutation.isPending ||
                          updateEventMutation.isPending) && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        )}
                        {editingEvent ? "Update Event" : "Create Event"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelForm(resetForm)}
                        disabled={
                          isSubmitting ||
                          createEventMutation.isPending ||
                          updateEventMutation.isPending
                        }
                        className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {/* Events List */}
          {activeTab === "events" && (
            <EventsList
              pagination={eventpagination}
              handleEdit={handleEdit}
              handlePageChange={handleEventPageChange}
              events={events as Event[]}
            />
          )}
        </div>
      )}
      {activeTab === "registrations" && (
        <RegistrationList registrations={registrations as Registrations[]} />
      )}
    </div>
  );
};

export default AdminDashboard;
