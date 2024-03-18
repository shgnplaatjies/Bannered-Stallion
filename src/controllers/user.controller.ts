import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import { EntityManager } from "typeorm";
import { Role } from "../models/Role.entity";
import { User } from "../models/User.entity";
import { CustomSessionData } from "../services/types/interface";
import { handleError } from "../services/utils/error.service";
import { transactionWrapper } from "../services/utils/transaction.service";

export const createUserController = (entityManager: EntityManager) => {
  const readUser = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      // Should use userId from apiCookie outside of auth.controller and auth.middleware
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send("Unauthorized. Please login or register.");
    // else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const user = await manager.findOne(User, {
          where: {
            sub: sub,
          },
        });

        if (!user) return res.status(401).send("No user exists.");
        return res.status(200).send({ name: user.name, email: user.email });
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error viewing user: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const updateUser = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { name } = req.body;

    if (!name)
      return res.status(400).send("Invalid request, missing body parameters");

    let sub: string | undefined;

    // if (!req.session.apiCookie) return res.status(401).send(STATUS_CODES[401]);
    // const { userId } = req.session.apiCookie;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send("Unauthorized. Please login or register.");

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const user = await manager.findOne(User, {
          where: { sub: sub },
          // where: { id: Number(userId) },
          select: ["email", "id", "role"],
        });

        if (!user) return res.status(401).send(STATUS_CODES[401]);

        const role = await manager.findOne(Role, {
          where: { users: { sub: sub } },
          // where: { users: { id: Number(userId) } },
        });
        if (!role) return res.status(401).send(STATUS_CODES[401]);

        user.name = name; // Rest controlled by identity provider

        await manager.save(user);

        return res
          .status(200)
          .send({ name: user.name, role: user.role, email: user.email });
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error updating user: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const deleteUser = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send("Unauthorized. Please login or register.");

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const user = await manager.findOne(User, {
          where: { sub: sub },
        });

        if (!user) return res.status(404).send(STATUS_CODES[404]);

        await manager.remove(user);

        return res.status(200).send();
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error deleting user");
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const readRole = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      // Should use userId from apiCookie outside of auth.controller and auth.middleware
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send("Unauthorized. Please login or register.");
    // else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const role = await manager.findOne(Role, {
          where: {
            users: { sub: sub },
          },
        });

        if (!role) return res.status(401).send("No role exists.");

        return res.status(200).send({ role: role.name });
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error viewing user: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const updateRole = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { roleId } = req.params;

    if (!roleId)
      return res.status(400).send("Invalid request, missing body parameters");

    let sub: string | undefined;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send("Unauthorized. Please login or register.");

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const currentRole = await manager.findOne(Role, {
          where: { users: { sub: sub } },
        });

        if (!currentRole) return res.status(401).send(STATUS_CODES[401]);

        const requestedRole = await manager.findOne(Role, {
          where: { id: Number(roleId) },
        });

        if (!requestedRole) return res.status(400).send("Invalid roleId");

        if (requestedRole.id === currentRole.id)
          return res
            .status(409)
            .send({ error: STATUS_CODES[409], currentRole: currentRole.id });

        const user = await manager.findOne(User, { where: { sub: sub } });

        if (!user) return res.status(401).send(STATUS_CODES[401]);

        user.role = requestedRole;

        await manager.save(user);

        return res.status(200).send({ name: user.name, role: user.role });
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error updating user: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  return {
    readUser,
    updateUser,
    deleteUser,
    readRole,
    updateRole,
  };
};
