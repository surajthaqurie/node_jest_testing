const crypto = require("crypto");
const { getData } = require("../app");

jest.mock("crypto");

test("Fetch data", async () => {
  //   crypto.randomBytes.mockResolvedValueOnce("bytes");
  crypto.randomBytes.mockImplementationOnce(() => Promise.resolve("bytes"));

  const res = await getData();
  console.log(res);
  expect(res).toBe("bytes");
});
