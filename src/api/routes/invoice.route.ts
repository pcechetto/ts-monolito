import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.facade.factory";

export const incoiveRoute = express.Router();

incoiveRoute.get("/:id", async (req: Request, res: Response) => {
  const facade = InvoiceFacadeFactory.create();

  try {
    const result = await facade.find({ id: req.params.id });
    res.status(200).send(result);
  } catch (error) {
    return res.status(404).send({ error: error });
  }
});
