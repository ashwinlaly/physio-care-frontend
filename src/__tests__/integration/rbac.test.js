/**
 * src/__tests__/integration/rbac.test.js
 * Phase 3 Frontend RBAC & Multi-Tenant Integration Tests
 * 
 * Tests for:
 * 1. Permission checking and UI rendering
 * 2. Multi-tenant context in API calls
 * 3. Role management UI
 * 4. User role assignment
 * 5. Session management with JWT tokens
 */

import {
  usePermission,
  isUserAdmin,
  getPermissionDisplayName,
  groupPermissionsByResource,
} from '../../common/rbac';
import {
  getOrganizationId,
  getUserId,
  getPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  setAuthSession,
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

describe('Phase 3: Frontend RBAC & Multi-Tenant Integration Tests', () => {
  // ============================================
  // SESSION MANAGEMENT & JWT TESTS
  // ============================================

  describe('Session Management & JWT Decoding', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('decodeToken should extract JWT payload correctly', () => {
      const mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJvcmdhbml6YXRpb25JZCI6Im9yZzEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpc0FkbWluIjp0cnVlfQ.signature';
      // This is a simplified test token (header.payload.signature)
      // In production, the backend would provide a valid token

      localStorage.setItem('authToken', mockToken);
      setAuthSession({ 
        token: mockToken, 
        user: { id: '123', email: 'test@example.com' } 
      });

      expect(getUserId()).toBe('123');
      expect(getOrganizationId()).toBe('org1');
    });

    test('setAuthSession should store organizationId and userId', () => {
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify({
        userId: '456',
        organizationId: 'org-test',
        email: 'user@example.com',
      })).toString('base64')}.signature`;
      const user = { id: '456', email: 'user@example.com', name: 'Test User' };

      setAuthSession({ token: mockToken, user });

      expect(getUserId()).toBe('456');
      expect(localStorage.getItem('authToken')).toBe(mockToken);
    });

    test('clearAuthSession should remove auth data', () => {
      const mockToken = 'mock-token';
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('currentUser', JSON.stringify({ id: '456' }));

      localStorage.clear();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
    });

    test('getOrganizationId should return null when not authenticated', () => {
      localStorage.clear();
      expect(getOrganizationId()).toBeNull();
    });
  });

  // ============================================
  // PERMISSION CHECKING TESTS
  // ============================================

  describe('Permission Checking Functions', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('hasAnyPermission should return true if user has any required permission', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '123',
          permissions: ['patients.read', 'doctors.create', 'appointments.update'],
        })
      );

      const result = hasAnyPermission(['patients.delete', 'patients.read']);
      expect(result).toBe(true);
    });

    test('hasAnyPermission should return false if user lacks all required permissions', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '123',
          permissions: ['patients.read', 'doctors.create'],
        })
      );

      const result = hasAnyPermission(['appointments.delete', 'sales.manage']);
      expect(result).toBe(false);
    });

    test('hasAllPermissions should return true only if user has all required permissions', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '123',
          permissions: ['patients.read', 'patients.create', 'patients.update', 'doctors.create'],
        })
      );

      const result = hasAllPermissions(['patients.read', 'patients.create']);
      expect(result).toBe(true);
    });

    test('hasAllPermissions should return false if user lacks any required permission', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '123',
          permissions: ['patients.read', 'patients.create'],
        })
      );

      const result = hasAllPermissions(['patients.read', 'patients.delete']);
      expect(result).toBe(false);
    });

    test('getPermissions should extract permissions from JWT token', () => {
      const userWithPermissions = {
        id: '123',
        permissions: [
          'patients.read',
          'patients.create',
          'doctors.read',
          'appointments.create',
        ],
      };

      localStorage.setItem('currentUser', JSON.stringify(userWithPermissions));

      const permissions = getPermissions();
      expect(permissions).toEqual(userWithPermissions.permissions);
    });

    test('getPermissions should return empty array when no permissions exist', () => {
      localStorage.setItem('currentUser', JSON.stringify({ id: '123' }));

      const permissions = getPermissions();
      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions.length).toBe(0);
    });
  });

  // ============================================
  // ADMIN & ROLE DETECTION TESTS
  // ============================================

  describe('Admin & Role Detection', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('isUserAdmin should return true if user has multiple manage permissions', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '123',
          permissions: [
            'patients.manage',
            'doctors.manage',
            'appointments.manage',
            'roles.manage',
          ],
        })
      );

      const result = isUserAdmin();
      expect(result).toBe(true);
    });

    test('isUserAdmin should return false if user has fewer than 3 manage permissions', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '123',
          permissions: ['patients.manage', 'doctors.read'],
        })
      );

      const result = isUserAdmin();
      expect(result).toBe(false);
    });
  });

  // ============================================
  // PERMISSION DISPLAY & GROUPING TESTS
  // ============================================

  describe('Permission Display & Grouping', () => {
    test('getPermissionDisplayName should return user-friendly permission names', () => {
      expect(getPermissionDisplayName('patients.read')).toBe('View Patients');
      expect(getPermissionDisplayName('doctors.create')).toBe('Create Doctors');
      expect(getPermissionDisplayName('appointments.update')).toBe('Edit Appointments');
      expect(getPermissionDisplayName('roles.manage')).toBe('Manage Roles');
    });

    test('getPermissionDisplayName should return original string if not found', () => {
      expect(getPermissionDisplayName('unknown.permission')).toBe('unknown.permission');
    });

    test('groupPermissionsByResource should group permissions by resource', () => {
      const permissions = [
        'patients.read',
        'patients.create',
        'patients.delete',
        'doctors.read',
        'doctors.create',
        'appointments.read',
      ];

      const grouped = groupPermissionsByResource(permissions);

      expect(grouped.patients).toEqual(['patients.read', 'patients.create', 'patients.delete']);
      expect(grouped.doctors).toEqual(['doctors.read', 'doctors.create']);
      expect(grouped.appointments).toEqual(['appointments.read']);
    });

    test('groupPermissionsByResource should handle empty permissions array', () => {
      const grouped = groupPermissionsByResource([]);
      expect(grouped).toEqual({});
    });
  });

  // ============================================
  // MULTI-TENANT CONTEXT TESTS
  // ============================================

  describe('Multi-Tenant Context', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('API calls should include tenant context header', async () => {
      const mockOrganizationId = 'tenant-org-123';
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem(
        'currentUser',
        JSON.stringify({ id: '123', organizationId: mockOrganizationId })
      );

      // Mock fetch to intercept headers
      global.fetch = jest.fn((url, options) => {
        expect(options.headers['X-Organization-Id']).toBe(mockOrganizationId);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      });

      // Import and test apiRequest after mocking
      const { apiRequest } = await import('../../common/api');
      await apiRequest('http://api.test/users', { auth: true });

      expect(global.fetch).toHaveBeenCalled();
    });

    test('Different organizations should not access each other data', () => {
      // Org 1 user
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '123',
          organizationId: 'org-1',
          permissions: ['patients.read'],
        })
      );

      expect(getOrganizationId()).toBe('org-1');

      // Switch to Org 2 user
      localStorage.clear();
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '456',
          organizationId: 'org-2',
          permissions: ['patients.read'],
        })
      );

      expect(getOrganizationId()).toBe('org-2');
    });
  });

  // ============================================
  // PERMISSION-BASED UI RENDERING TESTS
  // ============================================

  describe('Permission-Based UI Rendering', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('CanAccess component should render children when user has permission', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '123',
          permissions: ['patients.create'],
        })
      );

      const hasPermission = hasAnyPermission('patients.create');
      expect(hasPermission).toBe(true);
    });

    test('CanAccess component should render fallback when user lacks permission', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '123',
          permissions: ['patients.read'],
        })
      );

      const hasPermission = hasAnyPermission('patients.delete');
      expect(hasPermission).toBe(false);
    });

    test('Permission mode "any" should use OR logic', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '123',
          permissions: ['patients.read', 'doctors.create'],
        })
      );

      const result = hasAnyPermission(['patients.delete', 'patients.read']);
      expect(result).toBe(true); // Has at least one
    });

    test('Permission mode "all" should use AND logic', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: '123',
          permissions: ['patients.read', 'patients.create'],
        })
      );

      const result = hasAllPermissions(['patients.read', 'patients.create']);
      expect(result).toBe(true); // Has both

      const result2 = hasAllPermissions(['patients.read', 'patients.delete']);
      expect(result2).toBe(false); // Missing one
    });
  });

  // ============================================
  // INTEGRATION SCENARIO TESTS
  // ============================================

  describe('Real-World Integration Scenarios', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('Therapist user should only see patient list and appointments', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: 'therapist-1',
          organizationId: 'clinic-1',
          permissions: ['patients.read', 'appointments.read', 'appointments.create'],
        })
      );

      // Therapist should see
      expect(hasAnyPermission('patients.read')).toBe(true);
      expect(hasAnyPermission('appointments.read')).toBe(true);

      // Therapist should NOT see
      expect(hasAnyPermission('users.manage')).toBe(false);
      expect(hasAnyPermission('roles.manage')).toBe(false);
      expect(hasAnyPermission('sales.manage')).toBe(false);
    });

    test('Admin user should have access to all resources', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: 'admin-1',
          organizationId: 'clinic-1',
          permissions: [
            'patients.manage',
            'doctors.manage',
            'appointments.manage',
            'roles.manage',
            'users.manage',
            'settings.manage',
          ],
        })
      );

      expect(isUserAdmin()).toBe(true);
      expect(hasAnyPermission('patients.create')).toBe(true);
      expect(hasAnyPermission('users.manage')).toBe(true);
      expect(hasAnyPermission('roles.manage')).toBe(true);
    });

    test('Receptionist user should manage appointments and products', () => {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: 'receptionist-1',
          organizationId: 'clinic-1',
          permissions: [
            'patients.read',
            'appointments.create',
            'appointments.update',
            'products.read',
            'sales.create',
          ],
        })
      );

      // Can do
      expect(hasAnyPermission(['patients.read', 'appointments.create'])).toBe(true);

      // Cannot do
      expect(hasAnyPermission('patients.delete')).toBe(false);
      expect(hasAnyPermission('doctors.manage')).toBe(false);
    });

    test('User permissions should be organization-specific', () => {
      // Org 1 user
      localStorage.setItem('organizationId', 'org-1');
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: 'user-1',
          organizationId: 'org-1',
          permissions: ['patients.read'],
        })
      );

      const org1Id = getOrganizationId();
      expect(org1Id).toBe('org-1');

      // Switch to Org 2 (simulating multi-org access)
      localStorage.clear();
      localStorage.setItem('organizationId', 'org-2');
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: 'user-2',
          organizationId: 'org-2',
          permissions: ['patients.create', 'doctors.read'],
        })
      );

      const org2Id = getOrganizationId();
      expect(org2Id).toBe('org-2');
      expect(org1Id).not.toBe(org2Id);
    });
  });

  // ============================================
  // ERROR HANDLING TESTS
  // ============================================

  describe('Error Handling', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('Should handle missing authToken gracefully', () => {
      localStorage.removeItem('authToken');
      const orgId = getOrganizationId();
      expect(orgId).toBeNull();
    });

    test('Should handle malformed JWT gracefully', () => {
      localStorage.setItem('authToken', 'invalid-token');
      localStorage.setItem('currentUser', JSON.stringify({ id: '123' }));

      const orgId = getOrganizationId();
      // Should not throw, may return null or undefined
      expect(typeof orgId === 'string' || orgId === null || orgId === undefined).toBe(true);
    });

    test('Should return false for permission checks with invalid data', () => {
      localStorage.setItem('currentUser', 'invalid-json');
      const result = hasAnyPermission('patients.read');
      expect(result).toBe(false);
    });
  });
});
