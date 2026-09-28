// src/common/permissions.js
/**
 * Frontend permission constants matching backend RBAC permissions
 * Format: resource.action
 */

// Patient permissions
export const PATIENT_READ = 'patients.read';
export const PATIENT_CREATE = 'patients.create';
export const PATIENT_UPDATE = 'patients.update';
export const PATIENT_DELETE = 'patients.delete';
export const PATIENT_MANAGE = 'patients.manage';

// Doctor permissions
export const DOCTOR_READ = 'doctors.read';
export const DOCTOR_CREATE = 'doctors.create';
export const DOCTOR_UPDATE = 'doctors.update';
export const DOCTOR_DELETE = 'doctors.delete';
export const DOCTOR_MANAGE = 'doctors.manage';

// Appointment permissions
export const APPOINTMENT_READ = 'appointments.read';
export const APPOINTMENT_CREATE = 'appointments.create';
export const APPOINTMENT_UPDATE = 'appointments.update';
export const APPOINTMENT_DELETE = 'appointments.delete';
export const APPOINTMENT_MANAGE = 'appointments.manage';

// Assessment permissions
export const ASSESSMENT_READ = 'assessments.read';
export const ASSESSMENT_CREATE = 'assessments.create';
export const ASSESSMENT_UPDATE = 'assessments.update';
export const ASSESSMENT_DELETE = 'assessments.delete';
export const ASSESSMENT_MANAGE = 'assessments.manage';

// Treatment permissions
export const TREATMENT_READ = 'treatments.read';
export const TREATMENT_CREATE = 'treatments.create';
export const TREATMENT_UPDATE = 'treatments.update';
export const TREATMENT_DELETE = 'treatments.delete';
export const TREATMENT_MANAGE = 'treatments.manage';

// Product permissions
export const PRODUCT_READ = 'products.read';
export const PRODUCT_CREATE = 'products.create';
export const PRODUCT_UPDATE = 'products.update';
export const PRODUCT_DELETE = 'products.delete';
export const PRODUCT_MANAGE = 'products.manage';

// Sales permissions
export const SALES_READ = 'sales.read';
export const SALES_CREATE = 'sales.create';
export const SALES_UPDATE = 'sales.update';
export const SALES_DELETE = 'sales.delete';
export const SALES_MANAGE = 'sales.manage';

// Expense permissions
export const EXPENSE_READ = 'expenses.read';
export const EXPENSE_CREATE = 'expenses.create';
export const EXPENSE_UPDATE = 'expenses.update';
export const EXPENSE_DELETE = 'expenses.delete';
export const EXPENSE_MANAGE = 'expenses.manage';

// Attendance permissions
export const ATTENDANCE_READ = 'attendance.read';
export const ATTENDANCE_CREATE = 'attendance.create';
export const ATTENDANCE_UPDATE = 'attendance.update';
export const ATTENDANCE_DELETE = 'attendance.delete';
export const ATTENDANCE_MANAGE = 'attendance.manage';

// Dashboard permissions
export const DASHBOARD_READ = 'dashboard.read';

// User permissions
export const USER_READ = 'users.read';
export const USER_CREATE = 'users.create';
export const USER_UPDATE = 'users.update';
export const USER_DELETE = 'users.delete';
export const USER_MANAGE = 'users.manage';

// Role permissions
export const ROLE_READ = 'roles.read';
export const ROLE_CREATE = 'roles.create';
export const ROLE_UPDATE = 'roles.update';
export const ROLE_DELETE = 'roles.delete';
export const ROLE_MANAGE = 'roles.manage';

// Permission management permissions
export const PERMISSION_READ = 'permissions.read';

// Settings permissions
export const SETTINGS_READ = 'settings.read';
export const SETTINGS_UPDATE = 'settings.update';
export const SETTINGS_MANAGE = 'settings.manage';

// Audit log permissions
export const AUDIT_READ = 'audit_logs.read';

/**
 * All available permissions
 */
export const ALL_PERMISSIONS = [
  PATIENT_READ, PATIENT_CREATE, PATIENT_UPDATE, PATIENT_DELETE, PATIENT_MANAGE,
  DOCTOR_READ, DOCTOR_CREATE, DOCTOR_UPDATE, DOCTOR_DELETE, DOCTOR_MANAGE,
  APPOINTMENT_READ, APPOINTMENT_CREATE, APPOINTMENT_UPDATE, APPOINTMENT_DELETE, APPOINTMENT_MANAGE,
  ASSESSMENT_READ, ASSESSMENT_CREATE, ASSESSMENT_UPDATE, ASSESSMENT_DELETE, ASSESSMENT_MANAGE,
  TREATMENT_READ, TREATMENT_CREATE, TREATMENT_UPDATE, TREATMENT_DELETE, TREATMENT_MANAGE,
  PRODUCT_READ, PRODUCT_CREATE, PRODUCT_UPDATE, PRODUCT_DELETE, PRODUCT_MANAGE,
  SALES_READ, SALES_CREATE, SALES_UPDATE, SALES_DELETE, SALES_MANAGE,
  EXPENSE_READ, EXPENSE_CREATE, EXPENSE_UPDATE, EXPENSE_DELETE, EXPENSE_MANAGE,
  ATTENDANCE_READ, ATTENDANCE_CREATE, ATTENDANCE_UPDATE, ATTENDANCE_DELETE, ATTENDANCE_MANAGE,
  DASHBOARD_READ,
  USER_READ, USER_CREATE, USER_UPDATE, USER_DELETE, USER_MANAGE,
  ROLE_READ, ROLE_CREATE, ROLE_UPDATE, ROLE_DELETE, ROLE_MANAGE,
  PERMISSION_READ,
  SETTINGS_READ, SETTINGS_UPDATE, SETTINGS_MANAGE,
  AUDIT_READ,
];

