import express from "express";
import { login, addStaff } from "../controller/staffsController.js";
// import { registerValidation } from '../validations/registerValidation.js';

const router = express.Router();

router.post("/addStaff", addStaff);
router.post("/login", login);
router.get("/getStaffs", (req, res) => {
  res.status(200).json({
    data: [
      {
        _id: "staff123",
        staffId: "S001",
        name: "John Doe",
        role: "Nurse",

        shifts: [
          {
            date: "2025-11-21",
            shift: "morning",
          },
          {
            date: "2025-11-22",
            shift: "night",
          },
        ],
      },
      {
        _id: "staff123",
        staffId: "S001",
        name: "John Doe",
        role: "Nurse",

        shifts: [
          {
            date: "2025-11-21",
            shift: "morning",
          },
          {
            date: "2025-11-22",
            shift: "night",
          },
        ],
      },
      {
        _id: "staff123",
        staffId: "S001",
        name: "John Doe",
        role: "Nurse",

        shifts: [
          {
            date: "2025-11-21",
            shift: "morning",
          },
          {
            date: "2025-11-22",
            shift: "night",
          },
        ],
      },
      {
        _id: "staff123",
        staffId: "S001",
        name: "John Doe",
        role: "Nurse",

        shifts: [
          {
            date: "2025-11-21",
            shift: "morning",
          },
          {
            date: "2025-11-22",
            shift: "night",
          },
        ],
      },
      {
        _id: "staff123",
        staffId: "S001",
        name: "John Doe",
        role: "Nurse",

        shifts: [
          {
            date: "2025-11-21",
            shift: "morning",
          },
          {
            date: "2025-11-22",
            shift: "night",
          },
        ],
      },
    ],
  });
});

export default router;
