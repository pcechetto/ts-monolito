import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const facade = ProductAdmFacadeFactory.create();

  try {
    const productDto = {
      name: req.body.name,
      description: req.body.description,
      purchasedPrice: req.body.purchasedPrice,
      stock: req.body.stock,
    };

    const result = await facade.addProduct(productDto);

    res.status(201).send(result);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
});
