const axios = require("axios");
const date = require("date-and-time");
const mailer = require("./mailer");

function main() {
  const data = require("./db.json");
  data.forEach((user) => {
    checkAvaibility(user);
  });
  logIt("RUN DONE", "INFO");
  setTimeout(main, 300000);

  //   console.log(data);
}

function logIt(data, type) {
  const fs = require("fs");
  const now = new Date();
  const tommorow_date = now.toString();
  fs.appendFileSync(
    "log.txt",
    "\n" + tommorow_date + ` [${type}] ` + data
  );
}

function resposeHandler(data) {
  const { centers, age, email } = data;
  // console.log(email)
  let availability = [];
  centers.forEach((center) => {
    const sessions = center.sessions;
    sessions.forEach((session) => {
      if (session.available_capacity > 0 && session.min_age_limit == age) {
        availability.push({
          center_name: center.name,
          pin_code: center.pincode,
          fee_type: center.fee_type,
          availability: session.available_capacity,
          for_age: session.min_age_limit,
          date: session.date,
        });
      }
    });
  });
  if (availability.length > 0) {
    // console.log(availability);
    logIt(availability, "INFO");
    mailer.sendMail(email, availability);
  }

}

function checkAvaibility(user) {
  const { age, search_type, search_value, email } = user;
  const today = new Date();
  const tomorrow = new Date(today);
  let tommorow_date = new Date(tomorrow.setDate(tomorrow.getDate()));
  let day = tommorow_date.getDate();
  day = day.toString().length == 1 ? "0" + day : day;
  let month = tommorow_date.getMonth() + 1;
  month = month.toString().length == 1 ? "0" + month : month;
  tommorow_date = day + "-" + month + "-" + tommorow_date.getFullYear();
  const options = {
    headers: {
      "Accept-Language": "hi_IN",
      accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36",
      Origin: "https://www.cowin.gov.in",
      "Sec-Fetch-Site": "cross-site",
      "Sec-Fetch-Mode": "cors",
      Referer: "https://www.cowin.gov.in/",
    },
  };
  if (search_type === "pincode") {
    axios
      .get(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${search_value}&date=${tommorow_date}`,
        options
      )
      .then((response) => {
        if (response !== null) {
          let data = response.data;
          data.age = age;
          data.email = email;
          resposeHandler(response.data);
        }
      })
      .catch((error) => {
        logIt(error,"ERROR");
      });
  } else if (search_type === "district") {
    axios
      .get(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${search_value}&date=${tommorow_date}`,
        options
      )
      .then((response) => {
        if (response !== null) {
          let data = response.data;
          data.age = age;
          data.email = email;
          resposeHandler(response.data);
        }
      })
      .catch((error) => {
        logIt(error,"ERROR");
      });
  }
}

// checkAvaibility(441108, 45);
main();