/**
 * Menu/navigation permissions (legacy support)
 */
export const MENU_PERMISSIONS = {
  dashboard: DASHBOARD_READ,
  patients: PATIENT_READ,
  doctors: DOCTOR_READ,
  appointments: APPOINTMENT_READ,
  assessments: ASSESSMENT_READ,
  treatments: TREATMENT_READ,
  products: PRODUCT_READ,
  sales: SALES_READ,
  expenses: EXPENSE_READ,
  attendance: ATTENDANCE_READ,
  users: USER_READ,
  roles: ROLE_READ,
  settings: SETTINGS_READ,
};

/**
 * Permission options for UI selectors
 * Formatted as {label, key} for use in forms/checkboxes
 */
export const PERMISSION_OPTIONS = [
  { label: 'Dashboard', key: DASHBOARD_READ },
  { label: 'Patients - Read', key: PATIENT_READ },
  { label: 'Patients - Create', key: PATIENT_CREATE },
  { label: 'Patients - Update', key: PATIENT_UPDATE },
  { label: 'Patients - Delete', key: PATIENT_DELETE },
  { label: 'Patients - Manage', key: PATIENT_MANAGE },
  { label: 'Doctors - Read', key: DOCTOR_READ },
  { label: 'Doctors - Create', key: DOCTOR_CREATE },
  { label: 'Doctors - Update', key: DOCTOR_UPDATE },
  { label: 'Doctors - Delete', key: DOCTOR_DELETE },
  { label: 'Doctors - Manage', key: DOCTOR_MANAGE },
  { label: 'Appointments - Read', key: APPOINTMENT_READ },
  { label: 'Appointments - Create', key: APPOINTMENT_CREATE },
  { label: 'Appointments - Update', key: APPOINTMENT_UPDATE },
  { label: 'Appointments - Delete', key: APPOINTMENT_DELETE },
  { label: 'Appointments - Manage', key: APPOINTMENT_MANAGE },
  { label: 'Assessments - Read', key: ASSESSMENT_READ },
  { label: 'Assessments - Create', key: ASSESSMENT_CREATE },
  { label: 'Assessments - Update', key: ASSESSMENT_UPDATE },
  { label: 'Assessments - Delete', key: ASSESSMENT_DELETE },
  { label: 'Assessments - Manage', key: ASSESSMENT_MANAGE },
  { label: 'Treatments - Read', key: TREATMENT_READ },
  { label: 'Treatments - Create', key: TREATMENT_CREATE },
  { label: 'Treatments - Update', key: TREATMENT_UPDATE },
  { label: 'Treatments - Delete', key: TREATMENT_DELETE },
  { label: 'Treatments - Manage', key: TREATMENT_MANAGE },
  { label: 'Products - Read', key: PRODUCT_READ },
  { label: 'Products - Create', key: PRODUCT_CREATE },
  { label: 'Products - Update', key: PRODUCT_UPDATE },
  { label: 'Products - Delete', key: PRODUCT_DELETE },
  { label: 'Products - Manage', key: PRODUCT_MANAGE },
  { label: 'Sales - Read', key: SALES_READ },
  { label: 'Sales - Create', key: SALES_CREATE },
  { label: 'Sales - Update', key: SALES_UPDATE },
  { label: 'Sales - Delete', key: SALES_DELETE },
  { label: 'Sales - Manage', key: SALES_MANAGE },
  { label: 'Expenses - Read', key: EXPENSE_READ },
  { label: 'Expenses - Create', key: EXPENSE_CREATE },
  { label: 'Expenses - Update', key: EXPENSE_UPDATE },
  { label: 'Expenses - Delete', key: EXPENSE_DELETE },
  { label: 'Expenses - Manage', key: EXPENSE_MANAGE },
  { label: 'Attendance - Read', key: ATTENDANCE_READ },
  { label: 'Attendance - Create', key: ATTENDANCE_CREATE },
  { label: 'Attendance - Update', key: ATTENDANCE_UPDATE },
  { label: 'Attendance - Delete', key: ATTENDANCE_DELETE },
  { label: 'Attendance - Manage', key: ATTENDANCE_MANAGE },
  { label: 'Users - Read', key: USER_READ },
  { label: 'Users - Create', key: USER_CREATE },
  { label: 'Users - Update', key: USER_UPDATE },
  { label: 'Users - Delete', key: USER_DELETE },
  { label: 'Users - Manage', key: USER_MANAGE },
  { label: 'Roles - Read', key: ROLE_READ },
  { label: 'Roles - Create', key: ROLE_CREATE },
  { label: 'Roles - Update', key: ROLE_UPDATE },
  { label: 'Roles - Delete', key: ROLE_DELETE },
  { label: 'Roles - Manage', key: ROLE_MANAGE },
  { label: 'Permissions - Read', key: PERMISSION_READ },
  { label: 'Settings - Read', key: SETTINGS_READ },
  { label: 'Settings - Update', key: SETTINGS_UPDATE },
  { label: 'Settings - Manage', key: SETTINGS_MANAGE },
  { label: 'Audit Logs - Read', key: AUDIT_READ },
];
