import { describe,expect,it } from "vitest";
import { authorize,type AuthUser } from "../auth";
import { isOverdue,occurrenceKey } from "../tasks";
import { AppError } from "../errors";
const user=(role:AuthUser["role"]):AuthUser=>({id:"u1",propertyId:"p1",email:"employee@example.test",displayName:"Employee",role,departmentId:null});
describe("central authorization",()=>{
 it("defaults a department employee away from assignment and admin",()=>{expect(()=>authorize(user("HOUSEKEEPING"),"task.assign")).toThrow(AppError);expect(()=>authorize(user("HOUSEKEEPING"),"admin.manage")).toThrow(AppError)});
 it("permits supervisors to assign but not administer",()=>{expect(()=>authorize(user("HOUSEKEEPING_SUPERVISOR"),"task.assign")).not.toThrow();expect(()=>authorize(user("HOUSEKEEPING_SUPERVISOR"),"admin.manage")).toThrow()});
 it("permits only administrators to administer",()=>expect(()=>authorize(user("ADMIN"),"admin.manage")).not.toThrow());
});
describe("operational scheduling",()=>{
 it("uses exact instants for due state",()=>{const now=new Date("2026-11-01T06:00:00.000Z");expect(isOverdue("2026-11-01T05:59:59.999Z",now)).toBe(true);expect(isOverdue("2026-11-01T06:00:00.000Z",now)).toBe(false);expect(isOverdue(null,now)).toBe(false)});
 it("creates a stable duplicate-prevention key per occurrence",()=>{expect(occurrenceKey("template-a","2026-11-01T05:00:00.000Z")).toBe("template-a:2026-11-01T05:00:00.000Z")});
});
