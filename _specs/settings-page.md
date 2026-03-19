# Spec for Settings Page

branch: claude/feature/settings-page

## Summary
Add a settings page that allows users to customize the dashboard appearance. The page includes two settings: a font selector to choose the dashboard font, and a background color selector to choose the dashboard background color. Settings are loaded from and saved to a `/api/settings` endpoint. A save button persists the changes and immediately applies them to the dashboard page.

## Functional Requirements
- The settings page is accessible from the existing sidebar navigation at `/settings`
- On page load, current settings are fetched from `GET /api/settings`
- A font selector allows the user to choose from a list of available fonts (e.g. Playfair Display, Inter, Roboto, Open Sans, Lato)
- A background color selector allows the user to pick a background color for the dashboard
- A "Save" button sends the updated settings to `PUT /api/settings`
- After saving, the selected font and background color are immediately applied to the dashboard page without requiring a full page reload
- Settings persist across navigation between pages (within the same session)
- The API returns sensible defaults when no settings have been saved yet

## Possible Edge Cases
- User navigates to dashboard before any settings have been saved (should use defaults)
- User changes settings but navigates away without saving (changes are discarded)
- API call to save settings fails (show error feedback to the user)
- Invalid color value submitted (API should validate)

## Acceptance Criteria
- Settings page renders with font selector and color picker
- Font selector displays available font options and reflects the current setting
- Color picker displays the current background color setting
- Clicking Save sends updated values to the API
- After saving, navigating to the dashboard shows the new font and background color applied
- Page load fetches current settings from the API and populates the form

## Open Questions
- Should settings persist across server restarts (database) or is in-memory sufficient for now? no
- Should there be a "Reset to defaults" button? yes

# Testing Guidelines
Create a test file(s) in the ./test folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Settings API route returns default values on GET
- Settings API route accepts and returns updated values on PUT
- Settings API route validates input (rejects invalid values)
