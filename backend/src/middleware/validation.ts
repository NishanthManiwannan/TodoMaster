import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";

/**
 * A higher-order function that returns an Express middleware.
 * It takes a Zod schema and validates the request against it.
 * This function enforces clean data before it touches the business logic.
 * @param schema The Zod schema to validate against (e.g., createTaskSchema)
 */
export const validate = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: e.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
