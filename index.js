const fs = require("fs");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const { default: axios } = require("axios");

const getData = async () => {
  const response = await fetch(
    "https://internshala.com/jobs/software-development-jobs-in-hyderabad/",
    {
      Headers: {
        "Content-Type": "text/html",
      },
    }
  );

  const data = await response.text();
  const $ = cheerio.load(data);

  const titles = $(".job-internship-name");
  const titlesArray = [];
  titles.each((index, element) => {
    titlesArray.push($(element).text().trim());
  });

  const companies = $(".company-name");
  const companiesArray = [];
  companies.each((index, element) => {
    companiesArray.push($(element).text().trim());
  });

  const locations = $(".row-1-item.locations span a");
  const locationArray = [];
  locations.each((index, element) => {
    locationArray.push($(element).text());
  });

  const posted = $(".detail-row-2 .color-labels span");
  const postedArray = [];
  posted.each((index, element) => {
    postedArray.push($(element).text().trim());
  });

  const experience = $(".row-1-item:nth-child(2) > div");
  const experienceArray = [];
  experience.each((index, element) => {
    experienceArray.push($(element).text().trim());
  });

  const salary = $(".row-1-item:nth-child(3) > .desktop");
  const salaryArray = [];
  salary.each((index, element) => {
    salaryArray.push($(element).text().trim());
  });

  const jobs = [];
  titlesArray.map((item, index) => {
    jobs.push({
      title: item,
      company: companiesArray[index],
      location: locationArray[index],
      posted: postedArray[index],
      experience: experienceArray[index],
      salary: salaryArray[index],
    });
  });

  fs.writeFileSync("jobs.json", JSON.stringify(jobs));
  const xlsx = require("xlsx");
  const workbook = xlsx.utils.book_new();
  const sheetdata = xlsx.utils.json_to_sheet(jobs);
  xlsx.utils.book_append_sheet(workbook, sheetdata, "jobs");
  xlsx.writeFile(workbook, "jobs.xlsx");

  // console.log(titlesArray);
};

getData();
