d3.select("div")
  .append("h1")
  .attr("id", "title")
  .text("Doping in Professional Bicycle Racing");
const w = 900;
const h = 700;
const padding = 70;
const svg = d3.select("div").append("svg").attr("width", w).attr("height", h);
const div = d3
  .select("div")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);
proceede();

async function getData() {
  return fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((d) => {
      return d;
    });
}
async function proceede() {
  const fullData = await getData();
  const years = fullData.map((d) => {
    return d.Year;
  });
  const minutes = fullData.map((d) => {
    let temp = d.Time.split(":");

    return new Date(1970, 1, 0, 0, temp[0], temp[1]);
  });
  minutes[2] = new Date(1970, 1, 0, 0, 37, 15);

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(years, (d) => {
        return d;
      }) - 1,
      d3.max(years, (d) => {
        return d;
      }) + 1,
    ])
    .range([padding, w - padding]);
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  svg
    .append("g")
    .attr("transform", "translate(0, " + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis);
  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(minutes, (d) => {
        return d.getMinutes() + d.getSeconds() / 60;
      }),
      d3.max(minutes, (d) => {
        return d.getMinutes() + d.getSeconds() / 60;
      }),
    ])
    .range([h - padding, padding]);
  const yScaleAxis = d3
    .scaleLinear()
    .domain([
      d3.max(minutes, (d) => {
        return d.getMinutes() + d.getSeconds() / 60;
      }),
      d3.min(minutes, (d) => {
        return d.getMinutes() + d.getSeconds() / 60;
      }),
    ])
    .range([h - padding, padding]);
  const yAxis = d3
    .axisLeft(yScaleAxis)
    .tickFormat(function (d) {
      let t = d.toString().split(".");
      let m = t[0];
      let s = t[1] ? (t[1] * 6).toString() : "00";
      s = s.length > 1 ? s : "0" + s;
      return m + ":" + s;
    })
    .ticks(10);

  svg
    .append("g")
    .attr("transform", "translate( " + padding + ",0)")
    .attr("id", "y-axis")
    .call(yAxis);

  svg
    .selectAll("cirlce")
    .data(fullData)
    .enter()
    .append("circle")
    .attr("r", 10)
    .attr("cx", (d) => {
      return xScale(d.Year);
    })
    .attr("cy", (d, i) => {
      return h - yScale(minutes[i].getMinutes() + minutes[i].getSeconds() / 60);
    })
    .attr("data-xvalue", (d) => {
      return d.Year;
    })
    .attr("data-yvalue", (d, i) => {
      return minutes[i];
    })
    .attr("class", (d) => {
      if (d.Doping == "") {
        return "no-dope dot";
      } else {
        return "dope dot";
      }
    })
    .on("mouseover", (evt, d) => {
      evt.target.setAttribute("r", "15");
      div
        .style("opacity", 0.9)
        .attr("data-year", d.Year)
        .html(
          d.Name +
            ":" +
            d.Nationality +
            "<br/>" +
            "Year: " +
            d.Year +
            " Time:" +
            d.Time +
            "<br/><br/>" +
            d.Doping
        )
        .style("left", evt.x + "px")
        .style("top", evt.y + "px");
    })
    .on("mouseout", (evt, d) => {
      evt.target.setAttribute("r", "10");

      div.style("opacity", 0);
    });

  svg
    .append("g")
    .attr("id", "legend")
    .append("text")
    .attr("x", 600)
    .attr("y", 250)
    .text("No doping allegations");
  d3.select("#legend")
    .append("rect")
    .attr("x", 750)
    .attr("y", 239)
    .attr("width", 15)
    .attr("height", 15)
    .attr("class", "no-dope");

  d3.select("#legend")
    .append("rect")
    .attr("x", 750)
    .attr("y", 278)
    .attr("width", 15)
    .attr("height", 15)
    .attr("class", "dope");

  d3.select("#legend")
    .append("text")
    .attr("x", 546)
    .attr("y", 290)
    .text("Riders with doping allegations");
}
