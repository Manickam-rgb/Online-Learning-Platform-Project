document.getElementById('logout-btn').addEventListener('click', function() {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to the login page
    window.location.href = 'login.html';
});

// Protect the page by checking if user is logged in
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }
});


const popup = document.getElementById('popup');
const openPopupButtons = document.querySelectorAll('#book-now-header, #book-now-btn-empty');
const closePopup = document.getElementById('close-popup');
const cancelButton = document.querySelector('.cancel-btn');  // Select the Cancel button
const saveButton = document.querySelector('.save-btn');      // Select the Save button
const bookNowNoBooking = document.getElementById('book-now-btn-empty');  // The "Special Classes No-Booking" button
const openPopup = document.querySelector('#book-now-btn-empty')
// Open the popup when either of the "Book Now" buttons is clicked
openPopupButtons.forEach(button => {
    button.addEventListener('click', () => {
        popup.style.display = 'flex';
    });
});
// bookNowNoBooking.forEach(button =>{
//     button.addEventListener('click', () => {
//         popup.style.display = 'flex';
    // });
// });

// Close the popup when the "X" close button or the "Cancel" button is clicked
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

cancelButton.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Save booking to database
document.getElementById('save-popup').addEventListener('click', () => {
    const course = document.getElementById('course').value;
    const trainee = document.getElementById('trainee').value;
    const date = document.getElementById('date').value;
    const slot = document.getElementById('slot').value;
    const bookingId = document.getElementById('save-popup').getAttribute('data-booking-id');// Get booking ID if editing
    const token = localStorage.getItem('token');
    const url = bookingId
        ? `http://localhost:5000/api/bookings/${bookingId}` // Update booking if ID exists
        : 'http://localhost:5000/api/book'; // Create new booking otherwise
    
    const method = bookingId ? 'PUT' : 'POST';
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ course, trainee, date, slot })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save booking');
        }
        return response.json();
    })
    .then(() => {
        alert(bookingId ? 'Booking updated successfully!' : 'Booking saved successfully!');
            document.getElementById('popup').style.display = 'none';
            displayBookings(); // Refresh the bookings display
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Error saving booking'+err);
    });
});

// Fetch and display bookings
function displayBookings() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/bookings', {
        headers: { 'Authorization': token }
    })
    .then(response => response.json())
    .then(data => {
        const bookingDetails = document.getElementById('booking-details');
        bookingDetails.innerHTML = '';
        if (data.length >0){
            data.forEach(booking => {
                const bookingCard = document.createElement('div');
                bookingCard.classList.add('booking-card');
                let bookingDate = new Date(booking.booking_date).toISOString().split('T')[0];
                bookingCard.setAttribute('data-booking-id', booking.id);
                bookingCard.innerHTML = `
                    <h5>${booking.course}</h5>
                    <p>Trainee: ${booking.trainee}</p>
                    <div class="last_col">
                        <p><span><img src="Assets/icons/schedule-50 (1).png" alt="calendar"> ${bookingDate}</span>
                            <span><img src="Assets/icons/clock-icon.png" alt="clock"> ${booking.slot_time}</span></p>
                        <button class="edit-btn"><img src="Assets/icons/edit-50.png">Edit</button>
                    </div>
                `;
                bookingDetails.appendChild(bookingCard);
            });
        } else {
            const emptyState = document.createElement('div');
            emptyState.classList.add('empty-booking');

            emptyState.innerHTML = `
                <h4>You don't have special Booking!</h4>
                <img src="Assets/events image.png" alt="empty calendar">
                <button class="book-now-btn" id="book-now-btn-empty">
                    <img src="Assets/icons/schedule-50 (1).png" alt="calendar"> Book Now
                </button>
                <p>We noticed that the "Special Booking" feature is currently not being utilized</p>
            `;
            bookingDetails.appendChild(emptyState);
            document.getElementById('book-now-btn-empty').addEventListener('click',openBookingpopup);
        }
    
    
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const bookingContainer = document.getElementById('booking-details');
    
    // Event delegation for dynamically created edit buttons
    bookingContainer.addEventListener('click', (e) => {
        if (e.target.closest('.edit-btn')) {
            const bookingCard = e.target.closest('.booking-card');
            const bookingId = bookingCard.getAttribute('data-booking-id'); // Get booking ID
            
            console.log('Edit button clicked for booking ID:', bookingId); // Debug log
            
            // Fetch booking details by ID
            fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                headers: { 'Authorization': localStorage.getItem('token') },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch booking details');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Fetched booking details:', data); // Debug log
                    
                    // Populate the popup fields with data
                    document.getElementById('course').value = data.course;
                    document.getElementById('trainee').value = data.trainee;
                    document.getElementById('date').value = data.booking_date;
                    document.getElementById('slot').value = data.slot_time;

                    // Display the popup
                    document.getElementById('popup').style.display = 'flex';
                    document.getElementById('save-popup').setAttribute('data-booking-id',bookingId);
                })
                .catch((error) => {
                    console.error('Error fetching booking details:', error);
                    alert('Failed to fetch booking details.')
                });
        }
    });
});
document.querySelector('#book-now-header').addEventListener('click', () => {
    document.getElementById('course').value = '';
    document.getElementById('trainee').value = '';
    document.getElementById('date').value = '';
    document.getElementById('slot').value = '';
    saveButton.removeAttribute('data-booking-id'); // Clear booking ID
    document.getElementById('popup').style.display = 'flex';
});


// Function to update booking
function updateBooking(bookingId) {
    const course = document.getElementById('course').value;
    const trainee = document.getElementById('trainee').value;
    const date = document.getElementById('date').value;
    const slot = document.getElementById('slot').value;

    fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ course, trainee, date, slot }),
    })
        .then((response) => response.json())
        .then(() => {
            alert('Booking updated successfully!');
            document.getElementById('popup').style.display = 'none';
            displayBookings(); // Refresh the bookings display
        })
        .catch((error) => {
            console.error('Error updating booking:', error);
            alert('Failed to update booking');
        });
}

window.onload = displayBookings;

