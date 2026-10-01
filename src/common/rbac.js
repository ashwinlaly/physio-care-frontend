// src/common/rbac.js
import React from 'react';
import { getPermissions, hasAnyPermission, hasAllPermissions } from './sessionManager';

/**
 * Hook to check permissions in functional components
 * When called with no arguments, returns an object with hasPermission function
 * When called with permissions, returns boolean directly
 * @param {string|string[]} permissions - Single permission or array of permissions to check
 * @param {string} mode - 'any' for OR logic (default), 'all' for AND logic
 * @returns {boolean|Object} - True if user has required permission(s), or object with hasPermission function
 */
export const usePermission = (permissions, mode = 'any') => {
  // If no permissions passed, return object with hasPermission function
  if (permissions === undefined) {
    return {
      hasPermission: (permission) => {
        const permissionsArray = Array.isArray(permission) ? permission : [permission];
        if (mode === 'all') {
          return hasAllPermissions(permissionsArray);
        }
        return hasAnyPermission(permissionsArray);
      }
    };
  }
  
  // If permissions passed, return boolean directly (backward compatible)
  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
  
  if (mode === 'all') {
    return hasAllPermissions(permissionsArray);
  }
  return hasAnyPermission(permissionsArray);
};

/**
 * Component to conditionally render content based on permissions
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if user has permission
 * @param {string|string[]} props.require - Permission(s) required
 * @param {string} props.mode - 'any' for OR logic (default), 'all' for AND logic
 * @param {React.ReactNode} props.fallback - Content to render if no permission (default: null)
 * @param {string} props.testId - Test ID for testing
 */
export const CanAccess = ({ 
  children, 
  require, 
  mode = 'any', 
  fallback = null,
  testId = 'can-access'
}) => {
  const hasUserPermission = usePermission(require, mode);
  
  if (!hasUserPermission) {
    return fallback;
  }
  
  return <div data-testid={testId}>{children}</div>;
};

/**
 * HOC to wrap components with permission checking
 * @param {React.Component} Component - Component to wrap
 * @param {string|string[]} requiredPermissions - Required permission(s)
 * @param {string} mode - 'any' for OR logic (default), 'all' for AND logic
 * @param {React.Component} FallbackComponent - Component to render if no permission
 * @returns {React.Component} - Wrapped component
 */
export const withPermission = (
  Component,
  requiredPermissions,
  mode = 'any',
  FallbackComponent = () => null
) => {
  return (props) => {
    const hasUserPermission = usePermission(requiredPermissions, mode);
    
    if (!hasUserPermission) {
      return <FallbackComponent {...props} />;
    }
    
    return <Component {...props} />;
  };
};

/**
 * Hook to get all current user permissions
 * @returns {string[]} - Array of permission strings
 */
export const useCurrentPermissions = () => {
  return getPermissions();
};

/**
 * Get permission display name (user-friendly format)
 * @param {string} permission - Permission string (e.g., 'patients.read')
 * @returns {string} - Display name (e.g., 'View Patients')
 */
export const getPermissionDisplayName = (permission) => {
  const permissionMap = {
    'patients.read': 'View Patients',
    'patients.create': 'Create Patients',
    'patients.update': 'Edit Patients',
    'patients.delete': 'Delete Patients',
    'doctors.read': 'View Doctors',
    'doctors.create': 'Create Doctors',
    'doctors.update': 'Edit Doctors',
    'doctors.delete': 'Delete Doctors',
    'appointments.read': 'View Appointments',
    'appointments.create': 'Create Appointments',
    'appointments.update': 'Edit Appointments',
    'appointments.delete': 'Delete Appointments',
    'assessments.read': 'View Assessments',
    'assessments.create': 'Create Assessments',
    'assessments.update': 'Edit Assessments',
    'assessments.delete': 'Delete Assessments',
    'treatments.read': 'View Treatments',
    'treatments.create': 'Create Treatments',
    'treatments.update': 'Edit Treatments',
    'treatments.delete': 'Delete Treatments',
    'products.read': 'View Products',
    'products.create': 'Create Products',
    'products.update': 'Edit Products',
    'products.delete': 'Delete Products',
    'sales.read': 'View Sales',
    'sales.create': 'Create Sales',
    'sales.update': 'Edit Sales',
    'sales.delete': 'Delete Sales',
    'expenses.read': 'View Expenses',
    'expenses.create': 'Create Expenses',
    'expenses.update': 'Edit Expenses',
    'expenses.delete': 'Delete Expenses',
    'attendance.read': 'View Attendance',
    'attendance.create': 'Create Attendance',
    'attendance.update': 'Edit Attendance',
    'attendance.delete': 'Delete Attendance',
    'dashboard.read': 'View Dashboard',
    'users.read': 'View Users',
    'users.create': 'Create Users',
    'users.update': 'Edit Users',
    'users.delete': 'Delete Users',
    'users.manage': 'Manage Users',
    'roles.read': 'View Roles',
    'roles.create': 'Create Roles',
    'roles.update': 'Edit Roles',
    'roles.delete': 'Delete Roles',
    'roles.manage': 'Manage Roles',
    'permissions.read': 'View Permissions',
    'permissions.manage': 'Manage Permissions',
    'settings.read': 'View Settings',
    'settings.update': 'Edit Settings',
    'settings.manage': 'Manage Settings',
    'audit_logs.read': 'View Audit Logs',
  };
  
  return permissionMap[permission] || permission;
};

/**
 * Group permissions by resource
 * @param {string[]} permissions - Array of permission strings
 * @returns {Object} - Grouped permissions by resource
 */
export const groupPermissionsByResource = (permissions) => {
  const grouped = {};
  
  permissions.forEach((permission) => {
    const [resource] = permission.split('.');
    if (!grouped[resource]) {
      grouped[resource] = [];
    }
    grouped[resource].push(permission);
  });
  
  return grouped;
};

/**
 * Check if user is an admin (has manage permissions for multiple resources)
 * @returns {boolean} - True if user appears to be admin
 */
export const isUserAdmin = () => {
  const permissions = getPermissions();
  const managePermissions = permissions.filter((p) => p.includes('.manage'));
  return managePermissions.length >= 3; // Admin typically has manage perms for 3+ resources
};

/**
 * Utility to conditionally disable form fields based on permissions
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if field should be disabled
 */
export const isFieldDisabled = (permission) => {
  return !hasAnyPermission([permission]);
};
