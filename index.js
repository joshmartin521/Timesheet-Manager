
$(document).ready(function () {
  $.ajax({
    type: 'GET',
    url: '/main',
    success: function(response) {
      $("#bodymain").html(response);
    }
  });
});

function changePage1()
{
  $.ajax({
    type: 'GET',
    url: '/main',
    success: function(response) {
      $("#bodymain").html(response);
    }
  });
}

function changePage2()
{
  $.ajax({
    type: 'GET',
    url: '/table',
    success: function(response) {
      $("#bodymain").html(response);
      buildTable();
    }
  });
}


function highlightRow(id) {
  if($("#" + id).css("background-color",)=="rgb(255, 255, 0)")
  {
    $("#" + id).css("background-color", "");
  }
  else{
    var x = $("#emptab")[0].rows.length;
    // Clear the background color for all rows
    for (let i = 0; i < x; i++) {
        $("#row" + i).css("background-color", "");
    }

    // Set the background color for the selected row
    $("#" + id).css("background-color", "yellow");
  }
}

function highlightUser()
{
  var x = $("#emptab")[0].rows.length;
  for(let i=0; i<x; i++)
  {
    if($("#row"+i).css("background-color")=="rgb(255, 255, 0)")
    {
      var text = "First name: " + $('#fname' + i).text() + "\nLast Name: " + $('#lname' + i).text() + "\nLocation: " + $('#location' + i).text() + "\nVendor: " + $('#vendor' + i).text() + "\nCompany: " + $('#company' + i).text() + "\nInvoice Number: " + $('#invoice' + i).text() + "\nDates Worked: " + $('#ldate' + i).text() + "\nGL Code: " + $('#gl' + i).text() + "\nCost Centre: " + $('#cost' + i).text() + "\nAmount Owed: " + $('#amount' + i).text() + "\nHours worked: " + $('#hours' + i).text() + "\nTimesheet approved by: " + $('#approver' + i).text();
      alert(text);
    }
  }
}

function getTable()
{
  $.ajax({
    type: 'GET',
    url: '/employee'
  })
  .done(function(data) {
    // display the database in the div
    $('#tabarea').html(data);
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.error("Error: " + textStatus, errorThrown);
  });
}

function getAllUsers()
{
  $.ajax({
    type: 'GET',
    url: '/employee'
  })
  .done(function(data) {
    // display the database in the div
    $('#tabarea').html(data);
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.error("Error: " + textStatus, errorThrown);
  });
}

function submitUser(e)
{
  var user = {
    fname: document.getElementById("fname").value,
    lname: document.getElementById("lname").value,
    location: document.getElementById("location").value,
    vendor: document.getElementById("vendor").value,
    company: document.getElementById("company").value,
    invoice: document.getElementById("invoice").value,
    date: document.getElementById("datefrom").value + " - " + document.getElementById("dateto").value,
    gl: document.getElementById("gl").value,
    costcentre: document.getElementById("costcentre").value,
    amount: document.getElementById("amount").value,
    hours: document.getElementById("hours").value,
    approver: document.getElementById("approver").value
};

$.ajax({
    type: 'POST',
    url: '/employee',
    data: JSON.stringify(user),
    contentType: 'application/json',
    success: function(response) {
        var re = new RegExp("^Timesheet for employee.*$");
        if(re.test(response))
        {
          $('#empform').trigger("reset");
        }
        alert(response);
    },
    error: function(error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

e.preventDefault();
}

function deleteInvoice(e){
  e.preventDefault();
      var num = $('#deleteinv').val();
      $.ajax({
        type: 'DELETE',
        url: '/employee',
        contentType: 'application/json',
        data: JSON.stringify({ num: num }),
        success: function(response){
          alert(response);
          $('#deleteform').trigger("reset");
        },
        error: function(error) {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
      }
      });
}

function buildTable()
{
  $.ajax({
    type: 'GET',
    url: '/employee'
  })
  .done(function(data) {
    // display the database in the div
    $('#tabarea2').html(data);
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.error("Error: " + textStatus, errorThrown);
  });
}

function deleteRowFromTable()
{
  var x = $("#emptab")[0].rows.length;
  for(let i=0; i<x; i++)
  {
    if($("#row"+i).css("background-color")=="rgb(255, 255, 0)")
    {
      var num = $('#invoice' +i).text();
      $.ajax({
        type: 'DELETE',
        url: '/employee',
        contentType: 'application/json',
        data: JSON.stringify({ num: num }),
        success: function(response){
          alert(response);
          changePage2();
        },
        error: function(error) {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
      }
      });
    }
  }
}