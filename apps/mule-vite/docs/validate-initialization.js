/**
 * Browser Console Validation Script for Initialization Flow
 * 
 * Usage:
 * 1. Navigate to /initialize and wait for completion
 * 2. Navigate to dashboard
 * 3. Open browser console
 * 4. Copy and paste this entire script
 * 5. Run: validateInitialization()
 */

function validateInitialization() {
  console.log('🔍 Validating Initialization Flow...\n');
  
  // Get query client from window (assuming it's exposed)
  const queryClient = window.__REACT_QUERY_CLIENT__;
  
  if (!queryClient) {
    console.error('❌ QueryClient not found. Make sure React Query DevTools is enabled.');
    console.log('💡 Add this to your app: window.__REACT_QUERY_CLIENT__ = queryClient');
    return;
  }

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // Test 1: Check contacts query state
  console.log('📋 Test 1: Contacts Query State');
  const contactsState = queryClient.getQueryState(['contacts']);
  if (contactsState) {
    console.log('  ✅ Contacts query exists');
    console.log('  Status:', contactsState.status);
    console.log('  Data updated:', new Date(contactsState.dataUpdatedAt).toLocaleString());
    
    if (contactsState.status === 'success') {
      console.log('  ✅ Status is success');
      results.passed++;
    } else {
      console.log('  ❌ Status is not success');
      results.failed++;
    }
    
    if (contactsState.dataUpdatedAt > 0) {
      console.log('  ✅ Has dataUpdatedAt timestamp');
      results.passed++;
    } else {
      console.log('  ❌ Missing dataUpdatedAt timestamp');
      results.failed++;
    }
  } else {
    console.log('  ❌ Contacts query not found in cache');
    results.failed++;
  }
  console.log('');

  // Test 2: Check organization query state
  console.log('📋 Test 2: Organization Query State');
  const orgState = queryClient.getQueryState(['organization']);
  if (orgState) {
    console.log('  ✅ Organization query exists');
    console.log('  Status:', orgState.status);
    console.log('  Data updated:', new Date(orgState.dataUpdatedAt).toLocaleString());
    
    if (orgState.status === 'success') {
      console.log('  ✅ Status is success');
      results.passed++;
    } else {
      console.log('  ❌ Status is not success');
      results.failed++;
    }
    
    if (orgState.dataUpdatedAt > 0) {
      console.log('  ✅ Has dataUpdatedAt timestamp');
      results.passed++;
    } else {
      console.log('  ❌ Missing dataUpdatedAt timestamp');
      results.failed++;
    }
  } else {
    console.log('  ❌ Organization query not found in cache');
    results.failed++;
  }
  console.log('');

  // Test 3: Check data freshness
  console.log('📋 Test 3: Data Freshness');
  const now = Date.now();
  const staleTime = 5 * 60 * 1000; // 5 minutes
  
  if (contactsState) {
    const age = now - contactsState.dataUpdatedAt;
    const isFresh = age < staleTime;
    console.log(`  Contacts age: ${Math.round(age / 1000)}s`);
    if (isFresh) {
      console.log('  ✅ Contacts data is fresh');
      results.passed++;
    } else {
      console.log('  ⚠️  Contacts data is stale');
      results.warnings++;
    }
  }
  
  if (orgState) {
    const age = now - orgState.dataUpdatedAt;
    const isFresh = age < staleTime;
    console.log(`  Organization age: ${Math.round(age / 1000)}s`);
    if (isFresh) {
      console.log('  ✅ Organization data is fresh');
      results.passed++;
    } else {
      console.log('  ⚠️  Organization data is stale');
      results.warnings++;
    }
  }
  console.log('');

  // Test 4: Check actual data
  console.log('📋 Test 4: Cached Data');
  const contactsData = queryClient.getQueryData(['contacts']);
  const orgData = queryClient.getQueryData(['organization']);
  
  if (contactsData) {
    console.log(`  ✅ Contacts data exists (${Array.isArray(contactsData) ? contactsData.length : 'N/A'} items)`);
    results.passed++;
  } else {
    console.log('  ❌ Contacts data missing');
    results.failed++;
  }
  
  if (orgData) {
    console.log('  ✅ Organization data exists');
    results.passed++;
  } else {
    console.log('  ❌ Organization data missing');
    results.failed++;
  }
  console.log('');

  // Summary
  console.log('📊 Summary');
  console.log(`  ✅ Passed: ${results.passed}`);
  console.log(`  ❌ Failed: ${results.failed}`);
  console.log(`  ⚠️  Warnings: ${results.warnings}`);
  console.log('');

  if (results.failed === 0) {
    console.log('🎉 All tests passed! Initialization is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.');
  }

  return results;
}

// Instructions
console.log('📝 To validate initialization, run: validateInitialization()');
