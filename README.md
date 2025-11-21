# bayer-04
Bayer-hospital team-04
 Tech Stack
**Frontend (UI)**

React.js
Redux
React Bootstrap


**Authentication:**
JWT

**Backend**
Express.js
Helmet (security headers)
Mongoose (MongoDB ODM)

1.creating login page

2. once admin login -> add staff ->view staff
->View Staff (Get API)
->Add Staff(Post API)

3. Admin to create shift by date with available staffs
   
UI
1.Display number of assigned and unassigned staff by date.
2.Display the staff in table with assigned shift.
3.Assigned and unassigned staff postions(Tracking System)
4.Table view see staff assignment based on shift.
5.Adding Colour combination for shifts and identify un asssigned staff.
6.Admin can enter attendance of staffs.
7.Alert message for conflicts of attendance.
8.Assign shift to particular staff.
9.Adding Docturs Nurses Technician to the particular slot.


![WhatsApp Image 2025-11-21 at 11 56 14 AM](https://github.com/user-attachments/assets/4042bac2-ff81-447f-9390-e6faadd50b62)

{
  "_id": "staff123",
  "name": "John Doe",
  "role": "Nurse",

  "shifts": [
    {
      "date": "2025-11-21",
      "shift": "morning"
    },
    {
      "date": "2025-11-22",
      "shift": "night"
    }
  ]
}
















