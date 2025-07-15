import { useState } from "react";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsAPI } from "../../services/api";
import type { Event } from "../../types";
import ReactPaginate from "react-paginate";

const EventsList = ({
  events,
  handleEdit,
  pagination,
  handlePageChange,
}: {
  events: Event[];
  handleEdit: (event: Event) => void;
  handlePageChange: (selectedItem: { selected: number }) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}) => {
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState({
    open: false,
    eventId: "",
  });

  const deleteEventMutation = useMutation({
    mutationFn: eventsAPI.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowDeleteModal({ open: false, eventId: "" });
    },
    onError: (error: any) => {
      console.error("Error deleting event:", error);
      alert(`Error deleting event: ${error.message}`);
    },
  });
  const handleDeleteEvent = () => {
    deleteEventMutation.mutate(showDeleteModal.eventId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event: Event) => (
              <tr key={event._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">{event.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {event.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {event.registeredCount || 0} / {event.capacity}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          ((event.registeredCount || 0) / event.capacity) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(event)}
                    disabled={deleteEventMutation.isPending}
                    className="text-blue-600 hover:text-blue-900 mr-4 disabled:text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setShowDeleteModal({ open: true, eventId: event._id })
                    }
                    disabled={deleteEventMutation.isPending}
                    className="text-red-600 hover:text-red-900 disabled:text-red-400"
                  >
                    {deleteEventMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No events found. Create your first event!
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              onPageChange={handlePageChange}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pagination.totalPages}
              previousLabel="< Previous"
              renderOnZeroPageCount={null}
              forcePage={pagination.currentPage - 1}
              containerClassName="pagination"
            />
          </div>
        )}
      </div>
      {showDeleteModal.open && (
        <ConfirmationModal
          isOpen={showDeleteModal.open}
          onClose={() => setShowDeleteModal({ open: false, eventId: "" })}
          onConfirm={handleDeleteEvent}
          title="Delete Event"
          message="Are you sure you want to delete this event? This action cannot be undone and will remove all registrations."
          confirmText="Yes, Delete Event"
          cancelText="Keep Event"
          type="danger"
        />
      )}
    </div>
  );
};

export default EventsList;
