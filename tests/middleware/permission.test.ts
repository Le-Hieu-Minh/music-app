import { Request, Response, NextFunction } from "express";
import { requirePermission } from "../../middlewares/admin/permission.middleware";

const mockRes = () => {
  const res: Partial<Response> & {
    locals: any;
    statusCode?: number;
    body?: any;
    redirectUrl?: string;
  } = {
    locals: {}
  };
  res.status = jest.fn().mockImplementation((code: number) => {
    res.statusCode = code;
    return res as Response;
  });
  res.json = jest.fn().mockImplementation((body: any) => {
    res.body = body;
    return res as Response;
  });
  res.redirect = jest.fn().mockImplementation((url: string) => {
    res.redirectUrl = url;
    return res as Response;
  });
  return res as Response & {
    locals: any;
    statusCode?: number;
    body?: any;
    redirectUrl?: string;
  };
};

describe("requirePermission", () => {
  it("calls next when permission exists", () => {
    const middleware = requirePermission("music_view");
    const req = { method: "GET", flash: jest.fn() } as any as Request;
    const res = mockRes();
    res.locals.role = { permissions: ["music_view", "music_edit"] };
    const next = jest.fn() as NextFunction;

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 403 json for PATCH without permission", () => {
    const middleware = requirePermission("music_delete");
    const req = {
      method: "PATCH",
      flash: jest.fn(),
      headers: { accept: "application/json" }
    } as any as Request;
    const res = mockRes();
    res.locals.role = { permissions: ["music_view"] };
    const next = jest.fn() as NextFunction;

    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.body.code).toBe(403);
  });

  it("redirects for GET without permission", () => {
    const middleware = requirePermission("music_view");
    const req = {
      method: "GET",
      flash: jest.fn(),
      get: () => undefined,
      headers: {}
    } as any;
    const res = mockRes();
    res.locals.role = { permissions: [] };
    const next = jest.fn() as NextFunction;

    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalled();
  });
});
