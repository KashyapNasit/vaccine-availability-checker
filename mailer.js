const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "<EMAIL>",
    pass: "<PASSWORD>",
  },
});

function logIt(data, type) {
  const fs = require("fs");
  const now = new Date();
  const tommorow_date = now.toString();
  fs.appendFileSync(
    "/home/kashyap/Desktop/Vaccine/hello-world/data/log.txt",
    "\n" + tommorow_date + ` [${type}] ` + data
  );
}

function sendMail(to, data) {
//   console.log(to);
  let body = `<html>
	<head>
	<style>
	#table {
		font-family: Arial, Helvetica, sans-serif;
		border-collapse: collapse;
		width: 100%;
	}
	
	#table td, #table th {
		border: 1px solid #ddd;
		padding: 8px;
	}
	
	#table tr:nth-child(even){background-color: #f2f2f2;}
	
	#table tr:hover {background-color: #ddd;}
	
	#table th {
		padding-top: 12px;
		padding-bottom: 12px;
		text-align: left;
		background-color: #4CAF50;
		color: white;
	}
	</style>
	</head>
	<body>
	
	<table id="table">
		<tr>
			<th>Sr No.</th>
			<th>Center Name</th>
			<th>Pin Code</th>
			<th>Free/ Paid</th>
			<th>Availability</th>
			<th>Age</th>
			<th>Date</th>
		<tr>
	`;

  data.forEach((center, index) => {
    body =
      body +
      `<tr>
											<td>${index + 1}</td>
											<td>${center.center_name}</td>
											<td>${center.pin_code}</td>
											<td>${center.fee_type}</td>
											<td>${center.availability}</td>
											<td>${center.for_age}</td>
											<td>${center.date}</td>											
									</tr>`;
  });

  body = body + "</table></body></html>";
  const mailOptions = {
    from: "knasit29@gmail.com",
    to: to,
    subject: "Found a vaccine center for you!",
    html: body,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      logIy(error, "ERROR");
    } else {
      logIt("Email sent: " + to + " - " + info.response, "INFO");
    }
  });
}

exports.sendMail = sendMail;
