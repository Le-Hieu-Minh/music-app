import { Request, Response, NextFunction } from "express";
import { systemConfig } from "../../config/config";

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = res.locals.role;
    const allowed =
      role &&
      Array.isArray(role.permissions) &&
      role.permissions.includes(permission);

    if (!allowed) {
      const isApi =
        req.method === "PATCH" ||
        req.method === "DELETE" ||
        ((req.headers && req.headers.accept) || "").includes("application/json");

      if (isApi) {
        return res.status(403).json({
          code: 403,
          message: "Bạn không có quyền thực hiện thao tác này"
        });
      }

      req.flash("error", "Bạn không có quyền truy cập chức năng này");
      return res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
    }

    next();
  };
};
