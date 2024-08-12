const express = require('express');
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { afterEach } = require('node:test');

// Define the schema for the customers collection
const employeeSchema = new mongoose.Schema({
    "First Name": { type: String, required: true },
    "Last Name": { type: String, required: true },
    Location: { type: String, required: true },
    Vendor: { type: String, required: true },
    Company: { type: String, required: true },
    Invoice: { type: String, required: true },
    Date: { type: String, required: true },
    "GL Code": { type: String, required: true },
    "Cost Centre": { type: String, required: true },
    Amount: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d+(\.\d+)?$/.test(v);
        },
        message: props => `${props.value} is not a valid number!`
      }
    },
    Hours: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d+(\.\d+)?$/.test(v);
        },
        message: props => `${props.value} is not a valid number!`
      }
    },
    "Approved By": { type: String, required: true }
});

const Employees = mongoose.model('Employees', employeeSchema);

// Create the express app
const app = express();
const port = 8000;

// Use the required middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

mongoose.connect("mongodb+srv://user:0987654321@cluster0.gr5lpje.mongodb.net/HSE");

console.log("Welcome to the HSE");

// Define the routes  
app.get("/", async (req, res) => {
    await res.sendFile(__dirname + "/index.html");
});

app.get("/table", async (req, res) => {
  await res.sendFile(__dirname + "/contentsTable.html");
});

app.get("/main", async (req, res) => {
  await res.sendFile(__dirname + "/main.html");
});

app.get("/employee", async(req,res) => {
  try {
    var result = await Employees.find({});
    var content = `<table id="emptab">
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Location</th>
                        <th>Vendor</th>
                        <th>Company</th>
                        <th>Invoice</th>
                        <th>Date</th>
                        <th>GL Code</th>
                        <th>Cost Centre</th>
                        <th>Amount</th>
                        <th>Hours</th>
                        <th>Approved By</th>
                      </tr>`;
    var num = 0;        
    for (var entry of result) {
        var id = "row" + num;
        content += `<tr id="${id}" onClick="highlightRow('${id}')">
                        <td id="fname${num}">${entry["First Name"]}</td>
                        <td id="lname${num}">${entry["Last Name"]}</td>
                        <td id="location${num}">${entry.Location}</td>
                        <td id="vendor${num}">${entry.Vendor}</td>
                        <td id="company${num}">${entry.Company}</td>
                        <td id="invoice${num}">${entry.Invoice}</td>
                        <td id="date${num}">${entry.Date}</td>
                        <td id="gl${num}">${entry["GL Code"]}</td>
                        <td id="cost${num}">${entry["Cost Centre"]}</td>
                        <td id="amount${num}">${entry.Amount}</td>
                        <td id="hours${num}">${entry.Hours}</td>
                        <td id="approver${num}"">${entry["Approved By"]}</td>
                    </tr>`;
          num++;
    }

    content += `</table>
                <button id="highlight" onClick="highlightUser()">Highlight</button>
                <button id="highlight" onClick="deleteRowFromTable()">Delete Timesheet</button>`;
    res.send(content);
} catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
}
});

app.post("/employee", async(req, res) =>{

    const userData = req.body;
    console.log(userData);
    var newEmployee = new Employees({
        "First Name": userData.fname,
        "Last Name": userData.lname,
        Location: userData.location,
        Vendor: userData.vendor,
        Company: userData.company,
        Invoice: userData.invoice,
        Date: userData.date,
        "GL Code": userData.gl,
        "Cost Centre": userData.costcentre,
        Amount: userData.amount,
        Hours: userData.hours,
        "Approved By": userData.approver
      });

      try {
        // Save customer to the database
        await newEmployee.save();
        const resultMsg = "Timesheet for employee: " + userData.fname + " " + userData.lname + " added successfully";
        res.send(resultMsg);
      } catch (error) {
        console.error(error);
        res.send("invalid data entered, please check the data and try again");
      }

});

app.delete("/employee", async(req, res) =>{
      try {
        var num = req.body.num
        var results = await Employees.find({Invoice:num});
        if(results.length>0){
          await Employees.deleteMany({Invoice:num});
          var msg = "deleted invoice " + num;
          res.send(msg);
        }
        else{
          res.send("no such invoice found");
        }
      } catch (error) {
        console.log(error);
        res.send("failed to delete invoice");
      }

});

// Start the server
app.listen(port, () => {
    console.log("Server running on port: " + port);
  });