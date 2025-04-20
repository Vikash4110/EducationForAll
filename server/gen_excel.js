const XLSX = require("xlsx");

// JSON data from the artifact
const studentData = [
  {
    "Name": "John Doe",
    "Roll No": "A001",
    "Class": "10",
    "Section": "A",
    "Phone Number": "1234567890",
    "Email": "john.doe@example.com"
  },
  {
    "Name": "Jane Smith",
    "Roll No": "A002",
    "Class": "10",
    "Section": "A",
    "Phone Number": "2345678901",
    "Email": "jane.smith@example.com"
  },
  {
    "Name": "Michael Brown",
    "Roll No": "A003",
    "Class": "11",
    "Section": "B",
    "Phone Number": "3456789012",
    "Email": "michael.brown@example.com"
  },
  {
    "Name": "Emily Davis",
    "Roll No": "A004",
    "Class": "11",
    "Section": "B",
    "Phone Number": "4567890123",
    "Email": "emily.davis@example.com"
  },
  {
    "Name": "William Johnson",
    "Roll No": "A005",
    "Class": "12",
    "Section": "C",
    "Phone Number": "5678901234",
    "Email": "william.johnson@example.com"
  }
];

// Create a new workbook and worksheet
const ws = XLSX.utils.json_to_sheet(studentData);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

// Write the file
XLSX.writeFile(wb, "student_records.xlsx");