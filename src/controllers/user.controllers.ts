import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { AuthenticatedRequest } from "../types/apiRequest";
import prisma from "../lib/prismaClient";

export const getUserDetails = asyncHandler(
  async (request: AuthenticatedRequest, response: Response) => {
    const userId = request.auth?.userId;

    

     response.json({message:"Protedcted route"})
  }
);
