import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { eventsAPI } from "../services/api";
import ConfirmationModal from "../components/ConfirmationModal";
import type { Event } from "../types";
import Datesvg from "../assets/datesvg";
import Locationsvg from "../assets/locationsvg";
import Organizersvg from "../assets/organizersvg";
import Capacitysvg from "../assets/capacitysvg";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showUnregisterModal, setShowUnregisterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => eventsAPI.getEventById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleRegister = async () => {
    if (!user || !event) return;

    setRegistering(true);
    try {
      await eventsAPI.registerForEvent(event._id);
      setIsRegistered(true);
      await queryClient.invalidateQueries({
        queryKey: ["event", id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setRegistering(false);
    }
  };

  const checkRegistrationStatus = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registered = (await eventsAPI.checIsRegistered(id!)) as any;
    if (registered?.isRegistered as boolean) {
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
    }
  };
  useEffect(() => {
    if (event) {
      checkRegistrationStatus();
    }
  }, [event]);
  const handleUnregisterConfirm = async () => {
    if (!user || !event) return;

    setRegistering(true);
    try {
      await eventsAPI.cancelregisterForEvent(event._id);
      setIsRegistered(false);

      // Refresh the event data
      await queryClient.invalidateQueries({
        queryKey: ["event", id],
      });
    } catch (error) {
      console.error("Unregistration failed:", error);
    } finally {
      setRegistering(false);
      setShowUnregisterModal(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!user || !event || user.role !== "admin") return;

    setDeleting(true);
    try {
      await eventsAPI.deleteEvent(event._id);
      await queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      navigate("/");
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleEditEvent = () => {
    // Navigate to edit page (you'll need to create this route)
    navigate(`/admin/events/${event?._id}/edit`);
  };

  const formatLocationString = (event: Event) => {
    const { location } = event;
    return `${location.name}, ${location.address}, ${location.city}, ${location.state}, ${location.country}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            {isError ? "Error Loading Event" : "Event Not Found"}
          </h2>
          <p className="text-gray-600 mb-4">
            {isError && error instanceof Error
              ? error.message
              : "The event you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if event has passed
  const isPastEvent = new Date(event.date) < new Date();

  const capacity = event.capacity || 100;
  const registeredCount = event.registeredCount || 0;
  const isEventFull = registeredCount >= capacity;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {event.title}
                </h1>
                {/* Admin buttons */}
                {user?.role === "admin" && (
                  <div className="flex space-x-2 me-10">
                    <button
                      onClick={handleEditEvent}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-md font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      disabled={deleting}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md font-medium transition-colors disabled:opacity-50"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {event.category}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {registeredCount} / {capacity} registered
              </p>
              <div className="mt-2 w-32">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(registeredCount / capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Datesvg />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                      {event.time && ` at ${event.time}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Locationsvg />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">
                      {formatLocationString(event)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Organizersvg />
                  <div>
                    <p className="font-medium">Organizer</p>
                    <p className="text-gray-600">{event.createdBy.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Capacitysvg />
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-gray-600">{capacity} people</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Registration</h2>
              {!user ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-yellow-700">
                    Please log in to register for this event.
                  </p>
                </div>
              ) : isPastEvent ? (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <p className="text-gray-700">
                    This event has already passed.
                  </p>
                </div>
              ) : isEventFull && !isRegistered ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-700">Sorry, this event is full.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {isRegistered ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <p className="text-green-700 font-medium">
                        You are registered for this event!
                      </p>
                      <button
                        onClick={() => setShowUnregisterModal(true)}
                        disabled={registering}
                        className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                      >
                        {registering ? "Canceling..." : "Cancel Registration"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registering}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {registering ? "Registering..." : "Register for Event"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">About This Event</h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Additional event metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(event.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(event.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showUnregisterModal}
        onClose={() => setShowUnregisterModal(false)}
        onConfirm={handleUnregisterConfirm}
        title="Cancel Registration"
        message="Are you sure you want to cancel your registration for this event?"
        confirmText="Yes, Cancel Registration"
        cancelText="Keep Registration"
        type="warning"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone and will remove all registrations."
        confirmText="Yes, Delete Event"
        cancelText="Keep Event"
        type="danger"
      />
    </div>
  );
};

export default EventDetails;
