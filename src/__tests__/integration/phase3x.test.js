/**
 * src/__tests__/integration/phase3x.test.js
 * Phase 3.x Frontend RBAC Integration Tests - Feature Pages
 * 
 * Tests all updated feature pages with permission indicators:
 * - AppointmentsPage
 * - ProductsPage
 * - SalesPage
 * - ExpensesPage
 * - AttendanceMarking
 * - MonthlyAttendanceReport
 * - FinancialDashboard
 * - DashboardPage
 * - UsersAccessPage
 * - AppLayout (navigation filtering)
 */

import {
  getOrganizationId,
  setAuthSession,
  getUserId,
  getPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  clearSessionTimer,
} from '../../common/sessionManager';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Phase 3.x: Feature Pages RBAC Integration Tests', () => {
  // ============================================
  // TEST SETUP & TEARDOWN
  // ============================================

  beforeEach(() => {
    localStorage.clear();
    clearSessionTimer();
  });

  afterEach(() => {
    localStorage.clear();
    clearSessionTimer();
  });

  // ============================================
  // TEST DATA - USER ROLES & PERMISSIONS
  // ============================================

  const testUsers = {
    admin: {
      id: 'admin-001',
      email: 'admin@test.com',
      role: 'Admin',
      organizationId: 'org-test',
      permissions: [
        // Admin has all permissions
        'patients.create', 'patients.read', 'patients.update', 'patients.delete',
        'doctors.create', 'doctors.read', 'doctors.update', 'doctors.delete',
        'appointments.create', 'appointments.read', 'appointments.update', 'appointments.delete',
        'products.create', 'products.read', 'products.update', 'products.delete',
        'sales.create', 'sales.read', 'sales.update', 'sales.delete',
        'expenses.create', 'expenses.read', 'expenses.update', 'expenses.delete',
        'attendance.create', 'attendance.read', 'attendance.update', 'attendance.delete',
        'dashboard.read', 'dashboard.update',
        'users.create', 'users.read', 'users.update', 'users.delete',
        'roles.create', 'roles.read', 'roles.update', 'roles.delete',
      ],
    },
    therapist: {
      id: 'therapist-001',
      email: 'therapist@test.com',
      role: 'Therapist',
      organizationId: 'org-test',
      permissions: [
        'patients.read', 'patients.update',
        'appointments.create', 'appointments.read', 'appointments.update',
        'dashboard.read',
        'attendance.create', 'attendance.read',
      ],
    },
    receptionist: {
      id: 'receptionist-001',
      email: 'receptionist@test.com',
      role: 'Receptionist',
      organizationId: 'org-test',
      permissions: [
        'patients.create', 'patients.read',
        'appointments.create', 'appointments.read',
        'doctors.read',
        'attendance.create', 'attendance.read',
      ],
    },
    patient: {
      id: 'patient-001',
      email: 'patient@test.com',
      role: 'Patient',
      organizationId: 'org-test',
      permissions: [
        'patients.read', // Only their own data
      ],
    },
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const setupUserSession = (user) => {
    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify({
      userId: user.id,
      organizationId: user.organizationId,
      email: user.email,
      permissions: user.permissions,
    })).toString('base64')}.signature`;

    setAuthSession({
      token: mockToken,
      user: user,
    });
    localStorage.setItem('permissions', JSON.stringify(user.permissions));
  };

  // ============================================
  // PERMISSION TESTS - APPOINTMENTS PAGE
  // ============================================

  describe('AppointmentsPage - Permission Indicators', () => {
    test('Admin should have all appointment permissions', () => {
      setupUserSession(testUsers.admin);

      expect(hasPermission('appointments.create')).toBe(true);
      expect(hasPermission('appointments.read')).toBe(true);
      expect(hasPermission('appointments.update')).toBe(true);
      expect(hasPermission('appointments.delete')).toBe(true);
    });

    test('Therapist should have create, read, update but not delete appointments', () => {
      setupUserSession(testUsers.therapist);

      expect(hasPermission('appointments.create')).toBe(true);
      expect(hasPermission('appointments.read')).toBe(true);
      expect(hasPermission('appointments.update')).toBe(true);
      expect(hasPermission('appointments.delete')).toBe(false);
    });

    test('Receptionist should have create and read appointments only', () => {
      setupUserSession(testUsers.receptionist);

      expect(hasPermission('appointments.create')).toBe(true);
      expect(hasPermission('appointments.read')).toBe(true);
      expect(hasPermission('appointments.update')).toBe(false);
      expect(hasPermission('appointments.delete')).toBe(false);
    });

    test('Patient should not have any appointment permissions', () => {
      setupUserSession(testUsers.patient);

      expect(hasPermission('appointments.create')).toBe(false);
      expect(hasPermission('appointments.read')).toBe(false);
      expect(hasPermission('appointments.update')).toBe(false);
      expect(hasPermission('appointments.delete')).toBe(false);
    });
  });

  // ============================================
  // PERMISSION TESTS - PRODUCTS PAGE
  // ============================================

  describe('ProductsPage - Permission Indicators', () => {
    test('Admin should have all product permissions', () => {
      setupUserSession(testUsers.admin);

      expect(hasPermission('products.create')).toBe(true);
      expect(hasPermission('products.read')).toBe(true);
      expect(hasPermission('products.update')).toBe(true);
      expect(hasPermission('products.delete')).toBe(true);
    });

    test('Therapist should not have product permissions', () => {
      setupUserSession(testUsers.therapist);

      expect(hasPermission('products.create')).toBe(false);
      expect(hasPermission('products.read')).toBe(false);
      expect(hasPermission('products.update')).toBe(false);
      expect(hasPermission('products.delete')).toBe(false);
    });

    test('Receptionist should not have product permissions', () => {
      setupUserSession(testUsers.receptionist);

      expect(hasPermission('products.create')).toBe(false);
      expect(hasPermission('products.read')).toBe(false);
      expect(hasPermission('products.update')).toBe(false);
      expect(hasPermission('products.delete')).toBe(false);
    });
  });

  // ============================================
  // PERMISSION TESTS - SALES PAGE
  // ============================================

  describe('SalesPage - Permission Indicators', () => {
    test('Admin should have all sales permissions', () => {
      setupUserSession(testUsers.admin);

      expect(hasPermission('sales.create')).toBe(true);
      expect(hasPermission('sales.read')).toBe(true);
      expect(hasPermission('sales.update')).toBe(true);
      expect(hasPermission('sales.delete')).toBe(true);
    });

    test('Therapist should not have sales permissions', () => {
      setupUserSession(testUsers.therapist);

      expect(hasPermission('sales.create')).toBe(false);
      expect(hasPermission('sales.read')).toBe(false);
    });
  });

  // ============================================
  // PERMISSION TESTS - EXPENSES PAGE
  // ============================================

  describe('ExpensesPage - Permission Indicators', () => {
    test('Admin should have all expense permissions', () => {
      setupUserSession(testUsers.admin);

      expect(hasPermission('expenses.create')).toBe(true);
      expect(hasPermission('expenses.read')).toBe(true);
      expect(hasPermission('expenses.update')).toBe(true);
      expect(hasPermission('expenses.delete')).toBe(true);
    });

    test('Therapist should not have expense permissions', () => {
      setupUserSession(testUsers.therapist);

      expect(hasPermission('expenses.create')).toBe(false);
      expect(hasPermission('expenses.read')).toBe(false);
    });
  });

  // ============================================
  // PERMISSION TESTS - ATTENDANCE
  // ============================================

  describe('AttendanceMarking & Report - Permission Indicators', () => {
    test('Admin should have all attendance permissions', () => {
      setupUserSession(testUsers.admin);

      expect(hasPermission('attendance.create')).toBe(true);
      expect(hasPermission('attendance.read')).toBe(true);
      expect(hasPermission('attendance.update')).toBe(true);
      expect(hasPermission('attendance.delete')).toBe(true);
    });

    test('Therapist should have attendance create and read permissions', () => {
      setupUserSession(testUsers.therapist);

      expect(hasPermission('attendance.create')).toBe(true);
      expect(hasPermission('attendance.read')).toBe(true);
      expect(hasPermission('attendance.update')).toBe(false);
      expect(hasPermission('attendance.delete')).toBe(false);
    });

    test('Receptionist should have attendance create and read permissions', () => {
      setupUserSession(testUsers.receptionist);

      expect(hasPermission('attendance.create')).toBe(true);
      expect(hasPermission('attendance.read')).toBe(true);
    });
  });

  // ============================================
  // PERMISSION TESTS - DASHBOARD & FINANCIAL
  // ============================================

  describe('DashboardPage & FinancialDashboard - Permission Indicators', () => {
    test('Admin should have dashboard read permission', () => {
      setupUserSession(testUsers.admin);

      expect(hasPermission('dashboard.read')).toBe(true);
    });

    test('Therapist should have dashboard read permission', () => {
      setupUserSession(testUsers.therapist);

      expect(hasPermission('dashboard.read')).toBe(true);
    });

    test('Receptionist should not have dashboard read permission', () => {
      setupUserSession(testUsers.receptionist);

      expect(hasPermission('dashboard.read')).toBe(false);
    });

    test('Patient should not have dashboard read permission', () => {
      setupUserSession(testUsers.patient);

      expect(hasPermission('dashboard.read')).toBe(false);
    });
  });

  // ============================================
  // PERMISSION TESTS - USERS ACCESS PAGE
  // ============================================

  describe('UsersAccessPage - Permission Indicators', () => {
    test('Admin should have all user management permissions', () => {
      setupUserSession(testUsers.admin);

      expect(hasPermission('users.create')).toBe(true);
      expect(hasPermission('users.read')).toBe(true);
      expect(hasPermission('users.update')).toBe(true);
      expect(hasPermission('users.delete')).toBe(true);
    });

    test('Therapist should not have user management permissions', () => {
      setupUserSession(testUsers.therapist);

      expect(hasPermission('users.create')).toBe(false);
      expect(hasPermission('users.read')).toBe(false);
      expect(hasPermission('users.update')).toBe(false);
      expect(hasPermission('users.delete')).toBe(false);
    });
  });

  // ============================================
  // PERMISSION TESTS - PATIENTS
  // ============================================

  describe('Patient Pages - Permission Indicators', () => {
    test('Admin should have all patient permissions', () => {
      setupUserSession(testUsers.admin);

      expect(hasPermission('patients.create')).toBe(true);
      expect(hasPermission('patients.read')).toBe(true);
      expect(hasPermission('patients.update')).toBe(true);
      expect(hasPermission('patients.delete')).toBe(true);
    });

    test('Therapist should have patient read and update permissions', () => {
      setupUserSession(testUsers.therapist);

      expect(hasPermission('patients.read')).toBe(true);
      expect(hasPermission('patients.update')).toBe(true);
      expect(hasPermission('patients.create')).toBe(false);
      expect(hasPermission('patients.delete')).toBe(false);
    });

    test('Receptionist should have patient create and read permissions', () => {
      setupUserSession(testUsers.receptionist);

      expect(hasPermission('patients.create')).toBe(true);
      expect(hasPermission('patients.read')).toBe(true);
      expect(hasPermission('patients.update')).toBe(false);
      expect(hasPermission('patients.delete')).toBe(false);
    });

    test('Patient should only have read permission (own data)', () => {
      setupUserSession(testUsers.patient);

      expect(hasPermission('patients.read')).toBe(true);
      expect(hasPermission('patients.create')).toBe(false);
      expect(hasPermission('patients.update')).toBe(false);
      expect(hasPermission('patients.delete')).toBe(false);
    });
  });

  // ============================================
  // PERMISSION TESTS - DOCTORS
  // ============================================

  describe('DoctorsPage - Permission Indicators', () => {
    test('Admin should have all doctor permissions', () => {
      setupUserSession(testUsers.admin);

      expect(hasPermission('doctors.create')).toBe(true);
      expect(hasPermission('doctors.read')).toBe(true);
      expect(hasPermission('doctors.update')).toBe(true);
      expect(hasPermission('doctors.delete')).toBe(true);
    });

    test('Therapist should not have doctor permissions', () => {
      setupUserSession(testUsers.therapist);

      expect(hasPermission('doctors.create')).toBe(false);
      expect(hasPermission('doctors.read')).toBe(false);
    });

    test('Receptionist should have doctor read permission', () => {
      setupUserSession(testUsers.receptionist);

      expect(hasPermission('doctors.read')).toBe(true);
      expect(hasPermission('doctors.create')).toBe(false);
      expect(hasPermission('doctors.update')).toBe(false);
      expect(hasPermission('doctors.delete')).toBe(false);
    });
  });

  // ============================================
  // PERMISSION LOGIC TESTS
  // ============================================

  describe('Permission Checking Logic', () => {
    test('hasAnyPermission should return true if user has ANY of the permissions', () => {
      setupUserSession(testUsers.therapist);

      expect(hasAnyPermission(['appointments.create', 'expenses.create'])).toBe(true);
      expect(hasAnyPermission(['expenses.create', 'products.create'])).toBe(false);
    });

    test('hasAllPermissions should return true only if user has ALL permissions', () => {
      setupUserSession(testUsers.admin);

      expect(hasAllPermissions(['patients.read', 'appointments.read', 'doctors.read'])).toBe(true);
      expect(hasAllPermissions(['patients.read', 'expenses.create'])).toBe(true);
    });

    test('hasAllPermissions should return false if user lacks any permission', () => {
      setupUserSession(testUsers.therapist);

      expect(hasAllPermissions(['appointments.create', 'appointments.delete'])).toBe(false);
      expect(hasAllPermissions(['patients.read', 'expenses.create'])).toBe(false);
    });
  });

  // ============================================
  // NAVIGATION MENU FILTERING TESTS
  // ============================================

  describe('AppLayout - Navigation Menu Filtering', () => {
    test('Admin should see all menu items', () => {
      setupUserSession(testUsers.admin);
      const expectedMenuItems = [
        'dashboard.read',
        'patients.create',
        'patients.read',
        'appointments.read',
        'doctors.read',
        'expenses.read',
        'users.read',
        'attendance.read',
        'products.read',
        'sales.read',
      ];

      expectedMenuItems.forEach((perm) => {
        expect(hasPermission(perm)).toBe(true);
      });
    });

    test('Therapist should see limited menu items', () => {
      setupUserSession(testUsers.therapist);
      const allowedMenuItems = [
        'dashboard.read',
        'patients.read',
        'appointments.read',
        'attendance.read',
      ];

      allowedMenuItems.forEach((perm) => {
        expect(hasPermission(perm)).toBe(true);
      });

      // These should NOT be visible for therapist
      expect(hasPermission('users.read')).toBe(false);
      expect(hasPermission('expenses.read')).toBe(false);
      expect(hasPermission('products.read')).toBe(false);
    });

    test('Patient should see minimal menu items', () => {
      setupUserSession(testUsers.patient);

      expect(hasPermission('patients.read')).toBe(true);
      expect(hasPermission('dashboard.read')).toBe(false);
    });
  });

  // ============================================
  // ORGANIZATION MULTI-TENANT TESTS
  // ============================================

  describe('Multi-Tenant Organization Context', () => {
    test('Organization ID should be stored and retrieved from session', () => {
      setupUserSession(testUsers.admin);
      expect(getOrganizationId()).toBe('org-test');
    });

    test('User ID should be stored and retrieved from session', () => {
      setupUserSession(testUsers.admin);
      expect(getUserId()).toBe('admin-001');
    });

    test('Different organizations should have isolated sessions', () => {
      // Setup org1 user
      setupUserSession(testUsers.admin);
      const org1 = getOrganizationId();

      // Setup org2 user
      const org2User = {
        ...testUsers.admin,
        organizationId: 'org-different',
      };
      setupUserSession(org2User);
      const org2 = getOrganizationId();

      expect(org1).not.toBe(org2);
      expect(org2).toBe('org-different');
    });

    test('Permissions should be per-user and per-organization', () => {
      setupUserSession(testUsers.therapist);
      const therapistPerms = getPermissions();

      setupUserSession(testUsers.admin);
      const adminPerms = getPermissions();

      expect(therapistPerms).not.toEqual(adminPerms);
      expect(adminPerms.length).toBeGreaterThan(therapistPerms.length);
    });
  });

  // ============================================
  // PERMISSION CONSISTENCY TESTS
  // ============================================

  describe('Permission Consistency Across Roles', () => {
    test('Admin should have superset of all other roles permissions', () => {
      setupUserSession(testUsers.admin);
      const adminPerms = getPermissions();

      const allPermissions = new Set();
      Object.values(testUsers).forEach((user) => {
        user.permissions.forEach((perm) => allPermissions.add(perm));
      });

      allPermissions.forEach((perm) => {
        expect(adminPerms).toContain(perm);
      });
    });

    test('Patient should have minimal permissions', () => {
      setupUserSession(testUsers.patient);
      const patientPermissions = getPermissions();

      expect(patientPermissions.length).toBe(1);
      expect(hasPermission('patients.read')).toBe(true);
    });

    test('Therapist should have more permissions than patient', () => {
      setupUserSession(testUsers.therapist);
      const therapistPerms = getPermissions();

      setupUserSession(testUsers.patient);
      const patientPerms = getPermissions();

      expect(therapistPerms.length).toBeGreaterThan(patientPerms.length);
    });
  });

  // ============================================
  // BACKWARD COMPATIBILITY TESTS
  // ============================================

  describe('Backward Compatibility', () => {
    test('Missing permission should default to false (deny by default)', () => {
      setupUserSession(testUsers.patient);

      // Permission that doesn't exist in patient's list
      expect(hasPermission('admin.special')).toBe(false);
    });

    test('Empty permissions list should deny all access', () => {
      setupUserSession({
        ...testUsers.patient,
        permissions: [],
      });

      expect(hasPermission('patients.read')).toBe(false);
      expect(hasPermission('dashboard.read')).toBe(false);
    });

    test('Session clearing should reset permissions', () => {
      setupUserSession(testUsers.admin);
      expect(hasPermission('patients.read')).toBe(true);

      localStorage.clear();
      clearSessionTimer();

      setupUserSession(testUsers.patient);
      expect(hasPermission('patients.read')).toBe(true);
      expect(hasPermission('users.read')).toBe(false);
    });
  });
});
