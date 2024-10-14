$(document).ready(function () {
    // Initialize today's date
    var currentDate = new Date();
    var today = new Date().toISOString().slice(0, 10);  // 'YYYY-MM-DD'

    // Function to update the month and year in the header
    function updateCalendarHeader(date) {
        var options = {year: 'numeric', month: 'long'};
        var monthYear = date.toLocaleDateString('en-US', options);  // e.g., "October 2024"
        $('#month-year').text(monthYear);
    }

    // Initially load the calendar and update the header
    updateCalendarHeader(currentDate);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

    // Function to generate the calendar
    function generateCalendar(year, month) {
        var firstDay = new Date(year, month, 1).getDay();  // Day of the week of the 1st
        var daysInMonth = new Date(year, month + 1, 0).getDate();  // Number of days in the month
        var calendarHTML = '<table class="table table-bordered">';
        calendarHTML += '<thead><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead>';
        calendarHTML += '<tbody><tr>';

        // Empty cells before the first day
        for (var i = 0; i < firstDay; i++) {
            calendarHTML += '<td></td>';
        }

        // Add days of the month
        for (var day = 1; day <= daysInMonth; day++) {
            if ((i % 7) === 0 && day !== 1) {
                calendarHTML += '</tr><tr>';  // Start new row every Sunday
            }

            var dayString = year + '-' + (month + 1).toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
            var dateObj = new Date(year, month, day);
            var todayDateObj = new Date();

            // Disable future dates
            if (dateObj > todayDateObj) {
                calendarHTML += '<td class="future-date opacity-50">' + day + '</td>';  // Unclickable future date
            } else {
                // Check if this is today's date
                if (dayString === today) {
                    calendarHTML += '<td class="date selected-date" data-date="' + dayString + '">' + day + '</td>';  // Highlight today's date
                } else {
                    calendarHTML += '<td class="date "  data-date="' + dayString + '">' + day + '</td>';
                }
            }
            i++;
        }

        // Empty cells after the last day
        while (i % 7 !== 0) {
            calendarHTML += '<td></td>';
            i++;
        }

        calendarHTML += '</tr></tbody></table>';
        $('#calendar').html(calendarHTML);  // Render the calendar
    }

    // Function to load entries based on the selected date
    function loadEntries(date) {
        $.ajax({
            url: '/entries/' + date + '/',
            method: 'GET',
            success: function (data) {
                $('#blood-pressure').val(data.blood_pressure);
                $('#glucose_level').val(data.glucose_level);
            },
            error: function () {
                alert('Failed to load data.');
            }
        });
    }

    // Handle date click to load entries and highlight selected date
    $('#calendar').on('click', '.date', function () {
        var selectedDate = $(this).data('date');
        $('#selected-date').text(selectedDate);
        loadEntries(selectedDate);  // Load entries for clicked date

        // Highlight selected date
        $('.date').removeClass('selected-date');  // Remove existing highlights
        $(this).addClass('selected-date');  // Add highlight to clicked date
    });

    // Function to validate blood pressure format
    function validateBloodPressure(bp) {
        var bpRegex = /^\d{2,3}\/\d{2,3}$/; // Regex pattern to match "120/80" format
        return bpRegex.test(bp);
    }
    // Handle form save
    $('#save-entry').on('click', function () {
        var selectedDate = $('#selected-date').text();
        // Validate blood pressure input

        if (!validateBloodPressure($('#blood-pressure').val())) {
            $('#bp-error').show();  // Show error message
            return; // Prevent form submission
        } else {
            $('#bp-error').hide(); // Hide error message if validation passes
        }

        var formData = {
            blood_pressure: $('#blood-pressure').val(),
            glucose_level: $('#glucose_level').val(),
            csrfmiddlewaretoken: '{{ csrf_token }}'
        };

        $.ajax({
            url: '/save-entry/' + selectedDate + '/',
            method: 'POST',
            data: formData,
            success: function () {
                alert('Entry saved successfully.');
            },
            error: function () {
                alert('Failed to save entry.');
            }
        });
    });

    // Handle previous/next month navigation
    $('#prev-month').on('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        updateCalendarHeader(currentDate);  // Update month/year display
    });

    $('#next-month').on('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        updateCalendarHeader(currentDate);  // Update month/year display
    });

    // Initially load today's entries
    $('#selected-date').text(today);
    loadEntries(today);
});
