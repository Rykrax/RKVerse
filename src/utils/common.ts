export const getRoleLabel = (role?: string) => {
  switch (role?.toUpperCase()) {
    case "TRANSLATOR":
    case "ROLE_TRANSLATOR":
      return "Dịch giả";
    case "ADMIN":
    case "ROLE_ADMIN":
      return "Quản trị viên";
    case "USER":
    case "ROLE_USER":
      return "Thành viên";
    default:
      return role || "Thành viên";
  }
};
