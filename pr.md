# Fix: AI Schedule Updates for New Schedules

## 📌 Summary

This PR fixes a critical bug where AI-generated schedule updates were not being saved for new schedules that hadn't been stored in the database yet. The changes ensure that all schedule updates, whether for existing or new schedules, are properly persisted.

## 🔍 Related Issues

Closes #XXX

## 🛠 Changes Made

- Removed unused imports and functions to clean up the codebase
- Added proper handling of schedule updates for new schedules by:
  - Transforming class numbers to selected sections before updating
  - Ensuring new schedules are properly initialized with the correct structure
  - Maintaining custom events when updating schedules
- Fixed the bug where AI updates weren't being saved for new schedules by properly handling the schedule update flow

## ✅ Checklist

- [x] My code follows the **PolyLink Contribution Guidelines**
- [x] I have **tested my changes** to ensure they work as expected
- [x] I have **documented my changes**
- [x] My PR has **a clear title and description**

## ❓ Additional Notes

This fix was critical for ensuring a consistent user experience when using the AI schedule builder, as it now properly handles both new and existing schedules. The changes maintain backward compatibility while fixing the core issue of schedule updates not being persisted for new schedules.
