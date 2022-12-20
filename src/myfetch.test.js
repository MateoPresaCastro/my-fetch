const myFetch = require("./myfetch.js");

const URL = "https://jsonplaceholder.typicode.com/posts/";

const OPTIONS = {
  method: "POST",
  body: JSON.stringify({
    title: "foo",
    body: "bar",
    userId: 1,
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
};

beforeEach(() => {
  options = OPTIONS;
});

describe("General", () => {
  test("Should return a Response object", async () => {
    const myResponse = await myFetch(URL);
    expect(myResponse).toBeInstanceOf(Response);
  });
});

describe("GET requests", () => {
  test("Should GET like the regular fetch", async () => {
    const myResponse = await myFetch(URL);
    const myData = await myResponse.json();

    const response = await fetch(URL);
    const data = await response.json();

    expect(myData).toStrictEqual(data);
  });
});

describe("POST requests", () => {
  test("Should POST like the regular fetch", async () => {
    const myResponse = await myFetch(URL, options);
    const myData = await myResponse.json();

    const response = await fetch(URL, options);
    const data = await response.json();

    expect(myData).toStrictEqual(data);
  });
});

describe("PUT requests", () => {
  test("Should PUT like the regular fetch", async () => {
    options.method = "PUT";
    options.body = JSON.stringify({
      id: 1,
      title: "foo",
      body: "bar",
      userId: 1,
    });

    const myResponse = await myFetch(URL + "1", options);
    const myData = await myResponse.json();

    const response = await fetch(URL + "1", options);
    const data = await response.json();

    expect(myData).toStrictEqual(data);
  });
});

describe("DELETE requests", () => {
  test("Should DELETE like the regular fetch", async () => {
    options.method = "DELETE";

    const myResponse = await myFetch(URL + "1", options);
    const myData = await myResponse.json();

    const response = await fetch(URL, options);
    const data = await response.json();

    expect(myData).toStrictEqual(data);
  });
});