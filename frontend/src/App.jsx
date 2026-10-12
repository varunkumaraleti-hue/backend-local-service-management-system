import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://local-service-backend-java.onrender.com/api/services";
const BOOKING_API_URL = "https://local-service-backend-java.onrender.com/api/bookings";

function App() {
  // View
  const [view, setView] = useState("user");

  // Services
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Loading and error messages
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [bookingService, setBookingService] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [statusSearchName, setStatusSearchName] = useState("");

  // Fetch all services
  const getServices = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(API_URL);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setErrorMessage(
        "Unable to load services. Please check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch all bookings
  const getBookings = async () => {
    try {
      const response = await axios.get(BOOKING_API_URL);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookingError(
        "Unable to load bookings. Please check whether the backend is running."
      );
    }
  };

  useEffect(() => {
    getServices();
    getBookings();
  }, []);

  // Clear the service form
  const clearForm = () => {
    setServiceName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setEditingId(null);
    setErrorMessage("");
  };

  // Add or update a service
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !serviceName.trim() ||
      !description.trim() ||
      price === "" ||
      !category.trim()
    ) {
      setErrorMessage("Please fill in all service fields.");
      return;
    }

    if (Number(price) < 0 || !Number.isFinite(Number(price))) {
      setErrorMessage("Please enter a valid, non-negative price.");
      return;
    }

    const serviceData = {
      serviceName: serviceName.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
    };

    try {
      setSaving(true);
      setErrorMessage("");

      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, serviceData);
        alert("Service updated successfully!");
      } else {
        await axios.post(API_URL, serviceData);
        alert("Service added successfully!");
      }

      clearForm();
      await getServices();
    } catch (error) {
      console.error("Error saving service:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to save the service. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit a service
  const handleEdit = (service) => {
    setServiceName(service.serviceName);
    setDescription(service.description);
    setPrice(String(service.price));
    setCategory(service.category);
    setEditingId(service.id);
    setErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete a service
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`);

      if (editingId === id) {
        clearForm();
      }

      alert("Service deleted successfully!");
      await getServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Unable to delete the service. Please try again.");
    }
  };

  // Open the booking form
  const handleBookClick = (service) => {
    setBookingService(service);
    setCustomerName("");
    setBookingMessage("");
    setBookingError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Submit a booking request
  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    if (!customerName.trim()) {
      setBookingError("Please enter your name.");
      return;
    }

    if (!bookingService) {
      setBookingError("Please select a service first.");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");
      setBookingMessage("");

      await axios.post(BOOKING_API_URL, {
        serviceName: bookingService.serviceName,
        customerName: customerName.trim(),
      });

      setBookingMessage(
        "Booking request submitted successfully! Your status is PENDING."
      );

      setCustomerName("");
      setBookingService(null);

      await getBookings();
    } catch (error) {
      console.error("Error creating booking:", error);
      setBookingError(
        error.response?.data?.message ||
          "Unable to submit your booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Accept or decline a booking
  const handleBookingStatus = async (id, status) => {
    const action = status === "ACCEPTED" ? "accept" : "decline";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this booking?`
    );

    if (!confirmed) return;

    try {
      setBookingError("");

      await axios.put(`${BOOKING_API_URL}/${id}/status`, {
        status: status,
      });

      await getBookings();

      setBookingMessage(`Booking ${action}ed successfully.`);
    } catch (error) {
      console.error("Error updating booking:", error);
      setBookingError(
        error.response?.data?.message ||
          "Unable to update booking status. Please try again."
      );
    }
  };

  // Unique categories
  const categories = [
    "All",
    ...new Set(
      services
        .map((service) => service.category)
        .filter(Boolean)
    ),
  ];

  // Search and category filtering
  const filteredServices = services.filter((service) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      service.serviceName?.toLowerCase().includes(search) ||
      service.description?.toLowerCase().includes(search) ||
      service.category?.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All" ||
      service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Dashboard statistics
  const totalServices = services.length;
  const totalCategories = new Set(
    services.map((service) => service.category)
  ).size;

  const averagePrice =
    totalServices > 0
      ? services.reduce(
          (total, service) => total + Number(service.price || 0),
          0
        ) / totalServices
      : 0;

  // Filter booking requests by customer name in User View
  const userBookings = bookings.filter((booking) => {
    const search = statusSearchName.trim().toLowerCase();

    return (
      search !== "" &&
      booking.customerName?.trim().toLowerCase() === search
    );
  });

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <h2>Local Services</h2>

        <div className="view-switcher">
          <button
            type="button"
            className={view === "user" ? "active-view" : ""}
            onClick={() => {
              setView("user");
              setBookingService(null);
              setBookingError("");
              setBookingMessage("");
            }}
          >
            User View
          </button>

          <button
            type="button"
            className={view === "admin" ? "active-view" : ""}
            onClick={() => {
              setView("admin");
              setBookingService(null);
              setBookingError("");
              setBookingMessage("");
              getBookings();
            }}
          >
            Admin View
          </button>
        </div>
      </nav>

      <main className="app-container">
        {/* Page Heading */}
        <div className="page-heading">
          <h1>Local Services Management System</h1>

          <p>
            {view === "user"
              ? "Explore local services and submit your booking requests."
              : "Manage services and approve or decline booking requests."}
          </p>
        </div>

        {/* Demo notice */}
        <p className="demo-notice">
          Current mode: <strong>{view === "user" ? "User" : "Admin"}</strong>.
          This is a demonstration switch, not a secure login system.
        </p>

        {/* Admin Dashboard */}
        {view === "admin" && (
          <section className="stats-container">
            <div className="stat-card">
              <h3>Total Services</h3>
              <p>{totalServices}</p>
            </div>

            <div className="stat-card">
              <h3>Categories</h3>
              <p>{totalCategories}</p>
            </div>

            <div className="stat-card">
              <h3>Average Price</h3>
              <p>₹{averagePrice.toFixed(2)}</p>
            </div>

            <div className="stat-card">
              <h3>Pending Bookings</h3>
              <p>
                {
                  bookings.filter(
                    (booking) => booking.status === "PENDING"
                  ).length
                }
              </p>
            </div>
          </section>
        )}

        {/* Admin: Add or Update Service */}
        {view === "admin" && (
          <section className="form-container">
            <h2>
              {editingId !== null ? "Update Service" : "Add New Service"}
            </h2>

            {errorMessage && (
              <p className="error-message">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="serviceName">Service Name</label>

                  <input
                    id="serviceName"
                    type="text"
                    placeholder="Enter service name"
                    value={serviceName}
                    onChange={(event) =>
                      setServiceName(event.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>

                  <input
                    id="category"
                    type="text"
                    placeholder="Enter category"
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price (₹)</label>

                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>

                  <input
                    id="description"
                    type="text"
                    placeholder="Enter service description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Update Service"
                    : "Add Service"}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={clearForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {/* Booking Form */}
        {view === "user" && bookingService && (
          <section className="form-container">
            <h2>Book a Service</h2>

            <p>
              Selected Service:{" "}
              <strong>{bookingService.serviceName}</strong>
            </p>

            <p>
              Price: ₹{Number(bookingService.price).toFixed(2)}
            </p>

            {bookingError && (
              <p className="error-message">{bookingError}</p>
            )}

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label htmlFor="customerName">Your Name</label>

                <input
                  id="customerName"
                  type="text"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                />
              </div>

              <div className="form-buttons">
                <button type="submit" disabled={bookingLoading}>
                  {bookingLoading
                    ? "Submitting..."
                    : "Submit Booking Request"}
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setBookingService(null);
                    setBookingError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {bookingMessage && (
          <p className="success-message">{bookingMessage}</p>
        )}

        {/* Booking Requests */}
        <section className="booking-section">
          <h2>
            {view === "admin"
              ? "Booking Requests"
              : "Check Booking Status"}
          </h2>

          {view === "user" && (
            <>
              <p>
                Enter the name used when submitting your booking to find
                matching requests.
              </p>

              <div className="form-group">
                <label htmlFor="statusSearchName">Customer Name</label>

                <input
                  id="statusSearchName"
                  type="text"
                  placeholder="Search bookings by your name"
                  value={statusSearchName}
                  onChange={(event) =>
                    setStatusSearchName(event.target.value)
                  }
                />
              </div>
            </>
          )}

          {bookingError && (
            <p className="error-message">{bookingError}</p>
          )}

          {bookings.length === 0 ? (
            <p className="empty-message">No booking requests yet.</p>
          ) : view === "user" && userBookings.length === 0 ? (
            <p className="empty-message">
              No bookings match that name.
            </p>
          ) : (
            <div className="booking-list">
              {(view === "admin" ? bookings : userBookings)
                .slice()
                .sort((a, b) => Number(b.id) - Number(a.id))
                .map((booking) => (
                  <div className="booking-card" key={booking.id}>
                    <div className="booking-details">
                      <h3>{booking.serviceName}</h3>

                      <p>
                        <strong>Customer:</strong>{" "}
                        {booking.customerName}
                      </p>

                      <p>
                        <strong>Booking ID:</strong> {booking.id}
                      </p>

                      <p>
                        <strong>Date:</strong>{" "}
                        {booking.bookingTime
                          ? new Date(booking.bookingTime).toLocaleString()
                          : "Not available"}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`status-badge ${
                            booking.status?.toLowerCase() || "pending"
                          }`}
                        >
                          {booking.status || "PENDING"}
                        </span>
                      </p>
                    </div>

                    {/* Admin actions */}
                    {view === "admin" &&
                      booking.status === "PENDING" && (
                        <div className="booking-actions">
                          <button
                            type="button"
                            className="accept-button"
                            onClick={() =>
                              handleBookingStatus(
                                booking.id,
                                "ACCEPTED"
                              )
                            }
                          >
                            Accept
                          </button>

                          <button
                            type="button"
                            className="decline-button"
                            onClick={() =>
                              handleBookingStatus(
                                booking.id,
                                "DECLINED"
                              )
                            }
                          >
                            Decline
                          </button>
                        </div>
                      )}
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* Services List */}
        <section className="services-section">
          <div className="services-heading">
            <div>
              <h2>
                {view === "admin"
                  ? "Manage Services"
                  : "Available Services"}
              </h2>

              <p>
                {view === "admin"
                  ? "Add, update, search, and delete services."
                  : "Choose a service to submit a booking request."}
              </p>
            </div>

            <button
              type="button"
              className="refresh-button"
              onClick={() => {
                getServices();
                getBookings();
              }}
            >
              Refresh
            </button>
          </div>

          {/* Search and Filter */}
          <div className="filter-container">
            <div className="form-group">
              <label htmlFor="searchTerm">Search Services</label>

              <input
                id="searchTerm"
                type="text"
                placeholder="Search by name, description, or category"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoryFilter">Filter by Category</label>

              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Cards */}
          {loading ? (
            <p className="empty-message">Loading services...</p>
          ) : errorMessage && services.length === 0 ? (
            <p className="error-message">{errorMessage}</p>
          ) : filteredServices.length === 0 ? (
            <p className="empty-message">No services found.</p>
          ) : (
            <div className="services-container">
              {filteredServices.map((service) => (
                <div className="service-card" key={service.id}>
                  <h3>{service.serviceName}</h3>

                  <p className="service-category">
                    {service.category}
                  </p>

                  <p className="service-description">
                    {service.description}
                  </p>

                  <p className="service-price">
                    ₹{Number(service.price).toFixed(2)}
                  </p>

                  <div className="service-actions">
                    {view === "admin" ? (
                      <>
                        <button
                          type="button"
                          className="update-button"
                          onClick={() => handleEdit(service)}
                        >
                          Update
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDelete(service.id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="book-button"
                        onClick={() => handleBookClick(service)}
                      >
                        Book Service
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          Local Services Management System | React + Spring Boot + MySQL
        </p>
      </footer>
    </>
  );
}

export default App;