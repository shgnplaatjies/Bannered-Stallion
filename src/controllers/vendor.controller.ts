import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import { EntityManager, In } from "typeorm";
import { Dish } from "../models/Dish.entity";
import { User } from "../models/User.entity";
import { Vendor } from "../models/Vendor.entity";
import { VendorUser } from "../models/VendorUser.entity";
import { CustomSessionData } from "../services/types/interface";
import { handleError } from "../services/utils/error.service";
import { transactionWrapper } from "../services/utils/transaction.service";
import { convertToArray } from "../services/utils/utils.service";

export const createVendorController = (entityManager: EntityManager) => {
  const createVendor = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { name } = req.body;
    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const user = await manager.findOne(User, {
          where: { sub: sub },
        });

        if (!user) return res.status(401).send("User not found");

        let vendorUser = await manager.findOne(VendorUser, {
          where: { user: { id: user.id } },
        });

        if (vendorUser)
          return res
            .status(409)
            .send("Duplicate entry. Only one store allowed per user.");

        vendorUser = new VendorUser(user);
        await manager.save(vendorUser);

        const vendor = new Vendor(name, vendorUser);

        await manager.save(vendor);

        return res.status(201).send(STATUS_CODES[201]);
      });
    } catch (error) {
      return handleError(
        new Error(String(error)),
        "Create rating operation failed",
        {
          req,
          res,
          status: 500,
        }
      );
    }
  };

  const readVendors = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { vendorId } = req.params;

    const arrayVendorId = convertToArray(vendorId);

    if (!arrayVendorId)
      return res.status(400).send("Invalid vendorId parameter");

    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      const vendor = await transactionWrapper(
        entityManager,
        async (manager) => {
          const user = await manager.findOne(User, {
            where: { sub: sub },
          });

          if (!user) return res.status(404).send("User not found");

          const vendorToView = await manager.find(Vendor, {
            where: {
              vendorUser: { user: { id: user.id } },
              id: In(arrayVendorId),
            },
          });

          if (!vendorToView || vendorToView.length === 0)
            return res.status(404).send("Vendor not found");

          return res.status(200).json(vendorToView);
        }
      );
    } catch (error) {
      handleError(new Error(String(error)), "Error viewing vendor: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const updateVendor = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { vendorId } = req.params;
    const { name } = req.body;

    if (!vendorId)
      return res
        .status(400)
        .send("Invalid request, missing vendorId url parameters");
    if (!name)
      return res.status(400).send("Invalid request, missing body parameters");

    let sub: string | undefined;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const vendorToUpdate = await manager.findOne(Vendor, {
          where: { vendorUser: { user: { sub: sub } }, id: Number(vendorId) },
        });

        if (!vendorToUpdate) return res.status(404).send(STATUS_CODES[404]);

        vendorToUpdate.name = name;
        await manager.save(vendorToUpdate);

        return res
          .status(200)
          .json({ status: STATUS_CODES[200], updatedVendor: vendorToUpdate });
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error updating vendor: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const deleteVendor = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { vendorId } = req.params;

    if (!vendorId)
      return res
        .status(400)
        .send("Invalid request, missing vendorId parameter");

    let sub: string | undefined;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const vendorToDelete = await manager.findOne(Vendor, {
          where: { vendorUser: { user: { sub: sub } }, id: Number(vendorId) },
        });

        const vendorUserToDelete = await manager.findOne(VendorUser, {
          where: { user: { sub: sub } },
        });

        if (!vendorToDelete || !vendorUserToDelete)
          return res.status(404).send(STATUS_CODES[404]);

        await manager.remove(vendorToDelete);
        await manager.remove(vendorUserToDelete);

        return res.status(200).send(STATUS_CODES[200]);
      });
    } catch (error) {
      handleError(
        new Error(String(error)),
        "Error deleting vendor with vendorId:" + vendorId
      );
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const createVendorDish = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { vendorId } = req.params;
    const { name, price } = req.body;

    if (!price)
      return res
        .status(400)
        .send("Invalid Request. Missing price field in request.");
    if (!name)
      return res
        .status(400)
        .send("Invalid Request. Missing name field in request.");

    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const user = await manager.findOne(User, {
          where: { sub: sub },
        });

        if (!user)
          return res
            .status(401)
            .send("User not found. Please register an account.");

        let vendor = await manager.findOne(Vendor, {
          where: {
            vendorUser: { user: { id: user.id } },
            id: Number(vendorId),
          },
        });

        if (!vendor)
          return res
            .status(404)
            .send("Vendor Not Found. Please create a vendor first.");

        const vendorDish = new Dish(vendor, name, Number(price));

        await manager.save(vendorDish);

        return res
          .status(201)
          .json({ status: STATUS_CODES[201], vendorDish: vendorDish });
      });
    } catch (error) {
      return handleError(
        new Error(String(error)),
        "Create dish operation failed",
        {
          req,
          res,
          status: 500,
        }
      );
    }
  };

  const readVendorDishes = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { vendorId, dishId } = req.params;

    const arrayVendorId = convertToArray(vendorId);
    const arrayDishId = convertToArray(dishId);

    if (!arrayVendorId)
      //TODO: Add option to search all by leaving this out.
      return res.status(400).send("Invalid or missing vendorId parameter");
    if (!arrayDishId)
      //TODO: Add option to search all by leaving this out.
      return res.status(400).send("Invalid or missing dishId parameter");

    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const user = await manager.findOne(User, {
          where: { sub: sub },
        });

        if (!user) return res.status(404).send("User not found");

        const dishesToView = await manager.find(Dish, {
          where: {
            vendor: {
              vendorUser: { user: { id: user.id } },
              id: In(arrayVendorId),
            },
            id: In(arrayDishId),
          },
        });

        if (!dishesToView || dishesToView.length === 0)
          return res.status(404).send("Dishes not found");

        return res.status(200).json(dishesToView);
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error viewing vendor: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const updateVendorDish = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { vendorId, dishId } = req.params;
    const { name, price } = req.body; // Cannot migrate dishes between vendors

    if (!vendorId || !dishId)
      return res
        .status(400)
        .send("Invalid request, missing vendorId url parameters");
    if (!name || !price)
      return res.status(400).send("Invalid request, missing body parameters");

    let sub: string | undefined;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const dishToUpdate = await manager.findOne(Dish, {
          where: {
            vendor: {
              vendorUser: { user: { sub: sub } },
              id: Number(vendorId),
            },
            id: In([Number(dishId)]),
          },
        });

        if (!dishToUpdate)
          return res.status(404).send("Dish not found, or unauthorized.");

        dishToUpdate.name = name;
        dishToUpdate.price = Number(price);
        await manager.save(dishToUpdate);

        return res
          .status(200)
          .json({ status: STATUS_CODES[200], updatedDish: dishToUpdate });
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error updating vendor: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const deleteVendorDish = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { vendorId, dishId } = req.params;

    if (!dishId)
      return res.status(400).send("Invalid request, missing dishId parameter");

    let sub: string | undefined;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const dishToDelete = await manager.findOne(Dish, {
          where: {
            vendor: {
              vendorUser: { user: { sub: sub } },
              id: Number(vendorId),
            },
            id: Number(dishId),
          },
        });

        if (!dishToDelete)
          return res.status(404).send("Dish not found with id:" + dishId);

        await manager.remove(dishToDelete);

        return res.status(200).send(STATUS_CODES[200]);
      });
    } catch (error) {
      handleError(
        new Error(String(error)),
        "Error deleting vendor with dishId:" + dishId
      );
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const createOrderDish = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { vendorId } = req.params;
    const { name, price } = req.body;

    if (!price)
      return res
        .status(400)
        .send("Invalid Request. Missing price field in request.");
    if (!name)
      return res
        .status(400)
        .send("Invalid Request. Missing name field in request.");

    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const user = await manager.findOne(User, {
          where: { sub: sub },
        });

        if (!user)
          return res
            .status(401)
            .send("User not found. Please register an account.");

        let vendor = await manager.findOne(Vendor, {
          where: {
            vendorUser: { user: { id: user.id } },
            id: Number(vendorId),
          },
        });

        if (!vendor)
          return res
            .status(404)
            .send("Vendor Not Found. Please create a vendor first.");

        const vendorDish = new Dish(vendor, name, Number(price));

        await manager.save(vendorDish);

        return res
          .status(201)
          .json({ status: STATUS_CODES[201], vendorDish: vendorDish });
      });
    } catch (error) {
      return handleError(
        new Error(String(error)),
        "Create dish operation failed",
        {
          req,
          res,
          status: 500,
        }
      );
    }
    return res.status(500).send(STATUS_CODES[500]);
  };

  const readVendorOrderDishes = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { vendorId, dishId } = req.params;

    const arrayVendorId = convertToArray(vendorId);
    const arrayDishId = convertToArray(dishId);

    if (!arrayVendorId)
      //TODO: Add option to search all by leaving this out.
      return res.status(400).send("Invalid or missing vendorId parameter");
    if (!arrayDishId)
      //TODO: Add option to search all by leaving this out.
      return res.status(400).send("Invalid or missing dishId parameter");

    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const user = await manager.findOne(User, {
          where: { sub: sub },
        });

        if (!user) return res.status(404).send("User not found");

        const dishesToView = await manager.find(Dish, {
          where: {
            vendor: {
              vendorUser: { user: { id: user.id } },
              id: In(arrayVendorId),
            },
            id: In(arrayDishId),
          },
        });

        if (!dishesToView || dishesToView.length === 0)
          return res.status(404).send("Dishes not found");

        return res.status(200).json(dishesToView);
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error viewing vendor: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const updateVendorOrderDish = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { vendorId, dishId } = req.params;
    const { name, price } = req.body; // Cannot migrate dishes between vendors

    if (!vendorId || !dishId)
      return res
        .status(400)
        .send("Invalid request, missing vendorId url parameters");
    if (!name || !price)
      return res.status(400).send("Invalid request, missing body parameters");

    let sub: string | undefined;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const dishToUpdate = await manager.findOne(Dish, {
          where: {
            vendor: {
              vendorUser: { user: { sub: sub } },
              id: Number(vendorId),
            },
            id: In([Number(dishId)]),
          },
        });

        if (!dishToUpdate)
          return res.status(404).send("Dish not found, or unauthorized.");

        dishToUpdate.name = name;
        dishToUpdate.price = Number(price);
        await manager.save(dishToUpdate);

        return res.status(200).send(STATUS_CODES[200]);
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error updating vendor: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const deleteVendorOrderDish = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { vendorId, dishId } = req.params;

    if (!dishId)
      return res.status(400).send("Invalid request, missing dishId parameter");

    let sub: string | undefined;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const dishToDelete = await manager.findOne(Dish, {
          where: {
            vendor: {
              vendorUser: { user: { sub: sub } },
              id: Number(vendorId),
            },
            id: Number(dishId),
          },
        });

        if (!dishToDelete)
          return res.status(404).send("Dish not found with id:" + dishId);

        await manager.remove(dishToDelete);

        return res.status(200).send(STATUS_CODES[200]);
      });
    } catch (error) {
      handleError(
        new Error(String(error)),
        "Error deleting vendor with dishId:" + dishId
      );
      return res.status(500).send(STATUS_CODES[500]);
    }
  };
  return {
    createVendor,
    readVendors,
    updateVendor,
    deleteVendor,
    createVendorDish,
    readVendorDishes,
    updateVendorDish,
    deleteVendorDish,
    readVendorOrderDishes,
    updateVendorOrderDish,
    deleteVendorOrderDish,
  };
};
