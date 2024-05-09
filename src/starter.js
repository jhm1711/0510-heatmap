import * as d3 from "d3";
import "./viz.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");
let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));

let newHeight = 200;

const margin = { top: 20, right: 10, bottom: 100, left: 10 };

// scale
const xScale = d3
  .scaleBand()
  .range([margin.left, width - margin.right])
  .paddingInner(0.1);

const colorScale = d3
  .scaleSequential()
  .domain([0.8, -0.8])
  .interpolator(d3.interpolateRgbBasis(["red", "white", "green"]));

const colorScale2 = d3
  .scaleSequential()
  .domain([0.8, -0.8])
  .interpolator(d3.interpolateRgbBasis(["orange", "white", "blue"]));

const xLegendScale = d3
  .scaleBand()
  .range([width / 2 - 140, width / 2 + 140])
  .paddingInner(0.1);

// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
// data
let northernLegendRects, northernLegendLabels;
let southernLegendRects, southernLegendLabels;
let northernLegendData, southernLegendData;

let northernRects;
let southernRects;
let northernData = [];
let southernData = [];
let xAxis;

d3.csv("data/temperature-anomaly-data.csv").then((raw_data) => {
  northernData = raw_data
    .filter((d) => d.Entity == "Northern hemisphere")
    // .map((d) => d)
    .map((d) => {
      const obj = {};
      obj.year = parseInt(d.Year);
      obj.avg = +d["Global average temperature anomaly relative to 1961-1990"];
      return obj;
    });

  northernLegendData = d3.range(
    d3.min(northernData, (d) => d.avg),
    d3.max(northernData, (d) => d.avg),
    0.2
  );

  xScale.domain(northernData.map((d) => d.year));

  xAxis = d3
    .axisBottom(xScale)
    .tickValues(xScale.domain().filter((d) => !(d % 10)));

  svg
    .append("g")
    .attr("transform", `translate(0, ${newHeight - margin.bottom + 40})`)
    .attr("class", "x-axis")
    .call(xAxis);

  northernRects = svg
    .selectAll(".northern-rect")
    .data(northernData)
    .enter()
    .append("rect")
    .attr("class", "northern-rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", margin.top - 30)
    .attr("width", xScale.bandwidth())
    .attr("height", newHeight - margin.bottom + 50)
    .attr("fill", (d) => colorScale(d.avg));

  xLegendScale.domain(northernLegendData.map((d, i) => i));

  northernLegendRects = svg
    .selectAll(".northern-legend-rect")
    .data(northernLegendData)
    .enter()
    .append("rect")
    .attr("class", "northern-legend-rect")
    .attr(
      "x",
      (d, i) =>
        width -
        margin.right -
        xLegendScale.bandwidth() * (northernLegendData.length - i)
    )
    .attr("y", newHeight - margin.bottom + 65)
    .attr("width", xLegendScale.bandwidth())
    .attr("height", 20)
    .attr("fill", (d) => colorScale(d));

  northernLegendLabels = svg
    .selectAll(".northern-legend-label")
    .data(northernLegendData)
    .enter()
    .append("text")
    .attr("class", "northern-legend-label")
    .attr(
      "x",
      (d, i) =>
        width -
        margin.right -
        xLegendScale.bandwidth() * (northernLegendData.length - i) +
        (xLegendScale.bandwidth() - 5)
    )
    .attr("y", newHeight - margin.bottom + 80)
    .text((d) => d3.format("0.1f")(d))
    .attr("class", "legend-labels")
    .style("fill", (d) => (d >= 0.5 ? "#fff" : "#111"));

  ////// heatmap2
  southernData = raw_data
    .filter((d) => d.Entity == "Southern hemisphere")
    // .map((d) => d)
    .map((d) => {
      const obj = {};
      obj.year = parseInt(d.Year);
      obj.avg = +d["Global average temperature anomaly relative to 1961-1990"];
      return obj;
    });

  southernLegendData = d3.range(
    d3.min(southernData, (d) => d.avg),
    d3.max(southernData, (d) => d.avg),
    0.2
  );

  xScale.domain(southernData.map((d) => d.year));

  xAxis = d3
    .axisBottom(xScale)
    .tickValues(xScale.domain().filter((d) => !(d % 10)));

  svg
    .append("g")
    .attr("transform", `translate(0, ${newHeight - margin.bottom + 245})`)
    .attr("class", "x-axis")
    .call(xAxis);

  southernRects = svg
    .selectAll(".southern-rect")
    .data(southernData)
    .enter()
    .append("rect")
    .attr("class", "southern-rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", margin.top + 185)
    .attr("width", xScale.bandwidth())
    .attr("height", newHeight - margin.bottom + 40)
    .attr("fill", (d) => colorScale2(d.avg));

  xLegendScale.domain(southernLegendData.map((d, i) => i));

  southernLegendRects = svg
    .selectAll(".southern-legend-rect")
    .data(southernLegendData)
    .enter()
    .append("rect")
    .attr("class", "southern-legend-rect")
    .attr(
      "x",
      (d, i) =>
        width -
        margin.right -
        xLegendScale.bandwidth() * (southernLegendData.length - i)
    )
    .attr("y", newHeight - margin.bottom + 270)
    .attr("width", xLegendScale.bandwidth())
    .attr("height", 20)
    .attr("fill", (d) => colorScale2(d));

  southernLegendLabels = svg
    .selectAll(".southern-legend-label")
    .data(southernLegendData)
    .enter()
    .append("text")
    .attr("class", "southern-legend-label")
    .attr(
      "x",
      (d, i) =>
        width -
        margin.right -
        xLegendScale.bandwidth() * (southernLegendData.length - i) +
        xLegendScale.bandwidth() / 2
    )
    .attr("y", newHeight - margin.bottom + 285)
    .text((d) => d3.format("0.1f")(d))
    .attr("class", "legend-labels")
    .style("fill", (d) => (d <= -0.3 ? "#fff" : "#111"));

  //// resize
  function handleResize() {
    width = parseInt(d3.select("#svg-container").style("width"));
    height = parseInt(d3.select("#svg-container").style("height"));

    svg.attr("width", width).attr("height", height);

    xScale.range([margin.left, width - margin.right]);
    xLegendScale.range([width / 2 - 140, width / 2 + 140]);

    svg.selectAll(".x-axis").call(xAxis);

    northernRects
      .attr("x", (d) => xScale(d.year))
      .attr("width", xScale.bandwidth());

    southernRects
      .attr("x", (d) => xScale(d.year))
      .attr("width", xScale.bandwidth());

    northernLegendRects.attr(
      "x",
      (d, i) =>
        width -
        margin.right -
        xLegendScale.bandwidth() * (northernLegendData.length - i)
    );

    southernLegendRects.attr(
      "x",
      (d, i) =>
        width -
        margin.right -
        xLegendScale.bandwidth() * (southernLegendData.length - i)
    );

    northernLegendLabels.attr(
      "x",
      (d, i) =>
        width -
        margin.right -
        xLegendScale.bandwidth() * (northernLegendData.length - i) +
        xLegendScale.bandwidth() / 2
    );

    southernLegendLabels.attr(
      "x",
      (d, i) =>
        width -
        margin.right -
        xLegendScale.bandwidth() * (southernLegendData.length - i) +
        xLegendScale.bandwidth() / 2
    );
  }

  window.addEventListener("resize", handleResize);

  handleResize();

  ////interaction
  const formatValue = d3.format(".3f");

  function updateInteraction() {
    northernData = raw_data
      .filter(
        (d) =>
          d.Entity === "Northern hemisphere" &&
          !isNaN(d.Year) &&
          !isNaN(d["Global average temperature anomaly relative to 1961-1990"])
      )
      .map((d) => ({
        year: parseInt(d.Year),
        avg: +d["Global average temperature anomaly relative to 1961-1990"],
      }));

    southernData = raw_data
      .filter(
        (d) =>
          d.Entity === "Southern hemisphere" &&
          !isNaN(d.Year) &&
          !isNaN(d["Global average temperature anomaly relative to 1961-1990"])
      )
      .map((d) => ({
        year: parseInt(d.Year),
        avg: +d["Global average temperature anomaly relative to 1961-1990"],
      }));

    northernRects
      .data(northernData)
      .on("mouseover", function (d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("width", xScale.bandwidth() * 1.2)
          .style("opacity", 0.3);

        const centerX = xScale(d.year) + xScale.bandwidth() / 2;
        const centerY = margin.top - 30 + (newHeight - margin.bottom + 50) / 2;

        svg
          .append("text")
          .attr("id", "tooltip")
          .attr("x", centerX)
          .attr("y", centerY)
          .text("Year: " + d.year + ", Avg: " + formatValue(d.avg))
          .style("text-anchor", "middle")
          .style("fill", "black")
          .style("font-size", "12px");
      })

      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("width", xScale.bandwidth())
          .style("opacity", 1);

        svg.select("#tooltip").remove();
      });

    southernRects
      .data(southernData)
      .on("mouseover", function (d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("width", xScale.bandwidth() * 1.2)
          .style("opacity", 0.3);

        const centerX = xScale(d.year) + xScale.bandwidth() / 2;
        const centerY = margin.top + 185 + (newHeight - margin.bottom + 40) / 2;
        svg
          .append("text")
          .attr("id", "tooltip")
          .attr("x", centerX)
          .attr("y", centerY)
          .text("Year: " + d.year + ", Avg: " + formatValue(d.avg))
          .style("text-anchor", "middle")
          .style("fill", "black")
          .style("font-size", "12px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("width", xScale.bandwidth())
          .style("opacity", 1);

        svg.select("#tooltip").remove();
      });
  }
  updateInteraction();
});
