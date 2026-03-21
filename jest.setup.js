/**
 * Jest setup: prevent expo's winter runtime from crashing in the jest/CommonJS environment.
 *
 * expo/src/winter/installGlobal.ts installs lazy getters for WinterCG globals
 * (structuredClone, __ExpoImportMetaRegistry, etc.) that lazily require
 * expo/src/winter/runtime.native.ts. That file cannot run in jest because it
 * uses `import.meta` (ESM-only) which jest-runtime throws on.
 *
 * The installGlobal helper SKIPS installing its getter when the property already
 * exists with { configurable: false }. So we pre-define all problematic globals
 * as non-configurable safe implementations before expo can install its getters.
 */

// structuredClone — installed by runtime.native.ts line 23
if (typeof global.structuredClone === 'undefined') {
  Object.defineProperty(global, 'structuredClone', {
    value: function structuredClone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    configurable: false,
    writable: true,
    enumerable: true,
  });
} else {
  // Node already has structuredClone; lock it so expo can't override it
  try {
    const native = Object.getOwnPropertyDescriptor(global, 'structuredClone');
    if (native && native.configurable) {
      Object.defineProperty(global, 'structuredClone', {
        ...native,
        configurable: false,
      });
    }
  } catch (_e) {}
}

// __ExpoImportMetaRegistry — installed by runtime.native.ts line 20
try {
  Object.defineProperty(global, '__ExpoImportMetaRegistry', {
    value: {},
    configurable: false,
    writable: true,
    enumerable: false,
  });
} catch (_e) {}
