import { expect } from "chai";
import { readData } from "../models/model";
import app from "../index";
import chai from "chai";
import chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe("updateApparel", () => {
  it("should update the apparel", async () => {
    const res = await chai
      .request(app)
      .patch("/api/apparel")
      .send({ code: "A001", size: "M", stock: 20, price: 30 });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Apparel updated");
    const updatedApparels = await readData();
    expect(updatedApparels[0].code).to.equal("A001");
    expect(updatedApparels[0].size).to.equal("M");
    expect(updatedApparels[0].stock).to.equal(20);
    expect(updatedApparels[0].price).to.equal(30);
  });

  it("should return a 400 Bad Request response if a required field is missing", async () => {
    const res = await chai
      .request(app)
      .patch("/api/apparel")
      .send({ size: "S", stock: 20, price: 30 });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property(
      "message",
      "Code, size, stock and price are required fields"
    );
  });

  it("should return a 404 Not Found response if the apparel is not found", async () => {
    const res = await chai
      .request(app)
      .patch("/api/apparel")
      .send({ code: "A003", size: "M", stock: 20, price: 30 });

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "Apparel not found");
  });
});

describe("updateMultipleApparels", () => {
  it("should update multiple apparels", async () => {
    const updates = [
      { code: "A001", size: "M", stock: 20, price: 30 },
      { code: "A002", size: "L", stock: 15, price: 40 },
    ];

    const res = await chai.request(app).put("/api/apparels").send(updates);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message").equal("Apparels updated");

    const apparels = await readData();
    expect(apparels[0].stock).to.equal(20);
    expect(apparels[0].price).to.equal(30);
    expect(apparels[1].stock).to.equal(15);
    expect(apparels[1].price).to.equal(40);
  });

  it("should return a 400 Bad Request error if a required field is missing", async () => {
    const updates = [
      { code: "A001", size: "M", stock: 20 },
      { code: "A002", size: "L", price: 40 },
    ];

    const res = await chai.request(app).put("/api/apparels").send(updates);

    expect(res.status).to.equal(400);
    expect(res.body)
      .to.have.property("error")
      .equal("Code, size, stock, and price are required fields");
  });

  it("should return a 404 Not Found error if the apparel is not found", async () => {
    const updates = [
      { code: "A001", size: "M", stock: 20, price: 30 },
      { code: "A003", size: "M", stock: 15, price: 40 },
    ];

    const res = await chai.request(app).put("/api/apparels").send(updates);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message").equal("Apparel not found");
    expect(res.body).to.have.property("apparel");
    expect(res.body.apparel).to.deep.equal({
      code: "A003",
      size: "M",
      stock: 15,
      price: 40,
    });
  });
});

describe("Check Order Fulfillment API", () => {
  it("Should return 'Order can be fulfilled' if all items can be fulfilled", async () => {
    const items = [
      { code: "A001", size: "M", quantity: 10 },
      { code: "A002", size: "L", quantity: 5 },
    ];

    const res = await chai.request(app).post("/api/order").send(items);

    expect(res.status).to.equal(200);
    expect(res.body)
      .to.have.property("message")
      .equal("Order can be fulfilled");
  });

  it("Should return 'Order cannot be fulfilled' if any item cannot be fulfilled", async () => {
    const items = [
      { code: "A001", size: "M", quantity: 30 },
      { code: "A002", size: "L", quantity: 5 },
    ];

    const res = await chai.request(app).post("/api/order").send(items);

    expect(res.status).to.equal(400);
    expect(res.body)
      .to.have.property("message")
      .equal("Order cannot be fulfilled");
    expect(res.body).to.have.property("notFulfilled").with.lengthOf(1);
    expect(res.body.notFulfilled[0]).to.have.property("code").equal("A001");
    expect(res.body.notFulfilled[0]).to.have.property("size").equal("M");
    expect(res.body.notFulfilled[0])
      .to.have.property("availableStock")
      .equal(20);
  });

  it("Should return 'Request Body must be a non-empty array of apparels' if the request body is invalid", async () => {
    const res = await chai.request(app).post("/api/order").send({});

    expect(res.status).to.equal(400);
    expect(res.body)
      .to.have.property("error")
      .equal("Request Body must be a non-empty array of apparels");
  });

  it("Should return 'Code, size, and quantity are required fields' if a required field is missing", async () => {
    const items = [
      { code: "A001", size: "M" },
      { code: "A002", size: "L", quantity: 5 },
    ];

    const res = await chai.request(app).post("/api/order").send(items);

    expect(res.status).to.equal(400);
    expect(res.body)
      .to.have.property("error")
      .equal("Code, size, and quantity are required fields");
  });

  it("Should return 'Quantity must be greater than 0' if the quantity is less than 0", async () => {
    const items = [
      { code: "A001", size: "M", quantity: -10 },
      { code: "A002", size: "L", quantity: 5 },
    ];
    const res = await chai.request(app).post("/api/order").send(items);

    expect(res.status).to.equal(400);
    expect(res.body)
      .to.have.property("error")
      .equal("Quantity must be greater than 0");
  });
});

describe("getMinCostForOrderFulfillment", () => {
  it("Should return a total cost of the order if all items are valid", async () => {
    const apparels = await readData();
    const items = [
      { code: apparels[0].code, size: apparels[0].size, quantity: 2 },
      { code: apparels[1].code, size: apparels[1].size, quantity: 1 },
    ];
    const res = await chai.request(app).post("/api/order/cost").send(items);
    expect(res.status).to.equal(200);
    expect(res.body.totalCost).to.equal(
      apparels[0].price * 2 + apparels[1].price * 1
    );
  });

  it("Should return 400 Bad Request if the request body is not a non-empty array of apparels", async () => {
    const res = await chai.request(app).post("/api/order/cost").send({});
    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal(
      "Request Body must be a non-empty array of apparels"
    );
  });

  it("Should return 400 Bad Request if any of the required fields are missing", async () => {
    const res = await chai
      .request(app)
      .post("/api/order/cost")
      .send([{ code: "A001", size: "M" }]);
    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal(
      "Code, size, and quantity are required fields"
    );
  });

  it("Should return 400 Bad Request if the quantity is less than 0", async () => {
    const apparels = await readData();
    const items = [
      { code: apparels[0].code, size: apparels[0].size, quantity: -2 },
    ];
    const res = await chai.request(app).post("/api/order/cost").send(items);
    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal(
      `Quantity for apparel with code '${apparels[0].code}' and size '${apparels[0].size}' must be greater than 0`
    );
  });
});
